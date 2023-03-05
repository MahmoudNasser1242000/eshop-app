const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getFilterObj,
  setCategoryIdToBody,
} = require("../services/reviewServicies");
const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const express = require("express");

const authService = require("../services/authServicies");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getFilterObj, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setCategoryIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
