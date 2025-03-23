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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../model/user.model"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, dob } = req.body;
    if (!name || !email || !password || !dob) {
        res.status(400).json({
            code: 400,
            status: "error",
            msg: "Name, Email, Date of birth and Password are mandatory",
        });
        return;
    }
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        res.status(400).json({
            code: 400,
            status: "error",
            msg: "Already have an account",
        });
        return;
    }
    const user = yield user_model_1.default.create(req.body);
    delete user.password;
    res.status(200).json({
        code: 400,
        status: "success",
        data: user,
        msg: "Registration successful",
    });
    return;
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            code: 400,
            status: "bad request",
            msg: "Enter email and password",
        });
        return;
    }
    const existingUser = yield user_model_1.default.findOne({ email });
    if (!existingUser) {
        res.status(401).json({
            code: 401,
            status: "unauthenticated",
            msg: "No user found",
        });
        return;
    }
    const passHas = existingUser.password;
    const passMatched = yield bcrypt_1.default.compare(password, passHas);
    if (!passMatched) {
        res.status(401).json({
            code: 401,
            status: "unauthenticated",
            msg: "Invalid credentials",
        });
        return;
    }
    const payload = { id: existingUser._id };
    const token = yield jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || "");
    let data = {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        image: existingUser.image,
        city: existingUser.city,
        dob: existingUser.dob,
    };
    res.status(200).json({
        code: 200,
        status: "success",
        data,
        token,
    });
    return;
});
exports.login = login;
