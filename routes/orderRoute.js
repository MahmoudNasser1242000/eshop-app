const express = require("express");
const {
  createCashOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderServicies");

const authService = require("../services/authServicies");

const router = express.Router();

router.use(authService.protect);

router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  checkoutSession
);

router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);
router.get(
  "/",
  authService.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get(
  "/:id",
  authService.allowedTo("admin", "manager"),
  findSpecificOrder
);

router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);

module.exports = router;
