export enum ImageChangeStatus {
  NEW = 'NEW',
  DELETED = 'DELETED',
  UPDATED = 'UPDATED'
}

export interface Tag {
  confidence: number;
  tag: { en: string };
}

export interface Image {
  tags: Tag[];
  url: string;
  boardId: string;
  _id: string;
}

export interface ChangedImage extends Partial<Image> {
  changeStatus?: ImageChangeStatus;
}
