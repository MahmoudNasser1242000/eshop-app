const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { check, body } = require("express-validator");
const couponModel = require("../../models/couponModel");

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("coupon name required")
    .custom(async (val, { req }) => {
      const coupon = await couponModel.findOne({ name: val });
      if (coupon) {
        throw new Error(`you have allready create a coupon with this name`);
      }
    }),
  check("expire").notEmpty().withMessage("coupon date required"),
  check("discount")
    .notEmpty()
    .withMessage("coupon discount required")
    .isNumeric()
    .withMessage("coupon discount must be a number"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("name")
    .optional()
    .custom(async (val, { req }) => {
      const coupon = await couponModel.findOne({ name: val });
      if (coupon) {
        throw new Error(`you have allready create a coupon with this name`);
      }
    }),
  check("expire").optional(),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("coupon discount must be a number"),
  validatorMiddleware,
];
