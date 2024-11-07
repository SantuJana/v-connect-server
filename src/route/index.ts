import { Router } from "express";
import User from "../model/user.model"

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
  User.create({name: "sa", email: "knc", password: "knxsn"})
});

export default router;
