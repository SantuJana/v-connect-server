"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.list = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const upload_1 = require("../service/upload");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userList = yield user_model_1.default.find({ _id: { $ne: user === null || user === void 0 ? void 0 : user.id } });
        res.status(200).json({
            success: true,
            code: 200,
            status: "ok",
            msg: "Success",
            data: userList || []
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            status: "failed",
            msg: error.message,
            data: null
        });
        return;
    }
});
exports.list = list;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // console.log(req.body)
    const _a = req.body, { image } = _a, rest = __rest(_a, ["image"]);
    if (image) {
        const uploadedFile = yield (0, upload_1.uploadFile)("/profile", image, "test.png");
        if (!uploadedFile) {
            res.status(500).json({
                code: 500,
                status: "failed",
                msg: "Failed to upload profile image.",
                data: null
            });
            return;
        }
        rest.image = uploadedFile;
    }
    try {
        const response = yield user_model_1.default.updateOne({ _id: user === null || user === void 0 ? void 0 : user.id }, { $set: Object.assign({}, rest) });
        res.status(200).json({
            code: 200,
            status: "ok",
            msg: "Profile updated successfully.",
            data: rest
        });
        return;
    }
    catch (error) {
        console.log("$$$$$", error.message);
        res.status(500).json({
            code: 500,
            status: "failed",
            msg: error.message,
            data: null
        });
        return;
    }
});
exports.update = update;
