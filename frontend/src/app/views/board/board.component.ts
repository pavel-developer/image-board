import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BoardsService} from "../../services/boards.service";
import {Board, ChangedImage, ImageChangeStatus} from "../../../types";
import {ImagesService} from "../../services/images.service";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boards: Board[];
  current: Board|null;

  constructor(
    private modalService: NgbModal,
    private boardsService: BoardsService,
    private imagesService: ImagesService
  ) { }

  ngOnInit() {
    this.boardsService.boards.subscribe((boards) => this.boards = boards);
    this.boardsService.current.subscribe((current) => this.current = current);

    this.boardsService.getBoards();
  }

  async createNewBoard(modal) {
    const name = await this.modalService.open(modal, { centered: true }).result;

    if (name) {
      this.boardsService.createBoard(name);
    }
  }

  selectCurrent(id: string) {
    const selectedBoard = this.boardsService.boards.value.find((board) => board._id === id);
    this.boardsService.current.next(selectedBoard);
  }

  addImage(url: string) {
    this.imagesService.changeImage(ImageChangeStatus.NEW, url);
  }

  saveChanges() {
    if (!this.current) {
      return;
    }

    const imagesToUpload: ChangedImage[] = [];
    const imagesToDelete: ChangedImage[] = [];
    const imagesToUpdate: ChangedImage[] = [];

    this.imagesService.images.value.forEach((image) => {
      switch (image.changeStatus) {
        case ImageChangeStatus.NEW: imagesToUpload.push(image); break;
        case ImageChangeStatus.DELETED: imagesToDelete.push(image); break;
        case ImageChangeStatus.UPDATED: imagesToUpdate.push(image); break;
        default: break;
      }
    });

    if (imagesToUpload.length > 0) {
      this.imagesService.saveImagesToBoard(this.current._id, imagesToUpload);
    }

    if (imagesToUpdate.length > 0) {
      combineLatest(imagesToUpdate.map(({ _id, tags }) => (
        this.imagesService.updateImage(_id, tags)
      ))).subscribe(() => this.imagesService.getImagesFromBoard(this.current._id));
    }

    if (imagesToDelete.length > 0) {
      combineLatest(imagesToDelete.map(({ _id }) => this.imagesService.deleteImage(_id)))
        .subscribe(() => this.imagesService.getImagesFromBoard(this.current._id));
    }
  }

  get isChanged(): boolean {
    return !!this.imagesService.images.value.find(({ changeStatus }) => !!changeStatus);
  }

  dismissChanges() {
    const originalImages: ChangedImage[] = this.imagesService.images.value
      .filter(({ _id }) => !!_id)
      .map((image) => {
        if (image.changeStatus === ImageChangeStatus.UPDATED) {
          image.tags = [];
        }
        image.changeStatus = undefined;
        return image;
      });

    this.imagesService.images.next(originalImages);
  }

  runTaggingApi() {
    const urls: string[] = this.imagesService.images.value
      .filter((image) => image.changeStatus !== ImageChangeStatus.DELETED)
      .filter((image) => !image.tags || !image.tags.length)
      .map((image) => image.url);

    this.imagesService.runTaggingApi(urls);
  }
}
