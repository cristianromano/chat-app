import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  updateProfile,
} from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);
authRouter.put("/update-profile", protectedRoute, updateProfile);

export default authRouter;
