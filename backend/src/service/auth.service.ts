import prisma from "../prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {appError} from "../utils/appError"

const JWT_SECRET=process.env.JWT_SECRET as string;

// register user in DB after hash his password then create a token as well so user get access of app just after register and without login.
export const registerUserService=async (name:string,email:string,password:string,role:'CUSTOMER')=>{
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await prisma.user.create({data:{name,email,password:hashedPassword,role}});
    const token=jwt.sign({userId:user.id},JWT_SECRET,{expiresIn: "3h"});
    return {user,token};
}

// find user from given email , if the user not exist then throw error 
// but if exist move further and see that do password match if no then throw error
// but if password match create jwt token and return user , jwt
export const loginUserService=async (email:string,password:string)=>{
    const user=await prisma.user.findUnique({where:{email}});
    if(!user)   throw new appError("invalid credentials",401);
    const ok=await bcrypt.compare(password,user.password);
    if(!ok) throw new appError("invalid credentials",401);
    const token=jwt.sign({userId:user.id},JWT_SECRET,{expiresIn: "3h"});
    return {user,token};
}