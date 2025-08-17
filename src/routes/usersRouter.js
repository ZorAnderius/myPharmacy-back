import express from 'express';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import validateBody from '../utils/validateBody.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import loginLimit from '../middlewares/loginLimit/loginLimit.js';
import userRegisterSchema from '../schemas/usersSchema/register.js';
import userLoginSchema from '../schemas/usersSchema/login.js';
import { currentUserController, loginController, logoutController, registerController } from '../controllers/usersControllers.js';
import csrfProtection from '../middlewares/secureConf/csrfHeaderCheck.js';
import clientCheck from '../middlewares/clientCheck.js.js';
import auth from '../middlewares/authenticate.js';

const usersRouter = express.Router();

const authMiddleware = [ csrfProtection, clientCheck];

usersRouter.post('/register', [isEmptyBody,...authMiddleware, validateBody(userRegisterSchema)], ctrlWrapper(registerController));
usersRouter.post('/login', [isEmptyBody, ...authMiddleware, validateBody(userLoginSchema), loginLimit], ctrlWrapper(loginController));
usersRouter.post('/logout', [...authMiddleware, auth], ctrlWrapper(logoutController));
usersRouter.get('/current', [auth], ctrlWrapper(currentUserController));
export default usersRouter;
