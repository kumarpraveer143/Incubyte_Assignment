import {Request,Response} from "express"
import { registerUserService ,loginUserService} from "../service/auth.service";
import { Prisma } from "@prisma/client";
import { authRequest } from "../middlewares/authentication.middleware";

// use database service to register user and if register succesful send user data, token and success message
// if fail check if the failure is unique constraint then give that message otherwise give message server error with status code
export const register=async(req:Request,res:Response)=>{
    try{
        const {name,email,password,role}=req.body;
        const {user,token}=await registerUserService(name,email,password,role);
        return res.status(201).json({message:"user created succesfully...",
            user:{name:user.name,email:user.email,role:user.role},token
        });
    }catch(err:any){
        // code "P2002" means error because of @unique constraint fail
        if(err instanceof Prisma.PrismaClientKnownRequestError && err.code=="P2002")
            return res.status(400).json({message:"email already exists..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}

// use database to see do this user exist and password correct if yes then give jwt to that user
// else give him error in json message
export const login=async(req:Request,res:Response)=>{
    try{
        const {email,password}=req.body;
        const {user,token}=await loginUserService(email,password);
        return res.status(200).json({message:"user login succesfully...",
            user:{name:user.name,email:user.email,role:user.role},token
        });
    }catch(err:any){
        if(err.name==="appError")
            return res.status(err.statusCode).json({message:err.message});
        else
            return res.status(500).json({message:"server error..."});
    }
}

export const getUserData=async(req:authRequest,res:Response)=>{
    try{
        const user=req.user;
        return res.status(200).json({message:"user verify succesfully...",
            user:{name:user.name,email:user.email,role:user.role},
            token:req.headers.authorization?.split(' ')[1]
        });
    }catch(err:any){
        return res.status(401).json({message:"unauthorized..."});
    }
}