import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/checkAuthentication";
import Chat from "../model/chat.model";
import { Types } from "mongoose";
import { sendSuccessResponse } from "../utils/sendResponse";
import User from "../model/user.model";

export const chatList = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  let result: any = [];

  // result = await Chat.aggregate([
  //   {
  //     $match: {
  //       $or: [
  //         {
  //           from: new Types.ObjectId(userId),
  //           to: new Types.ObjectId(chatId as string),
  //         },
  //         {
  //           from: new Types.ObjectId(chatId as string),
  //           to: new Types.ObjectId(userId),
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $sort: {
  //       createdAt: 1,
  //     },
  //   },
  //   {
  //     $project: {
  //       updatedAt: 0,
  //       __v: 0,
  //     },
  //   },
  //   {
  //     $addFields: {
  //       from: {
  //         $cond: {
  //           if: { $eq: ["$from", new Types.ObjectId(userId)] },
  //           then: true,
  //           else: false,
  //         },
  //       },
  //       to: {
  //         $cond: {
  //           if: { $eq: ["$to", new Types.ObjectId(userId)] },
  //           then: true,
  //           else: false,
  //         },
  //       },
  //     },
  //   },
  // ]);
   
  result = await Chat.aggregate([
    {
      $match: {
        $or: [
          {from: new Types.ObjectId(userId)},
          {to: new Types.ObjectId(userId)}
        ]
      }
    },
    {
      $addFields: {
        otherUser: {
          $cond: {
            if: {$eq: ["$from", new Types.ObjectId(userId)]},
            then: "$to",
            else: "$from"
          }
        },
        fromYou: {
          $cond: {
            if: {$eq: ["$from", new Types.ObjectId(userId)]},
            then: true,
            else: false
          }
        }
      }
    },
    {
      $sort: {
        createdAt: -1,
      }
    },
    {
      $group: {
        _id: "$otherUser",
        createdAt: {$first: "$createdAt"},
        message: {$first: "$message"},
        fromYou: {$first: "$fromYou"},
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        createdAt: 1,
        message: 1,
        fromYou: 1,
        name: "$user.name",
        image: "$user.image",
      }
    }
  ])

  sendSuccessResponse(res, result, "successfully got the chat list");
};

export const insertChat = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { to, message } = req.body;

  try {
    const chat = new Chat({
      from: userId,
      to,
      message,
    });
    await chat.save();
  } catch (error: any) {
    console.log("+++++", error.message);
  }
  res.status(200).json({
    success: true,
    code: 200,
    status: "ok",
    message: "successfully send",
  });
};
