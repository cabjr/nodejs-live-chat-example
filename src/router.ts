import userRouter from './routes/users.routes';


export default (app: any) => {
      app.use(
        '/users',
        userRouter
      );
};

