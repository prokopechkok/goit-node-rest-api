import express from "express";
import authController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  userSignInSchema,
  userSignUpSchema,
  userEmailSchema,
} from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/users/register",
  validateBody(userSignUpSchema),
  authController.signup
);

authRouter.get("/users/verify/:verificationToken", authController.verify);

authRouter.post(
  "/users/verify",
  validateBody(userEmailSchema),
  authController.verifyResend
);

authRouter.post(
  "/users/login",
  validateBody(userSignInSchema),
  authController.signin
);

authRouter.get("/users/current", authenticate, authController.getCurrent);

authRouter.post("/users/logout", authenticate, authController.signout);

authRouter.patch("/users", authenticate, authController.patchSubscription);

export default authRouter;
