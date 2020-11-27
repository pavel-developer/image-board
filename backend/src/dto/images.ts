interface Tag {
  confidence: number;
  tag: { en: string };
}

export interface ListOfImagesParamsDto {
  boardId: string;
}

export interface PutImagesParamsDto {
  boardId: string;
}

export interface PutImagesBodyDto {
  images: {
    url: string;
    tags: Tag[]
  }[];
}

export interface DeleteImageParamsDto {
  id: string;
}

export interface RunTaggingApiBodyDto {
  urls: string[];
}

export interface UpdateTagsForImageParamsDto {
  id: string;
}

export interface UpdateTagsForImageBodyDto {
  tags: Tag[];
}