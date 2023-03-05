const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImage,
} = require("../services/productServicies");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidatorError");

const authService = require("../services/authServicies");
const reviewRoute = require("./reviewRoute")

const express = require("express");
const router = express.Router();

router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeImage,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
