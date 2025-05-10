import { Response } from "express";

export const sendSuccessResponse = (res: Response, data: any | null, msg?: string | null, status: number | null = 200) => {
    res.status(status || 200).json({
        status,
        success: true,
        msg,
        data
    })
}

export const sendErrorResponse = (res: Response, msg?: string | null, status?: number | null) => {
    res.status(status || 500).json({
        status,
        success: false,
        error: msg
    })
}