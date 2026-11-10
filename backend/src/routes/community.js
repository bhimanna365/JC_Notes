import { Router } from 'express';
import * as communityController from '../controllers/communityController.js';

const router = Router();

router.get('/messages', communityController.getMessages);
router.post('/messages', communityController.sendMessage);
router.post('/upload', communityController.uploadFile);
router.get('/files/:filename', communityController.getCommunityFile);
router.get('/available-files', communityController.getAvailableFiles);
router.post('/attach-existing', communityController.attachExistingFile);

export default router;
