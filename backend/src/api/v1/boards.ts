import {Request, Response, Router} from 'express';
import {CreateBoardBodyDto, DeleteBoardByIdParamsDto, GetBoardByIdParamsDto} from "@dto";
import {BoardEntity, ImageEntity} from '../../db/entities';
import {errorHandler} from '../../utils';
import createHttpError from 'http-errors';

const router = Router();

router.get('/', errorHandler(listOfBoards));
router.post('/', errorHandler(createBoard));
router.get('/:id', errorHandler(getBoardById));
router.delete('/:id', errorHandler(deleteBoardById));

async function listOfBoards () {
  const boards = await BoardEntity.find();

  return {
    response: { boards }
  };
}

async function createBoard (req: Request<unknown, unknown, CreateBoardBodyDto>) {
  const { name } = req.body;

  console.log(req.body);

  if (!name) {
    throw createHttpError(400, 'missing "name" property in request body');
  }

  const board = new BoardEntity({ name });
  await board.save();

  return {
    status: 201,
    response: { board }
  };
}

async function getBoardById (req: Request<GetBoardByIdParamsDto>) {
  const { id } = req.params;

  const board = await BoardEntity.findById(id);

  if (!board) {
    throw createHttpError(404, `can not find board with id "${id}"`);
  }

  return {
    response: { board }
  }
}

async function deleteBoardById (req: Request<DeleteBoardByIdParamsDto>) {
  const { id } = req.params;

  const board = await BoardEntity.findById(id);

  if (!board) {
    throw createHttpError(404, `can not find board with id "${id}"`);
  }

  await ImageEntity.deleteMany({ boardId: id });
  await BoardEntity.deleteOne({ _id: id });

  return { status: 204 }
}

export default router;