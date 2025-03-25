import Coupon from "../Model/coupon.js";
import CouponDetails from "../Model/couponDetails.js";

const createCouponDetails = async (details) => {
  const { couponType } = details;

  if (!couponType) {
    throw new Error("couponType is required");
  }

  // Create the coupon details object
  const couponDetails = new CouponDetails({ couponType });

  switch (couponType) {
    case "cart-wise":
      couponDetails.discount = details.discount;
      couponDetails.max_discount = details.max_discount;
      couponDetails.min_cart_value = details.min_cart_value;
      break;

    case "product-wise":
      couponDetails.product_details = details.product_details;
      couponDetails.discount = details.discount;
      couponDetails.max_discount = details.max_discount;
      break;

    case "bxgy":
      couponDetails.buy_products = details.buy_products;
      couponDetails.get_products = details.get_products;
      break;

    default:
      throw new Error("Invalid coupon typeee");
  }

  await couponDetails.save();
  return couponDetails._id;
};

export const createCoupon = async (req, res) => {
  try {
    const { details, expirationDate } = req.body;

    if (!details || !details.couponType) {
      return res.status(500).json({
        message: "Details are Required to create coupon",
        error: error.message,
      });
    }
    if (new Date(expirationDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Expiration date must be in the future" });
    }

    const couponDetailsId = await createCouponDetails(details);

    const coupon = new Coupon({
      details: couponDetailsId,
      expirationDate,
    });

    await coupon.save();

    return res
      .status(201)
      .json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res
      .status(500)
      .json({ message: "Error creating coupon", error: error.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().populate("details");
    if (!coupons.length) {
      return res
        .status(200)
        .json({ message: "No Available coupons at this moment", coupons });
    }
    return res
      .status(201)
      .json({ message: "Coupons Fetched successfully", coupons });
  } catch (error) {
    console.error("Error Fetching coupon:", error);
    res
      .status(500)
      .json({ message: "Error Fetching coupon", error: error.message });
  }
};

export const getCouponById = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById(id).populate("details");

    if (!coupon) {
      return res.status(400).json({
        message: "Enter Valid Coupon Id",
      });
    }
    return res
      .status(201)
      .json({ message: "Coupon Fetched successfully By Id", coupon });
  } catch (error) {
    console.error("Error Fetching coupon:", error);
    res
      .status(500)
      .json({ message: "Error Fetching coupon", error: error.message });
  }
};

export const updateCouponDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { details, expirationDate } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const couponDetail = await CouponDetails.findById(coupon.details);
    if (!couponDetail) {
      return res.status(404).json({ message: "Coupon details not found" });
    }

    if (expirationDate) {
      if (new Date(expirationDate) < new Date()) {
        return res.status(400).json({
          message: "Expiration date must be in the future",
        });
      }
      coupon.expirationDate = expirationDate;
    }

    const { couponType } = couponDetail;

    switch (couponType) {
      case "cart-wise":
        couponDetail.discount = details.discount ?? couponDetail.discount;
        couponDetail.max_discount =
          details.max_discount ?? couponDetail.max_discount;
        couponDetail.min_cart_value =
          details.min_cart_value ?? couponDetail.min_cart_value;
        break;

      case "product-wise":
        couponDetail.product_details =
          details.product_details ?? couponDetail.product_details;
        couponDetail.discount = details.discount ?? couponDetail.discount;
        break;

      case "bxgy":
        couponDetail.buy_products =
          details.buy_products ?? couponDetail.buy_products;
        couponDetail.get_products =
          details.get_products ?? couponDetail.get_products;
        break;

      default:
        return res.status(400).json({ message: "Invalid coupon type" });
    }

    const updatedDetails = await CouponDetails.findByIdAndUpdate(
      coupon.details,
      details,
      { new: true }
    );
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { expirationDate },
      { new: true }
    ).populate("details");

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error("Error Updating coupon:", error);
    res.status(500).json({
      message: "Error Updating coupon",
      error: error.message,
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(400).json({ message: "Enter valid id" });
    }
    await Promise.all([
      CouponDetails.findByIdAndDelete(coupon.details),
      Coupon.findByIdAndDelete(id),
    ]);
    return res.status(400).json({ message: "Coupon Deleted Successfully" });
  } catch (error) {
    console.error("Error Deletings coupon:", error);
    res.status(500).json({
      message: "Error Deleting coupon",
      error: error.message,
    });
  }
};

export const allApplicableCoupons = async (req, res) => {
  try {
    const { cart } = req.body;

    const coupons = await Coupon.find().populate("details");
    let applicable_coupons = [];

    for (let coupon of coupons) {
      const couponType = coupon.details.couponType;
      if (!couponType) {
        continue;
      }
      if (new Date(coupon.expirationDate) < new Date()) {
        continue;
      }
      let discount = 0;
      if (couponType === "product-wise") {
        const minReqQuantity = coupon.details.product_details.min_quantity;
        const maxDiscount = coupon.details.max_discount;
        const discountPercentage = coupon.details.discount;
        const couponApplicableProductId =
          coupon.details.product_details.product_id;

        const cartApplicableProduct = cart.items.filter(
          (item) => item.product_id == couponApplicableProductId
        );

        const totalPrice = cartApplicableProduct.reduce((acc, product) => {
          return acc + (product.quantity >= minReqQuantity ? product.price : 0);
        }, 0);

        discount = Math.min(
          (totalPrice * discountPercentage) / 100,
          maxDiscount
        );
      } else if (couponType === "cart-wise") {
        const maxDiscount = coupon.details.max_discount;
        const discountPercentage = coupon.details.discount;

        const totalPrice = cart.items.reduce((acc, product) => {
          return acc + product.price;
        }, 0);

        discount = Math.min(
          (totalPrice * discountPercentage) / 100,
          maxDiscount
        );
      } else if (couponType === "bxgy") {
        const buyProducts = coupon.details.buy_products;
        const getProducts = coupon.details.get_products;

        // Matching all the products from cart that are in the coupons of type bxgy from buy_product
        const allBuyProductsMatched = buyProducts.every((buyProduct) => {
          const cartItem = cart.items.find(
            (item) => item.product_id === buyProduct.product_id.toString()
          );
          return cartItem && cartItem.quantity >= buyProduct.quantity;
        });

        if (allBuyProductsMatched) {
          discount = getProducts.reduce((acc, getProduct) => {
            const cartItem = cart.items.find(
              (item) => item.product_id === getProduct.product_id.toString()
            );

            if (cartItem) {
              const perUnitPrice = cartItem.price / cartItem.quantity;
              const discountQuantity = Math.floor(
                cartItem.quantity / getProduct.quantity
              );
              const discountAmount = perUnitPrice * discountQuantity;

              acc += discountAmount;
            }
            return acc;
          }, 0);
        }
      }

      if (discount > 0) {
        applicable_coupons.push({
          coupon_id: coupon._id,
          type: couponType,
          discount: discount,
        });
      }
    }
    return res.status(200).json({
      applicable_coupons,
    });
  } catch (error) {
    console.error("Error in finding applicable coupon:", error);
    res.status(500).json({
      message: "Error in finding applicable coupon",
      error: error.message,
    });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { cart } = req.body;

    const coupon = await Coupon.findById(id).populate("details");
    let discount = 0;
    let FinalAmount;
    let totalApplicableDiscountPrice;
    const totalCartValue = cart.items.reduce((acc, item) => {
      return acc + item.price;
    }, 0);

    if (new Date(coupon.expirationDate) < new Date()) {
      return res.status(200).json({
        message: "Coupon Expired",
      });
    }

    switch (coupon.details.couponType) {
      case "cart-wise":
        totalApplicableDiscountPrice = totalCartValue;
        discount = Math.min(
          coupon.details.max_discount,
          (totalApplicableDiscountPrice * coupon.details.discount) / 100
        );
        FinalAmount = totalCartValue - discount;
        break;

      case "product-wise":
        const minReqQuantity = coupon.details.product_details.min_quantity;
        const maxDiscount = coupon.details.max_discount;

        const ApplicableProduct = cart.items.filter(
          (item) =>
            item.product_id ===
            coupon.details.product_details.product_id.toString()
        );
        totalApplicableDiscountPrice = ApplicableProduct.reduce(
          (acc, product) => {
            return (
              acc + (product.quantity >= minReqQuantity ? product.price : 0)
            );
          },
          0
        );
        discount = Math.min(
          (totalApplicableDiscountPrice * coupon.details.discount) / 100,
          maxDiscount
        );
        FinalAmount = totalCartValue - discount;
        break;

      case "bxgy":
        const buyProducts = coupon.details.buy_products;
        const getProducts = coupon.details.get_products;

        const allBuyProductsMatched = buyProducts.every((buyProduct) => {
          const cartItem = cart.items.find(
            (item) => item.product_id === buyProduct.product_id.toString()
          );
          return cartItem && cartItem.quantity >= buyProduct.quantity;
        });

        if (allBuyProductsMatched) {
          discount = getProducts.reduce((acc, getProduct) => {
            const cartItem = cart.items.find(
              (item) => item.product_id === getProduct.product_id.toString()
            );

            if (cartItem) {
              const perUnitPrice = cartItem.price / cartItem.quantity;

              const discountQuantity = Math.floor(
                cartItem.quantity / getProduct.quantity
              );

              const discountAmount = perUnitPrice * discountQuantity;

              acc += discountAmount;
            }
            return acc;
          }, 0);

          FinalAmount = totalCartValue - discount;
        } else {
          FinalAmount = totalCartValue;
        }
        break;

      default:
        FinalAmount = totalCartValue;
    }

    const updated_cart = {
      ...cart,
      total_cart_value: totalCartValue,
      total_applicable_discount_price: totalApplicableDiscountPrice,
      total_discount: discount,
      final_amount: FinalAmount,
    };
    return res.status(201).json({
      message: "Coupon Applied",
      updated_cart,
    });
  } catch (error) {
    console.error("Error in applying coupon:", error);
    res.status(500).json({
      message: "Error in applying coupon",
      error: error.message,
    });
  }
};
