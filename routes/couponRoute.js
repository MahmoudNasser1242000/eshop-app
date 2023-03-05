const {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponServicies");
const {
  createCouponValidator,
  updateCouponValidator,
} = require("../utils/validators/couponValidator");
const express = require("express");

const authService = require("../services/authServicies");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCouponValidator, createCoupon);
router
  .route("/:id")
  .get(getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
