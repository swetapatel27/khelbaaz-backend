"use strict";

var express = require("express");

var router = express.Router();

var _require = require("./../middlewares/validation"),
    validateDepositValidateRules = _require.validateDepositValidateRules;

var _require2 = require("./../middlewares/verify"),
    isLoggedIn = _require2.isLoggedIn;

var depositController = require("./../controllers/deposit.controller");

var multer = require("multer");

var path = require("path");

var storage = multer.diskStorage({
  destination: function destination(req, file, callBack) {
    console.log("body-->", req.body);
    callBack(null, "./public/deposits/"); // './public/images/' directory name where save the file
  },
  filename: function filename(req, file, callBack) {
    var username = req.body.username;
    callBack(null, username + "_" + file.fieldname + "Depo_" + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
}); //post request

router.post("/add-deposit-request", isLoggedIn, //validateDepositValidateRules(),
upload.single("file"), depositController.addDepositRequest); //show requests in users

router.get("/get-user-deposit-request/:user_id", isLoggedIn, depositController.getUserDepositRequest); //show requests in admin

router.get("/get-admin-deposit-request/:admin_id/:status?/:days?", isLoggedIn, depositController.getAdminDepositRequest); //update status of requests from admin

router.patch("/update-deposit-request", isLoggedIn, depositController.updateStatusDepositRequest);
module.exports = router;