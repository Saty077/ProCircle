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

export const getAllPost = async (req, res) => {
  // const { token } = req.body;
  try {
    // const user = await User.findOne({ token: token });
    // if (!user) return res.status(404).json("user not found!");

    // const allPost = await Post.find({ userId: user._id });
    // res.json(allPost);

    const allPost = await Post.find()
      .populate("userId", "")
      .populate("userId", "name username email profilePicture");
    res.json({ allPost });
  } catch (error) {
    res.status(500).json({
      message: `somthing went wrong in getAllPost: ${error.message}`,
    });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) return res.status(404).json("user not found!");

    const post = await Post.findOne({ _id: post_id });
    if (!post) return res.status(404).json("post not found!");

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorised!" });
    }

    await post.deleteOne({ _id: post_id });
    return res.json({ message: "post deleted" });
  } catch (error) {
    res.status(500).json({
      message: `somthing went wrong in deletePost: ${error.message}`,
    });
  }
};
