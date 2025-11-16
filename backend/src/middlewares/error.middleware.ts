import {Request,Response,NextFunction} from "express"

export const globalErrorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    return res.status(500).json("server error..."); // sending err.message can be harmful because it let anyone know system directory and code info which can cause problem in future so just send server error
}