import {z} from "zod"


export const sweetIdValidator=z.object({
    id:z.coerce.number({error:"invalid id..."}).min(1,{error:"invalid id"}),
});

export const sweetInfoValidator=z.object({
    name:z.string({error:"invalid name..."}).min(4,{error:"name must of of atleast 4 character..."})
    .max(50,{error:"name must of of at max 50 character..."}),
    price:z.number({error:"price must be integer..."}).min(1,{error:"invalid price.."}),
    categoryId:z.number({error:"invalid category..."}).min(1,{error:"invalid category"}),
});

export const sweetquantityValidator=z.object({
    quantity:z.number({error:"invalid quantity"}).min(1,{error:"invalid quantity"}),
});