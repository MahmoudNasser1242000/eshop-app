const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const databaseConnection = require("./config/databaseConnection");
const errMiddleware = require("./middlewares/errorMiddlewares");
const { webhookCheckout } = require("./services/orderServicies");

const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoute = require("./routes/subcategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const usertRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const addressRoute = require("./routes/addressRoute");
const couponRoute = require("./routes/couponRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");

// expres app
const app = express();

// Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});
// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// db connection
databaseConnection();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`node-env: ${process.env.NODE_ENV}`);
}

//Routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subcategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", usertRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);

// handleing errors
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this url: ${req.originalUrl}`, 400));
});

app.use(errMiddleware);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`server started in port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection errors ${err.name} | ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
