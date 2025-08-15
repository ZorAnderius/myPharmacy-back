import express from 'express';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import validateBody from '../utils/validateBody.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import loginLimit from '../middlewares/loginLimit/loginLimit.js';
import userRegisterSchema from '../schemas/usersSchema/register.js';
import userLoginSchema from '../schemas/usersSchema/login.js';
import { loginController, registerController } from '../controllers/usersControllers.js';
import csrfProtection from '../middlewares/secureConf/csrfHeaderCheck.js';

const usersRouter = express.Router();

usersRouter.post('/register', isEmptyBody, csrfProtection, validateBody(userRegisterSchema), ctrlWrapper(registerController));
usersRouter.post('/login', isEmptyBody, csrfProtection, validateBody(userLoginSchema), loginLimit, ctrlWrapper(loginController));

export default usersRouter;
