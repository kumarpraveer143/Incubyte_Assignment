import {z} from "zod"

export const categoryName=z.object({
    name:z.string({error:(issue)=>issue.input===undefined?"name is required":"invalid name"})
    .min(4,{error:"name must of of atleast 4 character"}).max(50,{error:"name must of of at max 50 character"}),
})

export const categoryId=z.object({
    // coerce is namespace that provide type conversion version of zod types like number(),string(),.... 
    // it first try to convert input to target type
    // if conversion fail then fallback to error handler define in number({error:})
    // if pass then it still check is it number then goto next bcz "   " coerce but its NaN 
    // and also "Infinity" coerce but its not number
    id:z.coerce.number({error:(issue)=>issue.input===undefined?"id is required":"invalid id"})
    .min(1,{error:"invalid id"}),
})
