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
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const productModel = require("../models/productModel");

exports.uploadProductImage = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  // image processing for imagecover
  if (req.files.imageCover) {
    const imagecoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imagecoverName}`);

    // save image
    req.body.imageCover = imagecoverName;
  }

  // image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imagesName = `product-${uuidv4()}-${Date.now()}-${
          index + 1
        }.jpeg`;

        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imagesName}`);

        // save image
        req.body.images.push(imagesName);
      })
    );
  }
  next();
});

exports.getProducts = getAll(productModel, "Products");
// exports.getProducts = asyncHandler(async (req, res, next) => {
//   // Build query
//   const modelName = "Products";
//   const documentsCounts = await productModel.countDocuments();
//   const apiFeatures = new ApiFeatures(productModel.find(), req.query)
//     .paginate(documentsCounts)
//     .filter()
//     .search(modelName)
//     .limitFields()
//     .sort();

//   // Execute query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const documents = await mongooseQuery;

//   res
//     .status(200)
//     .json({ results: documents.length, paginationResult, data: documents });
// });

exports.getProduct = getOne(productModel, "reviews");
// exports.getProduct = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const product = await productModel
//     .findById(id)
//     .populate({ path: "mainCategory", select: "name" });
//   if (!product) {
//     return next(new ApiError(`this Product id not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: product });
// });

exports.createProduct = createOne(productModel);
// exports.createProduct = async (req, res) => {
//   // req.body.slug = slugify(req.body.title);
//   try {
//     const product = await productModel.create(req.body);
//     res.status(201).json({ data: product });
//   } catch (err) {
//     res.status(400).send(err);
//     // next(new ApiError(`this Product id not found: ${id}`, 404))
//   }
// };

exports.updateProduct = updateOne(productModel);
// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   // if (req.body.title) {
//   //   req.body.slug = slugify(req.body.title);
//   // }
//   const Product = await productModel.findOneAndUpdate({ _id: id }, req.body, {
//     new: true,
//   });
//   if (!Product) {
//     return next(new ApiError(`this Product not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: Product });
// });

exports.deleteProduct = deleteOne(productModel);
// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const product = await productModel.findByIdAndDelete(id);
//   if (!product) {
//     return next(new ApiError(`this Product not found: ${id}`, 404));
//   }
//   res.status(200).send();
// });
