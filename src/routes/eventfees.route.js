const express = require("express");
const router = express.Router();
const eventFeesController = require("../controllers/eventfees.controller");
const { isLoggedIn } = require("../middlewares/verify");

router.post("/add-fees", isLoggedIn, eventFeesController.addEventFees);
router.get(
  "/get-event-fees/:user_id/:event_id",
  isLoggedIn,
  eventFeesController.getEventFees
);
module.exports = router;
