import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { checkOrderStatus, completeBuyerOrder, completeSellerOrder, getOrders, newOrder } from "../controllers/order.controller.js";

const router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
// router.put("/", verifyToken, confirm);
router.post("/create-new-order", verifyToken, newOrder);
router.post("/complete-seller-order", verifyToken, completeSellerOrder);
router.post("/complete-buyer-order", verifyToken, completeBuyerOrder);
router.post("/check-order-status", verifyToken, checkOrderStatus);

export default router;
