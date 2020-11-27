import {Component, OnInit} from '@angular/core';
import {BoardsService} from "../../services/boards.service";
import {ImagesService} from "../../services/images.service";
import {ChangedImage, ImageChangeStatus, Tag} from "../../../types";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.scss']
})
export class ImagesListComponent implements OnInit {
  images: ChangedImage[] = [];

  constructor(
    private boardsService: BoardsService,
    private imagesService: ImagesService
  ) { }

  ngOnInit() {
    this.imagesService.images.subscribe((images) => this.images = images);

    this.boardsService.current
      .pipe(filter((board) => !!board))
      .subscribe((board) => {
        this.imagesService.getImagesFromBoard(board._id);
      });
  }

  deleteImage(image: ChangedImage, index: number) {
    if (!!image._id) {
      this.imagesService.changeImage(ImageChangeStatus.DELETED, image._id);
    } else {
      this.imagesService.images.value.splice(index, 1);
      this.imagesService.images.next([...this.imagesService.images.value]);
    }
  }

  cancelDelete(image: ChangedImage) {
    if (image.changeStatus === ImageChangeStatus.UPDATED) {
      image.tags = [];
    }
    image.changeStatus = undefined;
    this.imagesService.images.next([...this.imagesService.images.value]);
  }

  getTooltip(tags?: Tag[]): string {
    return tags ? tags.map(({ tag }) => tag.en).join(', ') : '';
  }
}
