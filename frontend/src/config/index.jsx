import axios from "axios";

export const createServer = axios.create({
  baseURL: "http://localhost:9000",
});
