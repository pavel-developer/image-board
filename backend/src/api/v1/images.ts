import {Request, Response, Router} from 'express'
import {
  DeleteImageParamsDto,
  ListOfImagesParamsDto,
  PutImagesBodyDto,
  PutImagesParamsDto, RunTaggingApiBodyDto, UpdateTagsForImageBodyDto, UpdateTagsForImageParamsDto,
} from "@dto";
import {BoardEntity, ImageEntity} from "../../db/entities";
import {errorHandler} from "../../utils";
import createHttpError from "http-errors";
import axios from 'axios';

const router = Router();

router.delete('/:id', errorHandler(deleteImage));
router.get('/from-board/:boardId', errorHandler(listOfImages));
router.put('/to-board/:boardId', errorHandler(putImages));
router.put('/tagging', errorHandler(runTaggingApi));
router.put('/:id', errorHandler(updateTagsForImage));

async function listOfImages(req: Request<ListOfImagesParamsDto>) {
  const { boardId } = req.params;

  const images = await ImageEntity.find({ boardId });

  return {
    response: { images }
  };
}

async function putImages(req: Request<PutImagesParamsDto, unknown, PutImagesBodyDto>) {
  const { images } = req.body;
  const { boardId } = req.params;

  const urls: string[] = images.map(({ url }) => url);

  const board = await BoardEntity.findById(boardId);

  switch (true) {
    case !urls || !Array.isArray(urls):
      throw createHttpError(400, 'missing property "urls" in request body or it is not an array');
    case !!urls.find((url) => typeof url !== 'string'):
      throw createHttpError(400, 'url must be a string');
    case urls.length === 0:
      throw createHttpError(400, '"urls" is empty array');
    case !board:
      throw createHttpError(404, `can not find board with id "${boardId}"`);
    default: break;
  }

  const savedImages = Promise.all(
    images.map(async ({ url, tags}) => new ImageEntity({ url, boardId, tags: tags || [] }).save())
  );

  return {
    status: 201,
    response: { images: await savedImages }
  };
}

async function deleteImage(req: Request<DeleteImageParamsDto>) {
  const { id } = req.params;

  const image = await ImageEntity.findById(id);

  if (!image) {
    throw createHttpError(404, `can not find image with id "${id}"`);
  }

  await ImageEntity.deleteOne({ _id: id });

  return {
    status: 204
  };
}

async function runTaggingApi(req: Request<unknown, unknown, RunTaggingApiBodyDto>) {
  const { urls } = req.body;

  const tags = Promise.all(urls.map(async (url) => {
    const res = await axios.get('https://api.imagga.com/v2/tags', {
      params: {
        image_url: url,
        version: 2
      },
      headers: {
        accept: 'application/json',
        authorization: process.env.IMAGGA_AUTHORIZATION_TOKEN
      }
    });

    return {
      url,
      tags: res.data.result.tags
    };
  }));

  return {
    response: {
      tags: await tags
    }
  }
}

async function updateTagsForImage(req: Request<UpdateTagsForImageParamsDto, unknown, UpdateTagsForImageBodyDto>) {
  const { id } = req.params;
  const { tags } = req.body;

  const image = await ImageEntity.findById(id);

  if (!image) {
    throw createHttpError(404, `can not find image with id "${id}"`);
  }

  // @ts-ignore
  image.tags = tags;

  return {
    response: {
      image: await image.save()
    }
  }
}

export default router;
