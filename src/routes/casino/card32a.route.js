const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../../middlewares/verify");
const card32aController = require("../../controllers/casino/card32a.controller");

router.get("/get-card32a", isLoggedIn, card32aController.getCard32a);
router.get(
  "/get-card32a-result-history",
  isLoggedIn,
  card32aController.getResultHistory
);

module.exports = router;
