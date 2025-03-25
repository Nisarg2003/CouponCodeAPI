import express from "express";
import connectDB from "./Config/db.js";
import couponRoutes from "./Routes/couponRoutes.js";

connectDB();

const app = express();
app.use(express.json());
app.use("/api/coupons", couponRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
