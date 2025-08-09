import User from "../models/users.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { stringify } from "querystring";
import Profile from "../models/profile.model.js";

export const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password)
      return res.status(400).json({ message: "all fields are required!" });

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ messaage: "user already exist!" });
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.json({ message: "user registered successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: `something went wrong in Register: ${e.messaage}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "please enter username and password!" });
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "user dosen't exist in database!" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = crypto.randomBytes(32).toString("hex");

      await User.updateOne({ _id: user.id }, { token });

      return res.json({ token });
    } else {
      return res.status(400).json({ message: "invalid username or password!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong in Login: ${error.message}` });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found!" });
    user.profilePicture = req.file.filename;
    await user.save();
    return res.status(200).json({ message: "profile picture uploaded" });
  } catch (error) {
    return res.status(500).json({
      message: `something went wrong in uploadProfilePicture: ${error}`,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found!" }); // current user
    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] }); // user that info got submitted
    if (existingUser) {
      if (existingUser && stringify(existingUser._id) !== stringify(user._id)) {
        return res.status(400).json({ message: "user already Exists!" });
      }
    }
    Object.assign(user, newUserData);
    await user.save();
    return res.json({ message: "user Updated!" }); //
  } catch (error) {
    return res.status(500).json({
      message: `something went wrong in updateUserProfile: ${error.messaage}`,
    });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found!" });

    const userProfile = await Profile.findOne({ userId: user.id }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json(userProfile);
  } catch (e) {
    return res
      .status(500)
      .json({ message: `something went wrong in getUserAndProfile ${e}` });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...profileData } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found!" });
    const userProfile = await Profile.findOne({ userId: user._id }); //

    Object.assign(userProfile, profileData);
    await userProfile.save();
    return res.json("profile updated");
  } catch (error) {
    res
      .status(500)
      .json({ message: `something went wrong in udateProfileData: ${error}` });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const allProfiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    if (!allProfiles.length) return res.status(404).json("no profile found!");

    return res.json({ Profiles: allProfiles });
  } catch (error) {
    res
      .status(500)
      .json({ message: `something went wrong in getAllUserProfile: ${error}` });
  }
};
