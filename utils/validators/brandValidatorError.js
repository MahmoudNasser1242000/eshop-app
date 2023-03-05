const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { check, body } = require("express-validator");
const slugify = require("slugify");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid barnd id format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("required brand name")
    .isLength({ min: 3 })
    .withMessage("too short name brand")
    .isLength({ max: 32 })
    .withMessage("too long name brand")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid barnd id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid barnd id format"),
  validatorMiddleware,
];
