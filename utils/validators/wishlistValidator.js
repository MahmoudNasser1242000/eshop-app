const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { check, body } = require("express-validator");
const productModel = require("../../models/productModel");

exports.addProductToWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("productId required")
    .custom(async (val, { req }) => {
      const product = await productModel.findById(val);
      if (!product) {
        throw new Error(`we couldn't find product have id ${val}`);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.removeProductFromWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid id format for this product")
    .custom(async (val, { req }) => {
      const product = await productModel.findById(val);
      if (!product) {
        throw new Error(`we couldn't find product have id ${val}`);
      }
      return true;
    }),
  validatorMiddleware,
];
