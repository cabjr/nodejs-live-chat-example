import userRouter from './routes/users.routes';
import channelRouter from './routes/channels.routes';


export default (app: any) => {
      app.use(
        '/users',
        userRouter
      );
      app.use(
        '/channels',
        channelRouter
      )
};

