const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandServicies");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidatorError");
const express = require("express");

const authService = require("../services/authServicies");

const router = express.Router();

//   router.use("/:categoryId/subcategories", subcategoryRoute)

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
