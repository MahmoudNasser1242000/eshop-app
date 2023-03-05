const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");

const { getOne, getAll } = require("./factoryHandler");
const ApiError = require("../utils/apiError");

const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default paymentMethodType cash
  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await productModel.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await cartModel.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

exports.findAllOrders = getAll(orderModel);

exports.findSpecificOrder = getOne(orderModel);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`There is no such order with id ${req.params.cartId}`, 404)
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  order.save();
  res.status(201).json({ status: "success", data: order });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`There is no such order with id ${req.params.cartId}`, 404)
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  order.save();
  res.status(201).json({ status: "success", data: order });
});

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: "products",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/order`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: "success", session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await cartModel.findById(cartId);
  const user = await userModel.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await orderModel.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await cartModel.findByIdAndDelete(cartId);
  }
};

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.ENDPOINT_SECRET_KEY
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  //Handle the event
  if (event.type === "checkout.session.completed") {
    //Create order
    createCardOrder(event.data.object);
    console.log(event.data.object);
  }

  res.status(200).json({ received: true });
});
