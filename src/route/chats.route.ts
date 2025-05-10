import { Router } from "express";
import { chatList, insertChat } from "../controller/chats.controller";
import handleTryCatch from "../utils/handleTryCatch";

const router = Router();

router.get("/", handleTryCatch(chatList));
router.get("/messages", handleTryCatch(chatList));
router.post("/", handleTryCatch(insertChat));

export default router;
