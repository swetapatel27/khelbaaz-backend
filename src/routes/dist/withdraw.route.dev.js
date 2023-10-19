"use strict";

var express = require("express");

var _require = require("./../middlewares/validation"),
    validateWithdroValidateRules = _require.validateWithdroValidateRules;

var router = express.Router();

var _require2 = require("./../middlewares/verify"),
    isLoggedIn = _require2.isLoggedIn;

var withdrawController = require("./../controllers/withdraw.controller");

var multer = require("multer");

var path = require("path");

var storage = multer.diskStorage({
  destination: function destination(req, file, callBack) {
    console.log("body-->", req.body);
    callBack(null, "./public/withdraws/");
  },
  filename: function filename(req, file, callBack) {
    var username = req.body.username;
    callBack(null, file.fieldname + "Proof_" + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
}); //post request

router.post("/add-withdraw-request", isLoggedIn, validateWithdroValidateRules(), withdrawController.addWithdrawRequest); //show requests in users

router.get("/get-user-withdraw-request/:user_id", isLoggedIn, withdrawController.getUserWithdrawRequest); //show requests in admin

router.get("/get-admin-withdraw-request/:admin_id/:status?/:days?", isLoggedIn, withdrawController.getAdminWithdrawRequest); //update status of requests from admin

router.patch("/update-withdraw-request", isLoggedIn, withdrawController.updateStatusWithdrawRequest);
router.post("/add-withdraw-proofs", isLoggedIn, upload.array("files", 10), withdrawController.addWithdrawProofs);
router.get("/get-withdraw-proofs/:withdraw_id", isLoggedIn, withdrawController.getWithdrawProofs);
module.exports = router;