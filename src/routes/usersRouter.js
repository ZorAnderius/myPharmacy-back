import express from 'express';

import {
  authenticateWithGoogleOAuthController,
  currentUserController,
  loginController,
  logoutController,
  refreshTokensController,
  registerController,
  updateAvatarController,
  userGoogleOAuthController,
} from '../controllers/usersControllers.js';
import { inputSanitizationGuards, originGuards, secureGuards } from '../middlewares/middlewaresSet.js';

import validateBody from '../utils/validateBody.js';
import ctrlWrapper from '../utils/controllerWrapper.js';
import userRegisterSchema from '../schemas/usersSchema/register.js';
import userLoginSchema from '../schemas/usersSchema/login.js';
import auth from '../middlewares/authenticate.js';
import authWithGoogleOAuthSchema from '../schemas/usersSchema/googleOAuth.js';
import upload from '../middlewares/upload.js';
import registerLimit from '../middlewares/requestLimit/authLimit/registerLimit.js';
import authLimit from '../middlewares/requestLimit/authLimit/authLimit.js';
import sensitiveLimiter from '../middlewares/requestLimit/sensitiveLimit.js';
import secureInput from '../middlewares/secureInput.js';
import apiLimit from '../middlewares/requestLimit/apiLimit.js';
import clientCheck from '../middlewares/clientCheck.js.js';

const usersRouter = express.Router();

usersRouter.post('/register', [...secureGuards, validateBody(userRegisterSchema), ...registerLimit], ctrlWrapper(registerController));

usersRouter.post('/login', [...secureGuards, validateBody(userLoginSchema), authLimit], ctrlWrapper(loginController));

usersRouter.post('/logout', [...originGuards, auth], ctrlWrapper(logoutController));

usersRouter.get('/current', [auth], ctrlWrapper(currentUserController));

usersRouter.post('/refresh', [...originGuards, secureInput, ...apiLimit], ctrlWrapper(refreshTokensController));

usersRouter.get('/request-google-oauth', [clientCheck], ctrlWrapper(userGoogleOAuthController));

usersRouter.post('/confirm-oauth', [...secureGuards, validateBody(authWithGoogleOAuthSchema), authLimit], ctrlWrapper(authenticateWithGoogleOAuthController));

usersRouter.patch('/update-avatar', [auth, ...originGuards, upload.single('avatar'), ...sensitiveLimiter], ctrlWrapper(updateAvatarController));

export default usersRouter;
