import jwt from "jsonwebtoken";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlwrapper from "../helpers/ctrlWrapper.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";

const avatarsPath = path.resolve("public", "avatars");
const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;

  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email);

  const newUser = await authServices.signup(req.body, avatarURL);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: "starter",
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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
  const { _id: id, email } = req.user;
  await authServices.updateSubscription({ id }, { subscription });
  res.json({ email, subscription });
};

const patchAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Please, attach avatar. It is required.");
  }
  const { path: oldPath, filename } = req.file;
  const image = await Jimp.read(oldPath);
  image.resize(250, 250).write(oldPath);

  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);

  await authServices.updateAvatar({ _id }, { avatarURL: avatarURL });
  res.json({ avatarURL });
};
export default {
  signup: ctrlwrapper(signup),
  signin: ctrlwrapper(signin),
  getCurrent: ctrlwrapper(getCurrent),
  signout: ctrlwrapper(signout),
  patchSubscription: ctrlwrapper(patchSubscription),
  patchAvatar: ctrlwrapper(patchAvatar),
};
