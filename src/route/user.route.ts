import { Router } from "express";
import { list, update } from "../controller/user.controller";

const router = Router();

router.get("/list", list);
router.post("/update", update);

export default router;
