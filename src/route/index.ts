import { Router } from "express";
import authRouter from "../route/auth.route";
import userRouter from "../route/user.route";
import { checkAuthentication } from "../middleware/checkAuthentication";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", checkAuthentication, userRouter);

export default router;
