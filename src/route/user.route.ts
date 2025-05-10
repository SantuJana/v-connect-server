import { Router } from "express";
import { list, update, all } from "../controller/user.controller";

const router = Router();

router.get("/list", list);
router.post("/update", update);
router.get("/all", all);

export default router;
