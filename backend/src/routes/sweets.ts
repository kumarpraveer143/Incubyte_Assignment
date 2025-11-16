import {Router} from "express"
import {userJwtAuth,isRoleAdminAuth} from "../middlewares/authentication.middleware"
import {sweetIdValidatorMiddleware,sweetInfoValidatorMiddleware,sweetquantityValidatorMiddleware} from "../middlewares/DataValidation.middleware"
import {addSweet,updateSweet,deleteSweet,getAllSweets,getFilteredSweet,restockSweet, purchaseSweet} from "../controllers/sweets.controller"

const router=Router();

// add new sweet "here we not add quantity,quantity have seprate route"" (only admin)
router.post("/",sweetInfoValidatorMiddleware,userJwtAuth,isRoleAdminAuth,addSweet);
// update a sweet (only admin)
router.put("/:id",sweetIdValidatorMiddleware,userJwtAuth,isRoleAdminAuth,updateSweet); 
// delete a sweet (only admin)
router.delete("/:id",sweetIdValidatorMiddleware,userJwtAuth,isRoleAdminAuth,deleteSweet);
// see all available sweets
router.get("/",userJwtAuth,getAllSweets);
// search a sweet by name , category , price
router.get("/search",userJwtAuth,getFilteredSweet);



// sweet restock
router.post("/:id/restock",sweetIdValidatorMiddleware,sweetquantityValidatorMiddleware,userJwtAuth,isRoleAdminAuth,restockSweet);
// sweet purchase
router.post("/:id/purchase",sweetIdValidatorMiddleware,sweetquantityValidatorMiddleware,userJwtAuth,purchaseSweet);

export default router;