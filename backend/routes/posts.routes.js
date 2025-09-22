import { Router } from "express";
import {
  activeCheck,
  comment,
  createPost,
  deleteComment,
  deletePost,
  getAllPost,
  getCommentByPost,
  increamentLikes,
} from "../controllers/posts.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/").get(activeCheck);
router.route("/post").post(upload.single("media"), createPost);
router.route("/all_posts").get(getAllPost);
router.route("/delete_post").delete(deletePost);
router.route("/add_commet").post(comment);
router.route("/get_commet_by_post").get(getCommentByPost);
router.route("/delete_comment").delete(deleteComment);
router.route("/increment_likes").post(increamentLikes);

export default router;
