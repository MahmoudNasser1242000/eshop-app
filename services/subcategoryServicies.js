const subcategoryModle = require("../models/subcategoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./factoryHandler");
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");

exports.uploadSubCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `subCategory-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/subCategories/${fileName}`);

  // save image
  req.body.image = fileName;

  next();
});

// Nested route (Create)
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.mainCategory) req.body.mainCategory = req.params.categoryId;
  next();
};

// Nested route (get)
exports.getFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId)
    filterObject = { mainCategory: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

exports.getSubCategories = getAll(subcategoryModle, "");
// exports.getSubCategories = asyncHandler(async (req, res, next) => {
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 5;
//   const skip = (page - 1) * limit;

//   let filterCategory = {};
//   if (req.params.categoryId)
//     filterCategory = { mainCategory: req.params.categoryId };

//   const subCategories = await subcategoryModle
//     .find(filterCategory)
//     .skip(skip)
//     .limit(limit)
//     .populate("mainCategory"); //.populate({path: "mainCategory", select: "name -_id"});
//   if (!subCategories) {
//     return next(new ApiError("subcategories not found", 404));
//   }
//   res
//     .status(200)
//     .json({ results: subCategories.length, page, data: subCategories });
// });

exports.getSubCategory = getOne(subcategoryModle);
// exports.getSubCategory = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const subCategory = await subcategoryModle.findById(id);
//   if (!subCategory) {
//     return next(new ApiError(`this subcategory id not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: subCategory });
// });

// exports.filterCreateSubCategory = (req, res, next) => {
//   if (req.params.categoryId) {
//     req.body.mainCategory = req.params.categoryId;
//   }
//   next();
// };

exports.createSubCategory = createOne(subcategoryModle);
// exports.createSubCategory = async (req, res) => {
//   const { name, mainCategory } = req.body;
//   try {
//     const subCategory = await subcategoryModle.create({
//       name,
//       slug: slugify(name),
//       mainCategory,
//     });
//     res.status(201).json({ data: subCategory });
//   } catch (err) {
//     res.status(400).send(err);
//   }
// };

exports.updateSubCategory = updateOne(subcategoryModle);
// exports.updateSubCategory = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const { name, mainCategory } = req.body;
//   const slug = slugify(name);
//   const subCategory = await subcategoryModle.findOneAndUpdate(
//     { _id: id },
//     { name, slug, mainCategory },
//     { new: true }
//   );
//   if (!subCategory) {
//     return next(new ApiError(`this subcategory not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: subCategory });
// });

exports.deleteSubCategory = deleteOne(subcategoryModle);
// exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const subCategory = await subcategoryModle.findByIdAndDelete(id);
//   if (!subCategory) {
//     return next(new ApiError(`this subcategory not found: ${id}`, 404));
//   }
//   res.status(200).send();
// });
