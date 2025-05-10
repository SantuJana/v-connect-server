import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/checkAuthentication";
import User from "../model/user.model";
import { Types } from "mongoose";
import { sendSuccessResponse } from "../utils/sendResponse";

const send = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const friendId = req.body.friendId;
    if (friendId) {
      await User.updateOne({ _id: friendId }, { $push: { requests: userId } });
    }

    res.status(200).json({
      status: "ok",
      success: true,
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      success: false,
      code: 500,
    });
  }
  return;
};

const requestList = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    const result = await User.aggregate([
      {
        $match: { _id: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "requests",
          foreignField: "_id",
          as: "requesters",
        },
      },
      {
        $project: {
          _id: 0,
          requesters: {
            $map: {
              input: "$requesters",
              as: "requester",
              in: {
                _id: "$$requester._id",
                name: "$$requester.name",
                image: "$$requester.image",
                mutualFriends: {
                  $size: {
                    $setIntersection: [{$ifNull:["$friends", []]}, {$ifNull:["$$requester.friends", []]}],
                  },
                },
              },
            },
          },
        },
      },
    ]);

    sendSuccessResponse(res, result?.[0]?.requesters || [], "Successfully got the list")
  return;
};

const requestDelete = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const friendId = req.query.friendId;

    await User.updateMany(
      {
        _id: { $in: [userId, friendId] },
      },
      {
        $pull: { requests: friendId },
      }
    );

    res.status(200).json({
      code: 200,
      status: "ok",
      msg: "successfully removed",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      msg: "failed to remove",
    });
  }
  return;
};

const requestAccept = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const friendId = req.query.friendId;
    console.log("+++++", userId, friendId);

    await User.updateOne(
      {
        _id: userId,
      },
      {
        $pull: { requests: friendId },
        $push: { friends: friendId },
      }
    );

    await User.updateOne(
      {
        _id: friendId ,
      },
      {
        $push: { friends: userId },
      }
    );

    res.status(200).json({
      code: 200,
      status: "ok",
      msg: "successfully accepted",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      msg: "failed to accepted",
    });
  }
  return;
};

const friendList = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log(userId);

    const result = await User.aggregate([
      {
        $match: { _id: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "friends1",
        },
      },
      {
        $project: {
          _id: 0,
          friends: {
            $map: {
              input: "$friends1",
              as: "friend",
              in: {
                _id: "$$friend._id",
                name: "$$friend.name",
                image: "$$friend.image",
                mutualFriends: {
                  $size: { $setIntersection: ["$$friend.friends", "$friends"] },
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      code: 200,
      status: "ok",
      msg: "successfully get the list",
      // data: result?.[0]?.friends || [],
      data: result?.[0]?.friends || [],
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      msg: "failed to get the list",
    });
  }
  return;
};

const deleteFriend = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const friendId = req.query?.friendId;

    await User.updateMany({
      _id: {$in: [userId, friendId]}
    }, {
      $pull: {friends: {$in: [friendId, userId]}}
    })

    sendSuccessResponse(res, null, "Successfully removed");
  return;
};

export { send, requestList, requestDelete, requestAccept, friendList, deleteFriend };
