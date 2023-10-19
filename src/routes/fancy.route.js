const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/verify");

const fancyController = require("../controllers/fancy.controller");

router.get("/fancy/:event_id", isLoggedIn, fancyController.getSesionById);
router.get(
  "/test-fancy/:event_id",
  isLoggedIn,
  fancyController.getTestFancyById
);
router.patch("/fancy-active", isLoggedIn, fancyController.setFancyActive);
router.patch("/fancy-suspend", isLoggedIn, fancyController.setFancySuspend);
router.get(
  "/check-fancy-change/:event_id/:runner_name/:type/:price",
  fancyController.checkFancyPriceChange
);

module.exports = router;
