import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import { AuthenticatedRequest } from "../middleware/checkAuthentication";
import { uploadFile } from "../service/upload";
import { Types } from "mongoose";

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

export const all = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const searchText = req.query.searchText;
    const userId = req.user?.id;

    const friends = await User.findById(userId).select('friends').select('requests');

    const result = await User.aggregate([
      {
        $match: {
          _id: {$nin: [userId, ...(friends?.friends || []), ...(friends?.requests || [])].map(friendId => new Types.ObjectId(friendId))},
          name: {$regex: searchText || '', $options: "i"}
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "friends1"
        }
      },
      {
        $project: {
          name: 1,
          image: 1,
          mutualFriends: {
            $size: {
              $setIntersection: [{$ifNull: ["$friends", []]}, {$ifNull: ["$friends1.friends", []]}]
            }
          },
          alreadySent: {
            $in: [
              new Types.ObjectId(userId),
              {
                $reduce: {
                  input: {$ifNull: ["$requests", []]},
                  initialValue: [],
                  in: { $concatArrays: ["$$value", ["$$this"]] }
                }
              }
            ]
          }
        }
      },
    ])

    res.status(200).json({
      success: true,
      status: "ok",
      code: 200,
      msg: "successfully got the list",
      data: result,
    })
  } catch (error: any) {
    console.log("+++++", error.message)
    res.status(500).json({
      success: true,
      status: "internal server error",
      code: 500,
      msg: "failed to get list",
    })
  }
}