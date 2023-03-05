const asyncHandler = require("express-async-handler");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./factoryHandler");
const reviewModel = require("../models/reviewModel");

// Nested route (Create)
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// Nested route (get)
exports.getFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

exports.getReviews = getAll(reviewModel, "")
// exports.getReviews = asyncHandler(async (req, res, next) => {
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 5;
//   const skip = (page - 1) * limit;
//   const brands = await reviewModel.find({}).skip(skip).limit(limit);
//   if (!brands) {
//     return next(new ApiError("brands not found", 404));
//   }
//   res.status(200).json({ results: brands.length, page, data: brands });
// });

exports.getReview = getOne(reviewModel)
// exports.getReview = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const review = await reviewModel.findById(id);
//   if (!review) {
//     return next(new ApiError(`this review id not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: review });
// });

exports.createReview = createOne(reviewModel);
// exports.createReview = async (req, res) => {
//   const name = req.body.name;
//   try {
//     const review = await reviewModel.create({ name, slug: slugify(name) });
//     res.status(201).json({ data: review });
//   } catch (err) {
//     res.status(400).send(err);
//     // next(new ApiError(`this category id not found: ${id}`, 404))
//   }
// };

exports.updateReview = updateOne(reviewModel);
// exports.updateReview = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const name = req.body.name;
//   const slug = slugify(name);
//   const review = await reviewModel.findOneAndUpdate(
//     { _id: id },
//     { name, slug },
//     { new: true }
//   );
//   if (!review) {
//     return next(new ApiError(`this category not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: review });
// });

exports.deleteReview = deleteOne(reviewModel);
// exports.deleteReview = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const review = await reviewModel.findByIdAndDelete(id);
//   if (!review) {
//     return next(new ApiError(`this category not found: ${id}`, 404));
//   }
//   res.status(200).send();
// });
