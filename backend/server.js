import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import postRouter from "./routes/posts.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.set("uri", process.env.ATLAS_URL);
app.set("port", process.env.PORT || 9000);

app.use(postRouter);

const start = async () => {
  const URI = app.get("uri");
  const connectDB = await mongoose.connect(URI);

  app.listen(app.get("port"), () => {
    console.log("server is listeing to port 9000");
  });
};

start();
