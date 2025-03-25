import mongoose from "mongoose";

const couponDetailsSchema = new mongoose.Schema(
  {
    couponType: {
      type: String,
      enum: ["cart-wise", "product-wise", "bxgy"],
      required: true,
    },

    // For Cart-wise Coupons
    discount: { type: Number },
    max_discount: { type: Number },
    min_cart_value: {
      type: Number,
      required: function () {
        return this.couponType === "cart-wise";
      },
    },

    // For Product-wise Coupons (Conditional Validation)
    product_details: {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: function () {
          return this.couponType === "product-wise";
        },
      },
      min_quantity: {
        type: Number,
        required: function () {
          return this.couponType === "product-wise";
        },
      },
    },

    // For BxGy Coupons (Conditional Validation)
    buy_products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: function () {
            return this.couponType === "bxgy";
          },
        },
        quantity: {
          type: Number,
          required: function () {
            return this.couponType === "bxgy";
          },
        },
      },
    ],
    get_products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: function () {
            return this.couponType === "bxgy";
          },
        },
        quantity: {
          type: Number,
          required: function () {
            return this.couponType === "bxgy";
          },
        },
      },
    ],
  },
  {
    strict: false,
    timestamps: true,
    minimize: true,
  }
);

export default mongoose.model("CouponDetails", couponDetailsSchema);
