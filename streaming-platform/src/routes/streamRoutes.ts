import { Router } from 'express';
import StreamController from '../controllers/streamController';

const router = Router();
const streamController = new StreamController();

export function setStreamRoutes(app) {
    app.use('/api/streams', router);

    router.post('/start', streamController.startStream.bind(streamController));
    router.post('/stop', streamController.stopStream.bind(streamController));
    router.get('/status', streamController.getStreamStatus.bind(streamController));
}