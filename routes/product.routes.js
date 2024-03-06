import { Router } from "express";
import upload from "../middleware/multer.mw.js";
import { createProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import { isAdmin } from "../middleware/category.mw.js";
 
const router = Router();

router.post("/create-product",isAdmin,upload.array('images',5),createProduct);
router.get("/get-all-product",getProducts);
router.put("/update-product/:id",isAdmin,updateProduct);

export default router;