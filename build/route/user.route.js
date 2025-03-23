"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const router = (0, express_1.Router)();
router.get("/list", user_controller_1.list);
router.post("/update", user_controller_1.update);
exports.default = router;
