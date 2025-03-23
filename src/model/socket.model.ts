import mongoose, { Schema, model } from "mongoose";

const socketSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    socketId: {
      type: String,
      unique: true,
      require: true,
    },
  },
  { timestamps: true }
);

const Socket = model("socket", socketSchema);
export default Socket;
