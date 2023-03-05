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
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware");
const categoryModle = require("../models/categoryModel");

// 1) DiskStorage engine
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`
//     cb(null, fileName);
//   },
// });

// 2) MemoryStorage engine
// const multerStorage = multer.memoryStorage();
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("Only Images Allowed", 400));
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file.buffer) {
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${fileName}`);

    // save image
    req.body.image = fileName
  }

  next();
});

exports.getCategories = getAll(categoryModle, "");
// exports.getCategories = asyncHandler(async (req, res, next) => {
//   const page = req.query.page *1 || 1;
//   const limit = req.query.limit *1 || 5;
//   const skip = (page-1) * limit
//   const categories = await categoryModle.find({}).skip(skip).limit(limit);
//   if (!categories) {
//     return next(new ApiError("categories not found", 404))
//   }
//   res.status(200).json({results: categories.length, page, data: categories})
// })

exports.getCategory = getOne(categoryModle);
// exports.getCategory = asyncHandler(async (req, res, next) => {
//   const id = req.params.id
//   const category = await categoryModle.findById(id);
//   if (!category) {
//     return next(new ApiError(`this category id not found: ${id}`, 404))
//   }
//   res.status(200).json({data: category})
// })

exports.createCategory = createOne(categoryModle);
// exports.createCategory = async (req, res) => {
//   const name = req.body.name;
//   try {
//     const category = await categoryModle.create({name, slug: slugify(name)})
//     res.status(201).json({data: category})
//   } catch (err) {
//     res.status(400).send(err)
//     // next(new ApiError(`this category id not found: ${id}`, 404))
//   }
// };

exports.updateCategory = updateOne(categoryModle);
// exports.updateCategory = asyncHandler(async (req, res, next) => {
//   const id = req.params.id
//   const name = req.body.name
//   const slug = slugify(name)
//   const category = await categoryModle.findOneAndUpdate({_id: id},{ name, slug},{new: true});
//   if (!category) {
//     return next(new ApiError(`this category not found: ${id}`, 404))
//   }
//   res.status(200).json({data: category})
// })

exports.deleteCategory = deleteOne(categoryModle);
// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const id = req.params.id
//   const category = await categoryModle.findByIdAndDelete(id);
//   if (!category) {
//     return next(new ApiError(`this category not found: ${id}`, 404))
//   }
//   res.status(200).send()
// })
