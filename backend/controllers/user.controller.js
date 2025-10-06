import User from "../models/users.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { stringify } from "querystring";
import Profile from "../models/profile.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionReq from "../models/connections.model.js";

const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();
  console.log(userData.userId);
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Post: ${userData.currentPost}`);
  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Postion: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });

  doc.end();

  return outputPath;
};

export const register = async (req, res) => {
  try {
    console.log(req.body);
    console.log("entered Register action");
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password)
      return res.status(400).json({ message: "all fields are required!" });

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "user already exist!" });
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
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found!" });

    const userProfile = await Profile.findOne({ userId: user.id }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json({ profile: userProfile });
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

export const downloadProfile = async (req, res) => {
  console.log(req.query.id);
  const user_id = req.query.id;
  console.log(user_id);
  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name username email profilePicture"
  );

  let outputPath = await convertUserDataToPDF(userProfile);

  return res.json({ message: outputPath });
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  console.log("token is :", token);
  try {
    const user = await User.findOne({ token: token });

    if (!user) return res.status(404).json({ message: "user not found" });

    const connectionUser = await User.findOne({ username: connectionId });
    if (!connectionUser)
      return res.status(404).json({ message: "Connection User not found!" });

    const existingRequest = await ConnectionReq.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    if (existingRequest)
      return res
        .status(400)
        .json({ message: "Connection request already sent!" });

    const Request = await ConnectionReq({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await Request.save();

    return res.json({ message: "connection request sent!" });
  } catch (error) {
    res.status(500).json({
      message: `something went wrong in sendConnectionRequest: ${error}`,
    });
  }
};

export const getMyConnectionRequests = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found!" });

    const connectionRequestsSent = await ConnectionReq.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");
    return res.json(connectionRequestsSent); // returns list of ppl to whom i've sent connections.
  } catch (error) {
    res.status(500).json({
      message: `something went wrong in getMyConnectionRequests: ${error}`,
    });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).jshon({ message: "user not found" });

    // const myConnections = await ConnectionReq.find({
    //   status_accepted: true,
    // }).populate("connectionId", "name username email profilePicture");

    // res.json(myConnections); //my solution, which could be correct.

    const myConnections = await ConnectionReq.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture"); //people who have sent me req's

    return res.json(myConnections);
  } catch (error) {
    return res.status(500).json({
      message: `something went wrong in whatAreMyConnections: ${error}`,
    });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, connectionId, action_type } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "user not found!" });

    const connectionUser = await ConnectionReq.find({
      _id: connectionId,
    });
    if (!connectionUser)
      return res.status(404).json({ message: "connection user not found!" });

    if (action_type === "accept") {
      connectionUser.status_accepted = true;
    } else {
      connectionUser.status_accepted = false;
    }

    await connectionUser.save();
    res.json({ message: "Request Updated" });
  } catch (error) {
    res.status(500).json({
      message: `something went wrong in acceptConnectionRequest: ${error}`,
    });
  }
};

export const viewUserProfile = async (req, res) => {
  const { username } = req.query;
  try {
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ message: "target User not found!" });
    }
    const targetUserProfile = await Profile.findOne({
      userId: targetUser._id,
    }).populate("userId", "name username email profilePicture");
    if (!targetUserProfile) {
      return res.status(404).json({ message: "target Profile not found!" });
    }
    res.status(200).json({ targetProfile: targetUserProfile });
  } catch (error) {
    res
      .status(500)
      .json({ message: `something went worong in viewUserProfile` });
  }
};
