import axios from "axios";

export const BASE_URL = "https://procircle.onrender.com/";

export const createServer = axios.create({
  baseURL: BASE_URL,
});
