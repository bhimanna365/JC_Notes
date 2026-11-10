import { Router } from 'express';
import * as notesController from '../controllers/notesController.js';

const router = Router();

router.get('/', notesController.getSyllabus);

export default router;
