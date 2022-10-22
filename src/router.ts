import userRouter from './routes/users.routes';
import channelRouter from './routes/channels.routes';
import {Router} from 'express';

const apiRouter = Router();

apiRouter.use(
  '/users',
  userRouter
);

apiRouter.use(
  '/channels',
  channelRouter
)

export default apiRouter;

