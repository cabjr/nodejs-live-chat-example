import { Router } from 'express';
import userController from '../controllers/userController';
import { requireJwtMiddleware } from '../middlewares/authMiddleware'

const routes = Router();
export default routes
        .get('/', requireJwtMiddleware ,userController.ListUsers)
        .post('/', userController.CreateUser)
        .post('/check', userController.checkAuth)
        .post('/auth', userController.authenticate);