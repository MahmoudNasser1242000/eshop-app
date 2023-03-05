const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./factoryHandler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const userModel = require("../models/userModel");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${fileName}`);

    req.body.profileImg = fileName;
  }
  // save image

  next();
});

exports.getUsers = getAll(userModel, "");
// exports.getBrands = asyncHandler(async (req, res, next) => {
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 5;
//   const skip = (page - 1) * limit;
//   const brands = await userModel.find({}).skip(skip).limit(limit);
//   if (!brands) {
//     return next(new ApiError("brands not found", 404));
//   }
//   res.status(200).json({ results: brands.length, page, data: brands });
// });

exports.getUser = getOne(userModel);
// exports.getBrand = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const brand = await userModel.findById(id);
//   if (!brand) {
//     return next(new ApiError(`this brand id not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

exports.createUser = createOne(userModel);
// exports.createBrand = async (req, res) => {
//   const name = req.body.name;
//   try {
//     const brand = await userModel.create({ name, slug: slugify(name) });
//     res.status(201).json({ data: brand });
//   } catch (err) {
//     res.status(400).send(err);
//     // next(new ApiError(`this category id not found: ${id}`, 404))
//   }
// };

exports.updateUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const document = await userModel.findOneAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      // slug: slugify(req.body.name),
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`this user not found: ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const document = await userModel.findOneAndUpdate(
    { _id: id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`this user not found: ${id}`, 404));
  }
  res.status(200).json({ data: document });
});
// exports.updateBrand = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const name = req.body.name;
//   const slug = slugify(name);
//   const brand = await userModel.findOneAndUpdate(
//     { _id: id },
//     { name, slug },
//     { new: true }
//   );
//   if (!brand) {
//     return next(new ApiError(`this category not found: ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

exports.deleteUser = deleteOne(userModel);
// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const brand = await userModel.findByIdAndDelete(id);
//   if (!brand) {
//     return next(new ApiError(`this category not found: ${id}`, 404));
//   }
//   res.status(200).send();
// });

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(200).json({ data: user, token });
});

exports.updateLoggedUserDate = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: user });
});

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
  );

  res.status(200).json({ status: "success", message: "success" });
});
