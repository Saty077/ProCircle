import { Router } from "express";
import {
  activeCheck,
  createPost,
  deletePost,
  getAllPost,
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
router.route("/post").post(upload.single("post_media"), createPost);
router.route("/all_posts").get(getAllPost);
router.route("/delete_post").delete(deletePost);

export default router;
