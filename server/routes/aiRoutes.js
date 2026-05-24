import express from "express";
import { testAIConnection } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai/test
router.post("/test", testAIConnection);

export default router;
