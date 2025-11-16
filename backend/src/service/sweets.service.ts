import prisma from "../prisma"
import { appError } from "../utils/appError";

export const addSweetService=async (name:string,price:number,categoryId:number)=>{
    const sweet=await prisma.sweet.create({data:{name,price,categoryId},include:{category:true}});
    return sweet;
}
export const updateSweetService=async (id:number,dataToUpdate:{name?:string,price?:number,categoryId?:number})=>{
    const sweet=await prisma.sweet.update({data:dataToUpdate,where:{id},include:{category:true}});
    return sweet;
}
export const deleteSweetService=async (id:number)=>{
    const sweet=await prisma.sweet.delete({where:{id}});
    return sweet;
}

export const getAllSweetService=async ()=>{
    // join category and sweet by include (include will include category in sweet & do join)
    // we can also use select instead of include for join by select category table fields:true ,it select only those field which mention in select:{}
    const allSweet=await prisma.sweet.findMany({include:{category:true}});
    return allSweet;
}

export const getFilteredSweetService=async (filter:{name?:any,price?:number,categoryId?:number})=>{
    const filteredSweet=await prisma.sweet.findMany({where:filter,include:{category:true}});
    return filteredSweet;
}

export const restockSweetService=async (id:number,quantity:number,userId:number)=>{
    // ensure ACID property using transaction
    // here we can't use normal client because it not guarantee ACID property thats why we used tx=(transactional prisma client)
    // tx run all operation on a single connection as one atomic transaction. 
    const result=await prisma.$transaction(async (tx)=>{  // all using tx so atomic
        const int32min=-2147483648;
        const int32max=2147483647; 
        if(id<int32min || id>int32max) throw new appError("sweet not found...",404); // byme:- handle it by zod later
        const oldSweet=await tx.sweet.findUnique({where:{id}});
        if(!oldSweet) throw new appError("sweet not found...",404);
        const updatedQuantity=oldSweet.quantity+quantity;
        const sweet=await tx.sweet.update({data:{quantity:updatedQuantity},where:{id},include:{category:true}});
        const restockLog=await tx.restockLog.create({data:{sweetId:id,adminId:userId,quantity}});
        return {sweet,restockLog};
    });

    return result;
}

export const purchaseSweetService=async (id:number,quantity:number,userId:number)=>{
    const result=await prisma.$transaction(async (tx)=>{
        const int32min=-2147483648;
        const int32max=2147483647; 
        // bcz we are using int4 in DB whose range is 32bit so conversion of js number which very big to int4 fail & give error
        // this error has no specific prisma code like "P2025" for update/delete when data not exist
        // so cant give specific error message to user thats why handle it manually by appError.
        // byme :- handle it by zod on initial middleware but change error msg to invalid id
        if(id<int32min || id>int32max) throw new appError("sweet not found...",404); 
        const sweet=await tx.sweet.findUnique({where:{id}});
        if(!sweet) throw new appError("sweet not found...",404);
        if(sweet.quantity === 0)  throw new appError("out of stock",400);
        if(sweet.quantity < quantity)   throw new appError("insufficient stock",400);
        const updated=await tx.sweet.update({data:{quantity:sweet.quantity-quantity},where:{id},include:{category:true}});
        const totalPrice=parseFloat(((sweet.price)*quantity).toFixed(2));
        const purchase=await tx.purchase.create({data:{sweetId:id,userId,quantity,totalPrice}});
        return {updated,purchase};
    });

    return result;
}
