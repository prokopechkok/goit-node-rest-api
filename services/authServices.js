import bcrypt from "bcrypt";

import User from "../models/User.js";

export const findUser = (filter) => User.findOne(filter);

export const signup = async (data, avatarURL) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashedPassword, avatarURL });
};
export const validatePassword = async (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export const updateUser = async (filter, data) =>
  User.findOneAndUpdate(filter, data);

export const updateSubscription = async (filter, subscription) =>
  User.findByIdAndUpdate(filter, subscription);

export const updateAvatar = async (filter, avatarURL) =>
  User.findByIdAndUpdate(filter, avatarURL);
