const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { address: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully to your account.",
    data: user.address,
  });
});

exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { address: {_id: req.params.addressId} },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully from your account.",
    data: user.address,
  });
});

exports.getLoggedUserAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate('address')

  res.status(200).json({
    status: "success",
    results: user.address.length,
    data: user.address,
  });
});
