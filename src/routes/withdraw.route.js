const express = require("express");
const {
  validateWithdroValidateRules,
} = require("./../middlewares/validation");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const withdrawController = require("./../controllers/withdraw.controller");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    console.log("body-->", req.body);
    callBack(null, "./public/withdraws/");
  },
  filename: (req, file, callBack) => {
    const { username } = req.body;
    callBack(
      null,
        file.fieldname +
        "Proof_" +
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
  "/add-withdraw-request",
  isLoggedIn,
  validateWithdroValidateRules(),
  withdrawController.addWithdrawRequest
);

//show requests in users
router.get(
  "/get-user-withdraw-request/:user_id",
  isLoggedIn,
  withdrawController.getUserWithdrawRequest
);

//show requests in admin
router.get(
  "/get-admin-withdraw-request/:admin_id/:status?/:days?",
  isLoggedIn,
  withdrawController.getAdminWithdrawRequest
);

//update status of requests from admin
router.patch(
  "/update-withdraw-request",
  isLoggedIn,
  withdrawController.updateStatusWithdrawRequest
);

router.post(
  "/add-withdraw-proofs",
  isLoggedIn,
  upload.array("files", 10),
  withdrawController.addWithdrawProofs
);

router.get(
  "/get-withdraw-proofs/:withdraw_id",
  isLoggedIn,
  withdrawController.getWithdrawProofs
);

module.exports = router;
