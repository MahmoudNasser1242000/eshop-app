const asyncHandler = require("express-async-handler");
const cartModel = require("../models/cartModel");
const couponModel = require("../models/couponModel");
const productModel = require("../models/productModel");
const ApiError = require("../utils/apiError");

const calcTotalPrice = (cart) => {
  const total = cart.cartItems.reduce((current, product) => {
    current += product.quantity * product.price;
    return current;
  }, 0);

  cart.totalCartPrice = total;
  cart.totalPriceAfterDiscount = undefined;

  return total;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  let cart = await cartModel.findOne({ user: req.user._id });

  const { productId, color } = req.body;
  const product = await productModel.findById(productId);

  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [
        { product: productId, color, price: product.price, quantity: 1 },
      ],
    });
    console.log("cart created");
  } else {
    let findProduct = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (findProduct > -1) {
      // let cartProduct = cart.cartItems[findProduct]
      // cartProduct.quantity += 1
      // cart.cartItems[findProduct] = cartProduct
      cart.cartItems[findProduct].quantity += 1;
      console.log("product added again");
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
        quantity: 1,
      });
      console.log("product first time added");
    }
  }

  // Calculate total cart price
  calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );
  }

  // calcTotalPrice(cart);
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  calcTotalPrice(cart);
  cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );
  }

  const cartProduct = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (cartProduct > -1) {
    // let cartItem = cart.cartItems[cartProduct];
    // cartItem.quantity = quantity;
    // cart.cartItems[cartProduct] = cartItem;
    cart.cartItems[cartProduct].quantity = quantity;
  } else {
    return next(
      new ApiError(
        `There is no product for this id : ${req.params.itemId}`,
        404
      )
    );
  }

  calcTotalPrice(cart);
  cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`coupon is invalid or expire`, 404));
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  const discount = (
    cart.totalCartPrice -
    (cart.totalCartPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = discount;
  cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
