import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  updateProfile,
  authCheck,
} from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);
authRouter.put("/update-profile", protectedRoute, updateProfile);
authRouter.get("/check", protectedRoute, authCheck);

export default authRouter;
