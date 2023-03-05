const express = require('express');

const authService = require('../services/authServicies');

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require('../services/wishlistServicies');
const {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
} = require('../utils/validators/wishlistValidator');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.route('/').post(addProductToWishlistValidator, addProductToWishlist).get(getLoggedUserWishlist)

router.delete('/:productId', removeProductFromWishlistValidator, removeProductFromWishlist);

module.exports = router;