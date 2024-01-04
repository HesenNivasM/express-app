import { Router } from 'express';
const router = Router();

import { verify } from '../middleware/auth-validation';
import { createNote, deleteNote, getNote, getNotes, shareNote, updateNote } from '../controllers/note';

router.post('/:id/share', verify, shareNote);
router.post('/', verify, createNote);
router.get('/:id', verify, getNote);
router.put('/:id', verify, updateNote);
router.delete('/:id', verify, deleteNote);
router.get('/', verify, getNotes);

export default router;
