"use strict";

var express = require("express");

var router = express.Router();

var _require = require("./../middlewares/validation"),
    userValidationRules = _require.userValidationRules,
    updateUserValidationRules = _require.updateUserValidationRules,
    ClientValidationUpdationRules = _require.ClientValidationUpdationRules,
    logInValidationRules = _require.logInValidationRules,
    ClientValidationRules = _require.ClientValidationRules,
    AdminLogInValidationRules = _require.AdminLogInValidationRules,
    fundTransferValidateRules = _require.fundTransferValidateRules;

var userController = require("./../controllers/user.controller");

var _require2 = require("./../middlewares/verify"),
    isLoggedIn = _require2.isLoggedIn;

var fundController = require("./../controllers/fund.controller");

var path = require("path");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function destination(req, file, callBack) {
    console.log("body-->", req.body);
    callBack(null, "./public/payments/");
  },
  filename: function filename(req, file, callBack) {
    callBack(null, file.fieldname + "Pay_" + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
}); //fetch all users

router.get("/self-details", isLoggedIn, userController.selfDetails); //fetch all creators

router.get("/sub-users/:creator_id/:role", isLoggedIn, userController.findAllCreators); //create user

router.post("/user", isLoggedIn, userValidationRules(), userController.create); //only for arjun bettin
//create user for arjun's agent with only three fields

router.post("/create-user", isLoggedIn, ClientValidationRules(), userController.create); //update user

router.patch("/user/:id", isLoggedIn, updateUserValidationRules(), userController.update); //update arjun user

router.patch("/update-user/:id", isLoggedIn, ClientValidationUpdationRules(), userController.update); //user login

router.post("/login", logInValidationRules(), userController.login); //user login

router.post("/admin-login", AdminLogInValidationRules(), userController.login); //get balance

router.get("/get-balance/:user_id", isLoggedIn, userController.getBalanceById); //get userdetails by username

router.get("/get-user-byusername/:username", isLoggedIn, userController.getUserByUsername); //update last activity

router.patch("/update-last-activty", isLoggedIn, userController.updateLastActivity); //get all active users

router.get("/get-active-users/:creator_id", isLoggedIn, userController.getActiveUsers); //get my users

router.get("/get-my-users/:creator_id", isLoggedIn, userController.getMyUsers); //get users added by m2

router.get("/get-users-addedme/:user_id", isLoggedIn, userController.getUsersAddedByMe); //get my agents

router.get("/get-my-agents/:creator_id", isLoggedIn, userController.getMyAgents);
router.patch("/change-exposure-limit", isLoggedIn, userController.changeexposureLimit); //change password

router.patch("/change-password", isLoggedIn, userController.changePassword); //change password only by arjun admin

router.patch("/password-change-byadmin", isLoggedIn, userController.passwordChange); //deduct match fees

router.post("/deduct-fees", isLoggedIn, userController.deductBalance); //active-deactive user from admin

router.patch("/activate-user", isLoggedIn, userController.activateUser); //delete users

router["delete"]("/delete-user/:id", isLoggedIn, userController.deleteUser); //add-update upi of admin

router.post("/add-upi", isLoggedIn, upload.single("file"), userController.addUPI); //get-upi_id of admin

router.get("/get-upi", isLoggedIn, userController.getUPI);
module.exports = router;