import { Router } from "express";
import { createCategory } from "../controllers/category.controller.js";
import { categoryAuth } from "../middleware/category.mw.js";

const router = Router();

router.post("/create-Category",[categoryAuth],createCategory);

export default router;