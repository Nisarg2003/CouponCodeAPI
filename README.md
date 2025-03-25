# CouponCodeAPI

# Coupons-Management-API

## 🚀 **Overview**

This project is a **Node.js and MongoDB-based coupon management system**. It allows you to:

- Create, retrieve, update, and delete coupons.
- Apply coupons to products and check applicable coupons.
- Manage coupon details like cart-wise, product-wise, and BxGy offers.

---

## ⚙️ **Tech Stack**

- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Validation:** Middleware validation for coupons
- **Error Handling:** Consistent error handling with proper status codes
- **Concurrency:** Optimized with `Promise.all()` for efficient operations

---

## 🛠️ **Project Setup**

1. **Clone the Repository**

```bash
git clone https://github.com/Nisarg2003/CouponCodeAPI.git
cd Coupon Code
npm install
```
2. **Download Dependencies**

```bash
npm instal
```

### Assumption 
  1. ProductId comes from product Table

## 🛠️ **Project Features**

### 🔥 **1. Coupon Expiration Handling**
- The system validates and ensures that coupons **cannot be applied** after their expiration date.
- **Expiration validation** is performed during coupon creation and application.

### 🔥 **2. Multiple Coupon Types**
- Supports **three types of coupons**:
  - **Cart-wise:** Discounts applied on the total cart value.
  - **Product-wise:** Discounts applied on specific products.
  - **BxGy (Buy X Get Y):** Offers free or discounted products when purchasing a specific quantity.
- Each type has **custom validation rules** and fields.

### 🔥 **3. Middleware Validation**
- Implements **custom middleware validation** to:
  - Validate fields based on the **type of coupon**.
  - Ensure the required fields are present (e.g., `min_cart_value` for cart-wise).
  - Prevent invalid coupon creation or updates.

### 🔥 **4. Maximum Discount Limit**
- Supports handling of **maximum discount caps**:
  - For cart-wise and product-wise coupons, you can **specify a max discount**.
  - Ensures that the discount amount **never exceeds the cap**, even if the calculated discount is higher.

### 🔥 **5. Efficient Database Operations**
- Uses `Promise.all()` to perform **concurrent deletions** of coupons and details.
- Optimized with **`findByIdAndUpdate({ new: true })`** for efficient updates.
- Utilizes **MongoDB references** to link `Coupon` and `CouponDetails` collections.

### 🔥 **6. Error Handling**
- Consistent and clear **error responses** for invalid IDs, missing fields, and incorrect operations.
- Returns appropriate HTTP status codes:
  - `400` for bad requests.
  - `404` for not found.
  - `204` for successful deletions with no content.
  - `500` for server errors.

### 🔥 **7. Clean and Modular Code**
- Follows **modular architecture** with:
  - Separate controllers for coupon operations.
  - Middleware for validation.
  - Error handling functions for cleaner code management.

## 🛠️ **Project Routes and its Responses**

1. **Create Coupon (/api/coupons/createCoupon) 
(POST)

    Request Body :
   ```bash
   {
    "details": {
    "couponType": "product-wise",
    "product_details": {
    "product_id": "605c72f3b7f3e26a0c5c9c13",
    "min_quantity": 2
    },
    "discount":10,
    "max_discount":200
    },
    "expirationDate": "2025-11-30"
    }
   ```
   Response :
   ```bash
   {
    "message": "Coupon created successfully",
    "coupon": {
        "details": "67e2cfdded1e3a4ba58b9176",
        "expirationDate": "2025-11-30T00:00:00.000Z",
        "_id": "67e2cfdded1e3a4ba58b9178",
        "__v": 0
    }
    }
    ```

3. **Fetch All Coupons (/api/coupons/fetchAllCoupons)
(GET)

    Response :
    ```bash
      {
      "message": "Coupons Fetched successfully",
      "coupons": [
          {
              "_id": "67e254b9d2657253943c6832",
              "details": {
                  "_id": "67e254b9d2657253943c6830",
                  "couponType": "cart-wise",
                  "buy_products": [],
                  "get_products": [],
                  "discount": 10,
                  "max_discount": 100,
                  "min_cart_value": 300,
                  "createdAt": "2025-03-25T07:01:13.921Z",
                  "updatedAt": "2025-03-25T07:01:13.921Z",
                  "__v": 0
              },
              "expirationDate": "2025-12-31T00:00:00.000Z",
              "__v": 0
          },
          {
              "_id": "67e255261d09ce828e72187d",
              "details": {
                  "_id": "67e255261d09ce828e721879",
                  "couponType": "bxgy",
                  "buy_products": [
                      {
                          "product_id": "605c72f3b7f3e26a0c5c9c13",
                          "quantity": 14,
                          "_id": "67e255261d09ce828e72187a"
                      }
                  ],
                  "get_products": [
                      {
                          "product_id": "605c72f3b7f3e26a0c5c9c15",
                          "quantity": 2,
                          "_id": "67e255261d09ce828e72187b"
                      }
                  ],
                  "createdAt": "2025-03-25T07:03:02.769Z",
                  "updatedAt": "2025-03-25T08:06:04.221Z",
                  "__v": 1
              },
              "expirationDate": "2025-11-30T00:00:00.000Z",
              "__v": 0
          },
          {
              "_id": "67e270645b66f2cab74bc5c5",
              "details": {
                  "product_details": {
                      "product_id": "605c72f3b7f3e26a0c5c9c13",
                      "min_quantity": 2
                  },
                  "_id": "67e270645b66f2cab74bc5c3",
                  "couponType": "product-wise",
                  "buy_products": [],
                  "get_products": [],
                  "discount": 10,
                  "max_discount": 200,
                  "createdAt": "2025-03-25T08:59:16.408Z",
                  "updatedAt": "2025-03-25T08:59:16.408Z",
                  "__v": 0
              },
              "expirationDate": "2025-11-30T00:00:00.000Z",
              "__v": 0
          },
          {
              "_id": "67e2cfdded1e3a4ba58b9178",
              "details": {
                  "product_details": {
                      "product_id": "605c72f3b7f3e26a0c5c9c13",
                      "min_quantity": 2
                  },
                  "_id": "67e2cfdded1e3a4ba58b9176",
                  "couponType": "product-wise",
                  "buy_products": [],
                  "get_products": [],
                  "discount": 10,
                  "max_discount": 200,
                  "createdAt": "2025-03-25T15:46:37.988Z",
                  "updatedAt": "2025-03-25T15:46:37.988Z",
                  "__v": 0
              },
              "expirationDate": "2025-11-30T00:00:00.000Z",
              "__v": 0
          }
      ]
    }
    ```

3. Fetch Coupon By Id (/api/coupons/fetchCouponById/:id)
(GET)

    Response :
    ```bash
        {
        "message": "Coupon Fetched successfully By Id",
        "coupon": {
            "_id": "67e2cfdded1e3a4ba58b9178",
            "details": {
                "product_details": {
                    "product_id": "605c72f3b7f3e26a0c5c9c13",
                    "min_quantity": 2
                },
                "_id": "67e2cfdded1e3a4ba58b9176",
                "couponType": "product-wise",
                "buy_products": [],
                "get_products": [],
                "discount": 10,
                "max_discount": 200,
                "createdAt": "2025-03-25T15:46:37.988Z",
                "updatedAt": "2025-03-25T15:46:37.988Z",
                "__v": 0
            },
            "expirationDate": "2025-11-30T00:00:00.000Z",
            "__v": 0
        }
    }
    ```

4. Update Coupon By Id (/api/coupons/updateCouponById/:id")
   (PUT)

     Request Body:
     ```bash
      {"details": {
              "couponType": "bxgy",
              "buy_products": [
                  {
                      "product_id": "605c72f3b7f3e26a0c5c9c13",
                      "quantity": 14,
                      "_id": "67e255261d09ce828e72187a"
                  }
              ],
              "get_products": [
                  {
                      "product_id": "605c72f3b7f3e26a0c5c9c15",
                      "quantity": 1,
                      "_id": "67e255261d09ce828e72187b"
                  }
              ]
     }
     }
     ```
     Response :
     ```bash
     {
      "message": "Coupon updated successfully",
      "coupon": {
          "_id": "67e255261d09ce828e72187d",
          "details": {
              "_id": "67e255261d09ce828e721879",
              "couponType": "bxgy",
              "buy_products": [
                  {
                      "product_id": "605c72f3b7f3e26a0c5c9c13",
                      "quantity": 14,
                      "_id": "67e255261d09ce828e72187a"
                  }
              ],
              "get_products": [
                  {
                      "product_id": "605c72f3b7f3e26a0c5c9c15",
                      "quantity": 1,
                      "_id": "67e255261d09ce828e72187b"
                  }
              ],
              "createdAt": "2025-03-25T07:03:02.769Z",
              "updatedAt": "2025-03-25T16:01:09.278Z",
              "__v": 1
          },
          "expirationDate": "2025-11-30T00:00:00.000Z",
          "__v": 0
      }
      }
     ```

5. DeleteCoupon ("api/coupons/deleteCoupon/:id")
   (DELETE)

     Response :
     ```bash
     { message: "Coupon Deleted Successfully" }
     ```

6. All Applicable Coupons To Cart ("api/coupons/applicableCoupons")
   (POST)

     Request Body:
     ```bash
     {
      "cart":{
          "items":[
              {
                  "product_id" :"605c72f3b7f3e26a0c5c9c13",
                  "quantity":16,
                  "price":200
              },
               {
                  "product_id" :"605c72f3b7f3e26a0c5c93",
                  "quantity":2,
                  "price":200
              },
              {
                  "product_id" :"605c72f3b7f3e26a0c5c9c13",
                  "quantity":15,
                  "price":200
              },
              {
                  "product_id" :"605c72f3b7f3e26a0c5c9c15",
                  "quantity":4,
                  "price":200
              }
          ]
      }
      }
     ```
  
     Response :
     ```bash
     {
      "applicable_coupons": [
          {
              "coupon_id": "67e254b9d2657253943c6832",
              "type": "cart-wise",
              "discount": 80
          },
          {
              "coupon_id": "67e255261d09ce828e72187d",
              "type": "bxgy",
              "discount": 200
          },
          {
              "coupon_id": "67e270645b66f2cab74bc5c5",
              "type": "product-wise",
              "discount": 40
          },
          {
              "coupon_id": "67e2cfdded1e3a4ba58b9178",
              "type": "product-wise",
              "discount": 40
          }
      ]
      }
     ```
7. Apply Coupon On Cart Items ("api/coupons/applyCoupon/:id")
   (POST)

   Request Body :
   
   ```bash
       {
        "cart":{
            "items":[
                {
                    "product_id" :"605c72f3b7f3e26a0c5c9c13",
                    "quantity":16,
                    "price":200
                },
                 {
                    "product_id" :"605c72f3b7f3e26a0c5c93",
                    "quantity":2,
                    "price":200
                },
                {
                    "product_id" :"605c72f3b7f3e26a0c5c9c13",
                    "quantity":15,
                    "price":200
                },
                {
                    "product_id" :"605c72f3b7f3e26a0c5c9c15",
                    "quantity":4,
                    "price":200
                }
            ]
        }
        }
    ```
    Response :
      ```bash
    {
        "message": "Coupon Applied",
        "updated_cart": {
            "items": [
                {
                    "product_id": "605c72f3b7f3e26a0c5c9c13",
                    "quantity": 16,
                    "price": 200
                },
                {
                    "product_id": "605c72f3b7f3e26a0c5c93",
                    "quantity": 2,
                    "price": 200
                },
                {
                    "product_id": "605c72f3b7f3e26a0c5c9c13",
                    "quantity": 15,
                    "price": 200
                },
                {
                    "product_id": "605c72f3b7f3e26a0c5c9c15",
                    "quantity": 4,
                    "price": 200
                }
            ],
            "total_cart_value": 800,
            "total_applicable_discount_price": 400,
            "total_discount": 40,
            "final_amount": 760
        }
    }
      ```


   
