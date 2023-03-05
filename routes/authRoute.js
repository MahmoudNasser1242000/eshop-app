const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword
} = require("../services/authServicies");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidatorError");
const express = require("express");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyPassResetCode", verifyPassResetCode);
router.post("/resetPassword", resetPassword);

module.exports = router;
