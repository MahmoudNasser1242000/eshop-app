const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { check, body } = require("express-validator");
const categoryModel = require("../../models/categoryModel");
const slugify = require("slugify");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subcategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("required subcategory name")
    .isLength({ min: 3 })
    .withMessage("too short name subcategory")
    .isLength({ max: 32 })
    .withMessage("too long name subcategory")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("mainCategory")
    .isMongoId()
    .withMessage("invalid category id format")
    .notEmpty()
    .withMessage("required category name")
    .custom((val, { req }) => 
        categoryModel.findById(val).then((category) => {
          if (!category) {
            return Promise.reject(new Error(`No category for this id: ${val}`));
          }
        })
      ),
    // .custom((val, { req }) => {
    //   if (!val && req.params.categoryId) {
    //     req.body.mainCategory = req.params.categoryId;
    //   }
    // }),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subcategory id format"),
  body("name")
    .notEmpty()
    .withMessage("required subcategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("mainCategory")
    .isMongoId()
    .withMessage("invalid category id format")
    .notEmpty()
    .withMessage("required category name")
    .custom((val, { req }) =>
      categoryModel.findById(val).then((category) => {
        if (!category) {
          return Promise.reject(new Error(`No category for this id: ${val}`));
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subcategory id format"),
  validatorMiddleware,
];
