import { Router } from "express";
import {
  send,
  requestList,
  requestDelete,
  requestAccept,
  friendList,
  deleteFriend
} from "../controller/friend.controller";
import handleTryCatch from "../utils/handleTryCatch";

const router = Router();

router.post("/request/send", send);
router.get("/request/list", handleTryCatch(requestList));
router.delete("/request/delete", requestDelete);
router.delete("/delete", deleteFriend);
router.patch("/request/accept", requestAccept);
router.get("/list", friendList);

export default router;
