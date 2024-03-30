import jwt from "jsonwebtoken";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlwrapper from "../helpers/ctrlWrapper.js";
import "dotenv/config";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;

  const user = await authServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  const newUser = await authServices.signup({ ...req.body, verificationToken });

  const verificationEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/auth/users/verify/${verificationToken}" target="_blank">Click to verify your email</a>`,
  };

  await sendEmail(verificationEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: "starter",
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await authServices.findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await authServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: null }
  );

  res.json({ message: "Verification successful" });
};

const verifyResend = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verificationEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/auth/users/verify/${user.verificationToken}" target="_blank">Click to verify your email</a>`,
  };

  await sendEmail(verificationEmail);

  res.json({ message: "Verification email sent" });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }
  const comparePassword = await authServices.validatePassword(
    password,
    user.password
  );
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = { id };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });
  res.status(204).json({ message: "No Content" });
};

const patchSubscription = async (req, res) => {
  const { _id: id } = req.user;
  await authServices.updateSubscription({ id }, { subscription });
  res.json({ email, subscription });
};

export default {
  signup: ctrlwrapper(signup),
  verify: ctrlwrapper(verify),
  verifyResend: ctrlwrapper(verifyResend),
  signin: ctrlwrapper(signin),
  getCurrent: ctrlwrapper(getCurrent),
  signout: ctrlwrapper(signout),
  patchSubscription: ctrlwrapper(patchSubscription),
};
