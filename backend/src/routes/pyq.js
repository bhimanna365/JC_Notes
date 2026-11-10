import { Router } from 'express';
import * as notesController from '../controllers/notesController.js';

const router = Router();

router.get('/', notesController.getPYQ);

export default router;
