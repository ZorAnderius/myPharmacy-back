import express from 'express';
import { registerController } from '../controllers/usersControllers.js';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import validateBody from '../utils/validateBody.js';
import { userRegisterSchema } from '../schemas/usersSchema.js';

const usersRouter = express.Router();

usersRouter.post('/register', isEmptyBody, validateBody(userRegisterSchema), registerController);

export default usersRouter;
