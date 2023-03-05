const express = require('express');

const authService = require('../services/authServicies');

const {
  addAddress,
  removeAddress,
  getLoggedUserAddress,
} = require('../services/addressServicies');
const {
  addAddressValidator,
  removeAddressValidator,
} = require('../utils/validators/addressValidator');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.route('/').post(addAddressValidator, addAddress).get(getLoggedUserAddress)

router.delete('/:addressId', removeAddressValidator, removeAddress);

module.exports = router;