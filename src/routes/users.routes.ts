import { Router } from 'express';
import userController from '../controllers/userController';

const routes = Router();
export default routes
        .get('/', userController.ListUsers)
        .post('/', userController.CreateUser);