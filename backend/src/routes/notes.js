import { Router } from 'express';
import * as notesController from '../controllers/notesController.js';

const router = Router();

router.get('/', notesController.getAllNotes);
router.get('/:id', notesController.getNoteById);

export default router;
