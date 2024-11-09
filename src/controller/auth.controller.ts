import { Request, Response } from "express";
import User from "../model/user.model"

export const register = async (req: Request, res: Response) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password){
        return res.status(400).json({
            code: 400,
            status: "error",
            msg: "Name, Email and Password are mandatory"
        })
    }

    const existingUser = await User.findOne({email})
    if (existingUser){
        return res.status(400).json({
            code: 400,
            status: "error",
            msg: "Already have an account"
        })
    }

    const user = await User.create(req.body)
    delete user.password;
    return res.status(200).json({
        code: 400,
        status: "success",
        data: user,
        msg: "Registration successful"
    })
};
