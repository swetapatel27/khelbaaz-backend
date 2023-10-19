const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../../middlewares/verify");
const lucky7Controller = require("../../controllers/casino/lucky7.controller");

router.get("/get-lucky7", isLoggedIn, lucky7Controller.getLucky7);
router.get(
  "/get-lucky7-result-history",
  isLoggedIn,
  lucky7Controller.getResultHistory
);

module.exports = router;
