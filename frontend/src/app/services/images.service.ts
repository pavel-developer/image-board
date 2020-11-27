import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {ChangedImage, Image, ImageChangeStatus, Tag} from "../../types";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  images: BehaviorSubject<ChangedImage[]> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient
  ) { }

  getImagesFromBoard(boardId: string) {
    this.http.get<{ images: Image[] }>(`${environment.apiUrl}/images/from-board/${boardId}`)
      .subscribe(({ images }) => this.images.next(images));
  }

  saveImagesToBoard(boardId: string, images: ChangedImage[]) {
    this.http.put(`${environment.apiUrl}/images/to-board/${boardId}`, { images })
      .subscribe(() => this.getImagesFromBoard(boardId));
  }

  deleteImage(imageId: string) {
    return this.http.delete(`${environment.apiUrl}/images/${imageId}`);
  }

  updateImage(imageId: string, tags: Tag[]) {
    return this.http.put(`${environment.apiUrl}/images/${imageId}`, { tags });
  }

  changeImage(changeStatus: ImageChangeStatus, urlOrId: string) {
    switch (changeStatus) {
      case ImageChangeStatus.NEW:
        const url = urlOrId;
        this.images.next([
          ...this.images.value,
          { changeStatus, url }
        ]);
        break;

      case ImageChangeStatus.UPDATED:
      case ImageChangeStatus.DELETED:
        const id = urlOrId;
        const image = this.images.value.find(({ _id }) => _id === id);

        if (changeStatus === ImageChangeStatus.UPDATED && image.changeStatus === ImageChangeStatus.DELETED) {
          break;
        }

        if (image) {
          image.changeStatus = changeStatus;
          this.images.next([ ...this.images.value ]);
        }
        break;

      default: break;
    }
  }

  runTaggingApi(urls: string[]) {
    return this.http.put<{ tags: { url: string, tags: Tag[] }[] }>(`${environment.apiUrl}/images/tagging`, { urls })
      .subscribe(({ tags }) => {
        tags.forEach((tagged) => {
          this.images.value
            .filter(({ tags: t }) => !t || !t.length )
            .filter(({ changeStatus }) => changeStatus !== ImageChangeStatus.DELETED)
            .filter(({ url }) => url === tagged.url)
            .forEach((image) => {
              image.tags = tagged.tags;
              if (image.changeStatus !== ImageChangeStatus.NEW) {
                image.changeStatus = ImageChangeStatus.UPDATED;
              }
            });
        });

        console.log(this.images.value);

        this.images.next([ ...this.images.value ]);
      });
  }
}
