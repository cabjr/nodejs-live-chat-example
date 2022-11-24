import { Router } from 'express';
import channelController from '../controllers/channelController';
import { requireJwtMiddleware } from '../middlewares/authMiddleware'

const routes = Router();
export default routes
        .get('/', requireJwtMiddleware ,channelController.ListChannels)
        .post('/', channelController.CreateChannel)
        .post('/send-message/:channel', channelController.sendMessage)
        .get('/messages/:channel', channelController.channelMessages);