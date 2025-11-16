import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import prisma from "../prisma"

const JWT_SECRET=process.env.JWT_SECRET as string;

export interface authRequest extends Request{
    user?:any;
}

export const userJwtAuth=async (req:authRequest,res:Response,next:NextFunction)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader) return res.status(401).json({message:"unauthorized"});
        const token=authHeader.split(" ")[1] as string;
        const payload:any=jwt.verify(token,JWT_SECRET);
        const user=await prisma.user.findUnique({where:{id:payload.userId}});
        if(!user)   return res.status(401).json({message:"user not found"});
        req.user=user;
        next();
    }catch(e){
        return res.status(401).json({message:"unauthorized"});
    }
}

export const isRoleAdminAuth=async (req:authRequest,res:Response,next:NextFunction)=>{
    if(!req.user)   return res.status(401).json({message:"not authenticated user"});
    if(req.user.role!=='ADMIN')     return res.status(403).json({message:"not authorized"});
    next();
}