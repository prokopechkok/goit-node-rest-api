import express from "express";
import authController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSignInSchema, userSignUpSchema } from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.patch("/users", authenticate, authController.patchSubscription);

authRouter.patch(
  "/users/avatars",
  upload.single("avatarURL"),
  authenticate,
  authController.patchAvatar
);
authRouter.post(
  "/users/register",
  upload.single("avatarURL"),
  validateBody(userSignUpSchema),
  authController.signup
);

authRouter.post(
  "/users/login",
  validateBody(userSignInSchema),
  authController.signin
);

authRouter.get("/users/current", authenticate, authController.getCurrent);

authRouter.post("/users/logout", authenticate, authController.signout);

export default authRouter;
