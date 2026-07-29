import express from "express";
import { getResources, addResource } from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getResources);
router.post("/", addResource);

export default router;
