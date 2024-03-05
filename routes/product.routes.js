import { Router } from "express";
import upload from "../middleware/multer.mw.js";
import { createProduct } from "../controllers/product.controller.js";
import { isAdmin } from "../middleware/category.mw.js";
 
const router = Router();

router.post("/create-product",isAdmin,upload.array('images',5),createProduct);

export default router;