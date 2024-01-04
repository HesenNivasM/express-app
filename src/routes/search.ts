import { Router } from 'express';
const router = Router();

import { verify } from '../middleware/auth-validation';
import { searchNote } from '../controllers/search';

router.get('/', verify, searchNote);

export default router;
