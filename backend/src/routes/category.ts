import { Router } from "express"
import { isRoleAdminAuth, userJwtAuth } from "../middlewares/authentication.middleware";
import { categoryNameValidateMiddleware, categoryIdValidateMiddleware } from "../middlewares/DataValidation.middleware"
import { addCategory, deleteCategory, getAllCategory } from "../controllers/category.controller"

const router = Router();

router.post("/", categoryNameValidateMiddleware, userJwtAuth, isRoleAdminAuth, addCategory) // add category
router.delete("/:id", categoryIdValidateMiddleware, userJwtAuth, isRoleAdminAuth, deleteCategory) // delete category
router.get("/", userJwtAuth, getAllCategory) // get all category

export default router;