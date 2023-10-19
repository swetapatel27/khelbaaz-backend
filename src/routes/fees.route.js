const express = require("express");
const router = express.Router();
const feesController = require("../controllers/fees.controller");
const { isLoggedIn } = require("../middlewares/verify");

router.post("/add-fees", isLoggedIn, feesController.addFees);
router.get("/get-fees", isLoggedIn, feesController.getFees);
module.exports = router;
