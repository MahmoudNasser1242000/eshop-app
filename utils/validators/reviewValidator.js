const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const reviewModel = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("user")
    .isMongoId()
    .withMessage("Invalid id format for this user"),
    // .custom((val, { req }) => {
    //     if (val !== req.user._id.toString()) {
    //       return Promise.reject(
    //         new Error("You are not allow to create this review")
    //       );
    //     }
    //   return true;
    // }),
  check("product")
    .isMongoId()
    .withMessage("Invalid id format for this product")
    .custom((val, { req }) =>
      // Check if logged user create review before
      reviewModel
        .findOne({ user: req.user._id, product: val })
        .then((review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        })
    ),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id format for this review")
    .custom((val) =>
      reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        return true;
      })
    ),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id format for this review")
    .custom((val, {req}) =>
      reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id format for this review")
    .custom((val, { req }) => {
      // Check review ownership before update
      if (req.user.role === "user") {
        return reviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
