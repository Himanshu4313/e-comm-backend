import { Router } from "express";
import upload from "../middleware/multer.mw.js";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import { isAdmin } from "../middleware/category.mw.js";
 
const router = Router();

router.post("/create-product",isAdmin,upload.array('images',5),createProduct);
router.get("/get-all-product",getProducts);
router.put("/update-product/:id",isAdmin,updateProduct);
router.delete("/delete-product/:id",isAdmin,deleteProduct);

export default router;