import User from "../models/users.model.js";
import Profile from "../models/posts.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

    return res.json({ message: "user registered successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
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
    return res.status(500).json({ message: error.message });
  }
};
