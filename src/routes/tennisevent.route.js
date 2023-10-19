const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const tennisEventController = require("../controllers/tennisevent.controller");

// router.get("/event/:event_id",isLoggedIn,eventController.getEventById);
router.get("/all-tennis-events", isLoggedIn, tennisEventController.getAllTennisEvents);


module.exports = router;
