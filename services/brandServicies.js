const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./factoryHandler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const brandsModel = require("../models/brandsModel");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${fileName}`);

  // save image
  req.body.image = fileName;

  next();
});

exports.getBrands = getAll(brandsModel, "");
// exports.getBrands = asyncHandler(async (req, res, next) => {
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 5;
//   const skip = (page - 1) * limit;
//   const brands = await brandsModel.find({}).skip(skip).limit(limit);
//   if (!brands) {
//     return next(new ApiError("brands not found", 404));
//   }
//   res.status(200).json({ results: brands.length, page, data: brands });
// });

exports.getBrand = getOne(brandsModel);
// exports.getBrand = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const brand = await brandsModel.findById(id);
//   if (!brand) {
//     return next(new ApiError(`this brand id not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

exports.createBrand = createOne(brandsModel);
// exports.createBrand = async (req, res) => {
//   const name = req.body.name;
//   try {
//     const brand = await brandsModel.create({ name, slug: slugify(name) });
//     res.status(201).json({ data: brand });
//   } catch (err) {
//     res.status(400).send(err);
//     // next(new ApiError(`this category id not found: ${id}`, 404))
//   }
// };

exports.updateBrand = updateOne(brandsModel);
// exports.updateBrand = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const name = req.body.name;
//   const slug = slugify(name);
//   const brand = await brandsModel.findOneAndUpdate(
//     { _id: id },
//     { name, slug },
//     { new: true }
//   );
//   if (!brand) {
//     return next(new ApiError(`this category not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

exports.deleteBrand = deleteOne(brandsModel);
// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const brand = await brandsModel.findByIdAndDelete(id);
//   if (!brand) {
//     return next(new ApiError(`this category not found: ${id}`, 404));
//   }
//   res.status(200).send();
// });
