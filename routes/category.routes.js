import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js";
import { isAdmin } from "../middleware/category.mw.js";

const router = Router();

router.post("/create-Category",isAdmin,createCategory);
router.get("/get-all-category",isAdmin,getAllCategories);
router.put("/update/:id",isAdmin,updateCategory);
router.delete("/delete/:id",isAdmin,deleteCategory);


export default router;