import {z} from "zod"
import { issue } from "zod/v4/core/util.cjs";

const roleEnum=z.enum(['ADMIN','CUSTOMER']);

// validating all possible cases by using zod validation in one go
export const userRegister=z.object({
    name:z.string({message:"name is required"}).min(4,{message:"name is required and must be of minimum 4 character"}).max(50),
    email:z.string({message:"invalid email"}).email({message:"invalid email"}),
    password:z.string({message:"invalid password"}).min(8,{message:"password must have atlest 8 character"}).
    regex(/[A-Z]/,"password must contain atleast one uppercase character").
    regex(/[a-z]/,"password must contain atleast one lowercase character").
    regex(/[^A-Za-z0-9]/,"password must contain atleast one special character"),
    role:roleEnum.optional().default('CUSTOMER'),  // if role not present treat him as customer
})

export const userLogin=z.object({
    email:z.string({
        error:(issue)=> issue.input===undefined?"email is required":"invalid email"
    }).min(1,{message:"email required..."}).email({message:"invalid email..."}),
    password:z.string({
        error:(issue)=> issue.input===undefined?"password is required":"invalid password"
    }).min(8,{message:"password must be of atleast 8 character..."}),
})