import Post from "../models/posts.model.js";
import User from "../models/users.model.js";

export const activeCheck = async (req, res) => {
  res.status(200).json({ message: "Server running ok" });
};

export const createPost = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json("user not found!");

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();
    res.json("post created");
  } catch (error) {
    res.status(500).json({
      message: `somthing went wrong in createPost: ${error.message}`,
    });
  }
};
