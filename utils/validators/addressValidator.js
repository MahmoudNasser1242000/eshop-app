const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { check, body } = require("express-validator");
const userModel = require("../../models/userModel");

exports.addAddressValidator = [
  check("alias")
    .optional()
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.user._id);
      if (user.address.map((add)=> add.alias).includes(val)) {
        throw new Error(`you have allready create an alias like this before`);
      }
      return true;
    }),
  check("postalCode").optional(),  
  validatorMiddleware,
];

exports.removeAddressValidator = [
  check("addressId")
    .isMongoId()
    .withMessage("Invalid id format for this product")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.user._id);
      if (!user.address.map((add)=> add._id).includes(val)) {
        throw new Error(`we couldn't find address have id ${val}`);
      }
      return true;
    }),
  validatorMiddleware,
];
