import { Router } from "express";
import authRouter from "../route/auth.route";
import userRouter from "../route/user.route";
import friendRouter from "../route/friend.route";
import chatsRouter from "../route/chats.route";
import { checkAuthentication } from "../middleware/checkAuthentication";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", checkAuthentication, userRouter);
router.use("/friend", checkAuthentication, friendRouter);
router.use("/chats", checkAuthentication, chatsRouter);

export default router;
