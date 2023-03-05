const {
  getSubCategories,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getFilterObj,
  setCategoryIdToBody,
  uploadSubCategoryImage,
  resizeImage,
} = require("../services/subcategoryServicies");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subcategoryValidatorError");

const authService = require("../services/authServicies");

const express = require("express");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getFilterObj, getSubCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadSubCategoryImage,
    resizeImage,
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  ); //filterCreateSubCategory,
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadSubCategoryImage,
    resizeImage,
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
