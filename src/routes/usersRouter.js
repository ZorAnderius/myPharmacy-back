import express from 'express';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import validateBody from '../utils/validateBody.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import loginLimit from '../middlewares/loginLimit/loginLimit.js';
import userRegisterSchema from '../schemas/usersSchema/register.js';
import userLoginSchema from '../schemas/usersSchema/login.js';
import {
  authenticateWithGoogleOAuthController,
  currentUserController,
  loginController,
  logoutController,
  registerController,
  updateAvatarController,
  userGoogleOAuthController,
} from '../controllers/usersControllers.js';
import csrfHeaderCheck from '../middlewares/secureConf/csrfHeaderCheck.js';
import clientCheck from '../middlewares/clientCheck.js.js';
import auth from '../middlewares/authenticate.js';
import authWithGoogleOAuthSchema from '../schemas/usersSchema/googleOAuth.js';
import upload from '../middlewares/upload.js';

const usersRouter = express.Router();

const authMiddleware = [csrfHeaderCheck, clientCheck];

usersRouter.post('/register', [isEmptyBody, ...authMiddleware, validateBody(userRegisterSchema)], ctrlWrapper(registerController));
usersRouter.post('/login', [isEmptyBody, ...authMiddleware, validateBody(userLoginSchema), loginLimit], ctrlWrapper(loginController));
usersRouter.post('/logout', [...authMiddleware, auth], ctrlWrapper(logoutController));
usersRouter.get('/current', [auth], ctrlWrapper(currentUserController));
usersRouter.get('/request-google-oauth', ctrlWrapper(userGoogleOAuthController));
usersRouter.post('/confirm-oauth', [isEmptyBody, ...authMiddleware, validateBody(authWithGoogleOAuthSchema)], ctrlWrapper(authenticateWithGoogleOAuthController));
usersRouter.patch('/update-avatar', [auth, ...authMiddleware, upload.single('avatar')], ctrlWrapper(updateAvatarController));

export default usersRouter;
