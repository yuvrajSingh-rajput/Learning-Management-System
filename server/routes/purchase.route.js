import express from "express";
import isAuthenticated from "../middlewares/isAuthenticates.js";
import { 
    createCheckoutSession, 
    getAllPurchasedCourse, 
    getCourseDetailWithPurchaseStatus, 
    stripeWebhook 
} from "../controllers/purchase-course.controller.js";

const router = express.Router();

router.route('/checkout/create-checkout-session').post(isAuthenticated, createCheckoutSession);
router.route('/webhook').post(express.raw({type: "application/json"}), stripeWebhook); 
router.route('/course/:courseId/detail-with-status').get(isAuthenticated, getCourseDetailWithPurchaseStatus);
router.route("/").get(isAuthenticated, getAllPurchasedCourse);

export default router;