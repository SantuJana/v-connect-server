import { Schema, model } from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new Schema(
  {
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
    gender: {
      type: String,
      enum: ["Male", "Female"],
      require: true,
    },
    dob: Date,
    city: String,
    image: String,
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }],
    requests: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }],
    isActive: Boolean,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const password = this.password || "";
  const salt = await genSalt(10);
  const passHash = await hash(password, salt);
  this.password = passHash;
  return next();
});

const User = model("user", userSchema);
export default User;
