const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./factoryHandler");
const couponModel = require("../models/couponModel");

exports.getCoupons = getAll(couponModel, "");

exports.getCoupon = getOne(couponModel);

exports.createCoupon = createOne(couponModel);

exports.updateCoupon = updateOne(couponModel);

exports.deleteCoupon = deleteOne(couponModel);