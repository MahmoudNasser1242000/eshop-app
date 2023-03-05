const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  changePassword,
  deleteUser,
  uploadUserImage,
  resizeImage,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserDate,
  deleteLoggedUserData,
} = require("../services/userServicies");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidatorError");
const authService = require('../services/authServicies');

const express = require("express");
const router = express.Router();

router.use(authService.protect);

router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/changeMyData', updateLoggedUserDate);
router.put('/deleteMe', deleteLoggedUserData);

router.use(authService.allowedTo('admin', 'manager'));

router.put("/changePassword/:id", changeUserPasswordValidator, changePassword);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
