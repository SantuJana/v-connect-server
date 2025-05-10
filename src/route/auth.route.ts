import { Router } from "express";
import { register, login } from "../controller/auth.controller";
import handleTryCatch from "../utils/handleTryCatch";

const router = Router();

router.post("/register", handleTryCatch(register));
router.post("/login", handleTryCatch(login));

export default router;
