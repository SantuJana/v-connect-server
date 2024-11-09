import { Router } from "express";
import User from "../model/user.model";
import authRouter from "../route/auth.route";

const router = Router();

router.use("/auth", authRouter);

export default router;
