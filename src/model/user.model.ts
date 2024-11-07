import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  image: String,
  isActive: Boolean,
}, {timestamps: true});

export default model("user", userSchema);