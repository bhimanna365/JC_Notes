import { Router } from 'express';
import * as pdfController from '../controllers/pdfController.js';

const router = Router();

router.get('/inventory', pdfController.getInventory);
router.get('/', pdfController.getInventory);
router.get('/:id', pdfController.streamPDF);

export default router;
