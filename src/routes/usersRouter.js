import express from "express";
import { getUsersController } from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.get('/', getUsersController);

export default usersRouter;