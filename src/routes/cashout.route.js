const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");

const cashoutController = require("../controllers/cashout.controller");

router.patch("/cashout", isLoggedIn, cashoutController.addCashout);
module.exports = router;
