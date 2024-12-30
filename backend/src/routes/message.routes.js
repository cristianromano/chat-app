import { Router } from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  getUserSideBar,
  getMessages,
  sendMessage,
} from "../controller/message.controller.js";
const messageRouter = Router();

messageRouter.get("/users", protectedRoute, getUserSideBar);
messageRouter.get("/:id", protectedRoute, getMessages);
messageRouter.post("/:id", protectedRoute, sendMessage);
export default messageRouter;
