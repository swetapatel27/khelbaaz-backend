const express = require("express");
const router = express.Router();
const { validateDepositValidateRules } = require("./../middlewares/validation");
const { isLoggedIn } = require("./../middlewares/verify");
const depositController = require("./../controllers/deposit.controller");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    console.log("body-->", req.body);
    callBack(null, "./public/deposits/"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    const { username } = req.body;
    callBack(
      null,
      username +
        "_" +
        file.fieldname +
        "Depo_" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
});

//post request
router.post(
  "/add-deposit-request",
  isLoggedIn,
  //validateDepositValidateRules(),
  upload.single("file"),
  depositController.addDepositRequest
);

//show requests in users
router.get(
  "/get-user-deposit-request/:user_id",
  isLoggedIn,
  depositController.getUserDepositRequest
);

//show requests in admin
router.get(
  "/get-admin-deposit-request/:admin_id/:status?/:days?",
  isLoggedIn,
  depositController.getAdminDepositRequest
);

//update status of requests from admin
router.patch(
  "/update-deposit-request",
  isLoggedIn,
  depositController.updateStatusDepositRequest
);

module.exports = router;
