import { Router } from "express";
import authRouter from "../route/auth.route";

const router = Router();

router.use("/auth", authRouter);

export default router;
