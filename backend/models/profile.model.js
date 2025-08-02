import mongoose from "mongoose";

const educationSchema = mongoose.Schema({
  school: {
    type: String,
    default: " ",
  },
  degree: {
    type: String,
    default: " ",
  },
  fieldOfStudy: {
    type: String,
    default: " ",
  },
});

const workSchema = mongoose.Schema({
  company: {
    type: String,
    default: " ",
  },
  position: {
    type: String,
    default: " ",
  },
  years: {
    type: String,
    default: " ",
  },
});

const ProfileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bio: {
    type: String,
    default: " ",
  },
  pastWork: {
    type: [workSchema],
    default: [],
  },
  education: {
    type: [educationSchema],
    default: [],
  },
});

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
