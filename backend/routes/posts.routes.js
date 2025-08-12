import { Router } from "express";
import { activeCheck, createPost } from "../controllers/posts.controller.js";
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

router.route("/post").post(upload.single("post_media"), createPost);
router.route("/").get(activeCheck);

export default router;
