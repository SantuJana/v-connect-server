import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import { AuthenticatedRequest } from "../middleware/checkAuthentication";
import { uploadFile } from "../service/upload";

export const list = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const userList = await User.find({_id: {$ne: user?.id}});
  
    res.status(200).json({
      success: true,
      code: 200,
      status: "ok",
      msg: "Success",
      data: userList || []
    })
    return;
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      status: "failed",
      msg: error.message,
      data: null
    })
    return;
  }
};

export const update = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  // console.log(req.body)
  const {image, ...rest} = req.body;

  if (image){
    const uploadedFile = await uploadFile("/profile", image, "test.png");
    if(!uploadedFile){
      res.status(500).json({
        code: 500,
        status: "failed",
        msg: "Failed to upload profile image.",
        data: null
      })
      return;
    }
    rest.image = uploadedFile;
  }

  try {
    const response = await User.updateOne(
      {_id: user?.id},
      {$set: {...rest}}
    )
    res.status(200).json({
      code: 200,
      status: "ok",
      msg: "Profile updated successfully.",
      data: rest
    })
    return;
  } catch (error: any) {
    console.log("$$$$$", error.message)
    res.status(500).json({
      code: 500,
      status: "failed",
      msg: error.message,
      data: null
    })
    return;
  }

};

