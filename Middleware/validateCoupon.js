export const validateCoupon = (req, res, next) => {
  const { details } = req.body;
  if (!details.couponType) {
    return res.status(400).json({ message: "CouponType Required" });
  }
  if (!["cart-wise", "product-wise", "bxgy"].includes(details.couponType)) {
    return res.status(400).json({ message: "Invalid coupon type" });
  }

  if (details.couponType === "cart-wise") {
    if (
      !details.min_cart_value ||
      !details.discount ||
      !details.max_discount ||
      Array.isArray(details.buy_products) ||
      Array.isArray(details.get_products) ||
      details.buy_products ||
      details.get_products ||
      details.product_details
    ) {
      return res.status(400).json({
        message:
          "Cart-wise coupon requires only Minimum Cart Value, discount and Maximum Discount",
      });
    }
  }

  if (details.couponType === "product-wise") {
    if (
      !details.product_details ||
      !details.product_details.product_id ||
      !details.product_details.min_quantity ||
      !details.discount ||
      !details.max_discount ||
      Array.isArray(details.buy_products) ||
      Array.isArray(details.get_products) ||
      details.buy_products ||
      details.get_products
    ) {
      return res.status(400).json({
        message:
          "Product-wise coupon requires only product_id, min_quantity, discount and maxDiscount",
      });
    }
  }

  if (details.couponType === "bxgy") {
    if (
      !Array.isArray(details.buy_products) ||
      !Array.isArray(details.get_products) ||
      details.min_cart_value ||
      details.discount ||
      details.max_discount ||
      details.product_details
    ) {
      return res.status(400).json({
        message:
          "BxGy coupon requires only buy_products and get_products as arrays",
      });
    }

    const isValidBuyProducts = details.buy_products.every(
      (product) => product.product_id && product.quantity > 0
    );

    const isValidGetProducts = details.get_products.every(
      (product) => product.product_id && product.quantity > 0
    );

    if (!isValidBuyProducts || !isValidGetProducts) {
      return res.status(400).json({
        message:
          "BxGy coupon requires valid product_id and quantity for both buy and get products",
      });
    }
  }

  next();
};
