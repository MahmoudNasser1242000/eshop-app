const {
  addProductToCart,
  getLoggedUserCart,
  clearCart,
  removeSpecificCartItem,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartServicies");
const authService = require("../services/authServicies");

const express = require("express");
const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));
router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

  router.put('/applyCoupon', applyCoupon);

router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);

module.exports = router;
