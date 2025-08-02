import User from "../models/users.model.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
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

    res.json({ message: "user registered successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
