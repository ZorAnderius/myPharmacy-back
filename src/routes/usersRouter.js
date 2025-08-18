import express from 'express';

import { csrfAndClientValidation, requestIntegrityChecks } from '../middlewares/generalMiddlewareList.js';
import {
  authenticateWithGoogleOAuthController,
  currentUserController,
  loginController,
  logoutController,
  registerController,
  updateAvatarController,
  userGoogleOAuthController,
} from '../controllers/usersControllers.js';

import validateBody from '../utils/validateBody.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import loginLimit from '../middlewares/loginLimit/loginLimit.js';
import userRegisterSchema from '../schemas/usersSchema/register.js';
import userLoginSchema from '../schemas/usersSchema/login.js';
import auth from '../middlewares/authenticate.js';
import authWithGoogleOAuthSchema from '../schemas/usersSchema/googleOAuth.js';
import upload from '../middlewares/upload.js';

const usersRouter = express.Router();

usersRouter.post('/register', [...requestIntegrityChecks, validateBody(userRegisterSchema)], ctrlWrapper(registerController));

usersRouter.post('/login', [...requestIntegrityChecks, validateBody(userLoginSchema), loginLimit], ctrlWrapper(loginController));

usersRouter.post('/logout', [...csrfAndClientValidation, auth], ctrlWrapper(logoutController));

usersRouter.get('/current', [auth], ctrlWrapper(currentUserController));

usersRouter.get('/request-google-oauth', ctrlWrapper(userGoogleOAuthController));

usersRouter.post('/confirm-oauth', [...requestIntegrityChecks, validateBody(authWithGoogleOAuthSchema)], ctrlWrapper(authenticateWithGoogleOAuthController));

usersRouter.patch('/update-avatar', [auth, ...csrfAndClientValidation, upload.single('avatar')], ctrlWrapper(updateAvatarController));

export default usersRouter;
