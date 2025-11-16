import { Request,Response } from "express";
import {addSweetService,updateSweetService,deleteSweetService,getAllSweetService,getFilteredSweetService,restockSweetService, purchaseSweetService} from "../service/sweets.service"
import { Prisma } from "@prisma/client";
import { authRequest } from "../middlewares/authentication.middleware";

export const addSweet=async (req:Request,res:Response)=>{
    try{
        const {name,price,categoryId}=req.body;
        const sweet=await addSweetService(name.trim(),price,categoryId);
        return res.status(201).json(sweet)
    }catch(e){
        // PrismaClientKnownRequestError to check that error is of prisma
        // code "P2002" means error because of @unique constraint fail
        // code "P2003" means that foreignkey(categoryId) not exist in parent/refrenced table(category)
        if(e instanceof Prisma.PrismaClientKnownRequestError && e.code=="P2002")
            return res.status(400).json({message:"sweet already exists..."});
        else if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2003") 
            return res.status(404).json({message:"this category not exist..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}

export const updateSweet=async (req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);
        const {name,price,categoryId}=req.body;
        
        let dataToUpdate:{name?:string,price?:number,categoryId?:number}={};

        if(name!==undefined){
            if(typeof name != "string" || name.trim().length<2)
                return res.status(400).json({message:"name must be valid and atleast of 2 character..."});
            dataToUpdate.name=name;
        }
        if(price!==undefined){
            const parsedPrice=Number(price);
            if(isNaN(parsedPrice) || parsedPrice<0)
                return res.status(400).json({message:"price must be of type number and not negative..."});
            dataToUpdate.price=parsedPrice;
        }
        if(categoryId!==undefined){
            const parsedCategoryId=Number(categoryId);
            if(isNaN(parsedCategoryId) || parsedCategoryId<1)
                return res.status(400).json({message:"categoryId must be of type number and valid..."});
            dataToUpdate.categoryId=parsedCategoryId;
        }

        const sweet=await updateSweetService(id,dataToUpdate);
        return res.status(200).json(sweet);
    }catch(e){
        // code "P2025" means error because trying to update/delete non-existing data
        if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2025")
            return res.status(404).json({message:"not found..."});
        else if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2003") 
            return res.status(404).json({message:"this category not exist..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}

export const deleteSweet=async (req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);
        const sweet=await deleteSweetService(id);
        return res.status(200).json({message:"sweet deleted succesfully...",id});
    }catch(e:any){
        if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2025")
            return res.status(404).json({message:"not found..."});
        // we cant identify that its foreign key constraint violation bcz prisma not give its error code so we identify by e.message
        else if(e.message.includes("violates") && e.message.includes("foreign key constraint")) 
            return res.status(409).json(
                {message:"this sweet is purchased/restock by someone so cant delete it otherwise it cause inconsistency..."}
            );
        else
            return res.status(500).json({message:"server error..."});
    }
}

export const getAllSweets=async (req:Request,res:Response)=>{
    try{
        const allSweets=await getAllSweetService();
        return res.status(200).json(allSweets)
    }catch(e){
        return res.status(500).json({message:"server error..."});
    }
}

export const getFilteredSweet=async (req:Request,res:Response)=>{
    try{
        const {name,price,categoryId}=req.query;
        let filter:{name?:any,price?:number,categoryId?:number}={};

        if(name!==undefined){
            if(typeof name != "string" || name.trim().length<2)
                return res.status(400).json({message:"name must be valid and atleast of 2 character..."});
            filter.name={
                contains:name.trim(),
                mode:"insensitive"   // search case insensitively
            };
        }
        if(price!==undefined){
            const parsedPrice=Number(price);
            if(isNaN(parsedPrice) || parsedPrice<0)
                return res.status(400).json({message:"price must be of type number and not negative..."});
            filter.price=parsedPrice;
        }
        if(categoryId!==undefined){
            const parsedCategoryId=Number(categoryId);
            if(isNaN(parsedCategoryId) || parsedCategoryId<1)
                return res.status(400).json({message:"categoryId must be of type number and valid..."});
            filter.categoryId=parsedCategoryId;
        }

        const filteredSweets=await getFilteredSweetService(filter);
        return res.status(200).json(filteredSweets)
    }catch(e){
        return res.status(500).json({message:"server error..."});
    }
}

export const restockSweet=async (req:authRequest,res:Response)=>{
    try{
        const user=req.user;
        const id=Number(req.params.id);
        const {quantity}=req.body;
        if(!user)   return res.status(401).json({message:"unauthorized"});

        const {sweet,restockLog}=await restockSweetService(id,quantity,user.id);
        return res.status(200).json({message:"restocked successfully",sweet,restockLog});
    }catch(e:any){
        if(e.name==="appError")
            return res.status(e.statusCode).json({message:e.message});
        else if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2025")
            return res.status(404).json({message:"sweet not found..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}

export const purchaseSweet=async (req:authRequest,res:Response)=>{
    try{
        const user=req.user;
        const id=Number(req.params.id);
        const {quantity}=req.body;
        if(!user)   return res.status(401).json({message:"unauthorized"});

        const {purchase,updated}=await purchaseSweetService(id,quantity,user.id);
        return res.status(201).json({message:"purchase successful...",purchase,updated});
    }catch(e:any){
        if(e.name==="appError")
            return res.status(e.statusCode).json({message:e.message});
        else if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2025")
            return res.status(404).json({message:"sweet not found..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}
