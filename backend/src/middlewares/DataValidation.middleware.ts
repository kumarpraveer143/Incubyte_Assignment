import {Request,Response,NextFunction} from "express"
import {userRegister,userLogin} from "../validators/auth.validator"
import {categoryName,categoryId} from "../validators/category.validator"
import {sweetIdValidator,sweetInfoValidator,sweetquantityValidator} from "../validators/sweet.validator"

// safely parse the data by using zod schema imported from auth.validator module
export const registerValidateMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const result=userRegister.safeParse(req.body);
    if(!result.success){
        const message=result.error.issues[0]?.message;  
        // issues is array and typescript think it can be zero so it give error if not put ?
        return res.status(400).json({message});
    }
    next(); // goto next if pass zod schema validation.
}

export const loginValidateMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const result=userLogin.safeParse(req.body);
    if(!result.success){
        const message=result.error.issues[0]?.message;
        return res.status(400).json({message});
    }
    next();
}

export const categoryNameValidateMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const result=categoryName.safeParse(req.body);
    if(!result.success){
        const message=result.error.issues[0]?.message;
        return res.status(400).json({message});
    }
    next();
}

export const categoryIdValidateMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const result=categoryId.safeParse(req.params);
    if(!result.success){
        const message=result.error.issues[0]?.message;
        return res.status(400).json({message});
    }
    next();
}

export const sweetInfoValidatorMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const result=sweetInfoValidator.safeParse(req.body);
    if(!result.success){
        const message=result.error.issues[0]?.message;
        return res.status(400).json({message});
    }
    next();
}

export const sweetIdValidatorMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const result=sweetIdValidator.safeParse(req.params);
    if(!result.success){
        const message=result.error.issues[0]?.message;
        return res.status(400).json({message});
    }
    next();
}


export const sweetquantityValidatorMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const result=sweetquantityValidator.safeParse(req.body);
    if(!result.success){
        const message=result.error.issues[0]?.message;
        return res.status(400).json({message});
    }
    next();
}