import express from "express";
import { validateCoupon } from "../Middleware/validateCoupon.js";
import {
  allApplicableCoupons,
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCouponDetails,
} from "../Controller/couponController.js";

const router = express();

router.post("/createCoupon", validateCoupon, createCoupon);
router.get("/fetchAllCoupons", getAllCoupons);
router.get("/fetchCouponById/:id", getCouponById);
router.put("/updateCouponById/:id", validateCoupon, updateCouponDetails);
router.delete("/deleteCoupon/:id", deleteCoupon);

router.post("/applicableCoupons", allApplicableCoupons);
router.post("/applyCoupon/:id", applyCoupon);

export default router;
