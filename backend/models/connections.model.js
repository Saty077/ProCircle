import mongoose from "mongoose";

const connectionSchema = mongoose.Schema({
  userId: {
    //from
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: {
    //to
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status_accepted: {
    type: Boolean,
    default: null,
  },
});

const ConnectionReq = mongoose.model("ConnectionReq", connectionSchema);

export default ConnectionReq;
