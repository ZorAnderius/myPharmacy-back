import express from "express";
import { registerController } from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post('/register', registerController);

export default usersRouter;