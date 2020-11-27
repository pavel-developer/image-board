import images from './images';
import boards from './boards';
import {Router} from 'express';

const router = Router();

router.use('/boards', boards);
router.use('/images', images);

export default router;