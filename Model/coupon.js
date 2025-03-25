import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CouponDetails",
    required: true,
  },
  expirationDate: { type: Date, required: true },
});

export default mongoose.model("Coupon", couponSchema);
