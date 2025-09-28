import Comment from "../models/comment.model.js";
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
  try {
    const allPost = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );
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

export const comment = async (req, res) => {
  const { token, commentMsg, postId } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) return res.status(404).json("user not found!");

    const TargetPost = await Post.findOne({ _id: postId });
    if (!TargetPost) return res.status(404).json("post not found!");

    const comment = new Comment({
      userId: user._id,
      postId: postId,
      body: commentMsg,
    });

    await comment.save();
    return res.status(200).json({ message: "comment added!" });
  } catch (error) {
    res.status(500).json({
      message: `somthing went wrong in comment: ${error.message}`,
    });
  }
};

export const getCommentByPost = async (req, res) => {
  const { post_id } = req.query;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) return res.status(404).json("post not found!");

    // const comments = await Comment.find({ postId: post_id }).populate(
    //   "userId",
    //   "name username"
    // );
    return res.json({ comments: post.comments });
  } catch (error) {
    res.status(500).json({
      message: `somthing went wrong in getCommentByPost: ${error.message}`,
    });
  }
};

export const deleteComment = async (req, res) => {
  const { token, commentId } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) return res.status(404).json("user not found!");

    const myComment = await Comment.findOne({ _id: commentId });
    if (!myComment) return res.status(404).json("comment not found!");

    if (myComment.userId.toString() !== user._id.toString())
      return res.status(401).json({ message: "Unauthorized!" });

    await myComment.deleteOne({ _id: commentId });
    return res.status(200).json({ message: "comment deleted" });
  } catch (error) {
    res.status(500).json({
      message: `somthing went wrong in getCommentByPost: ${error.message}`,
    });
  }
};

export const increamentLikes = async (req, res) => {
  const { post_id } = req.body;
  try {
    const targetPost = await Post.findOne({ _id: post_id });
    if (!targetPost)
      return res.status(404).json({ message: "post not found!" });

    // await targetPost.updateOne({ likes: likes + 1 }); // not efficent
    // await targetPost.updateOne({ $inc: { likes: 1 } }); //might be better,not tried

    targetPost.likes = targetPost.likes + 1;
    await targetPost.save();
    res.json({ message: "like incremented" });
  } catch (error) {
    res.status(500).json({
      message: `somthing went wrong in getCommentByPost: ${error.message}`,
    });
  }
};
