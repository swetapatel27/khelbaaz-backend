const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const soccerEventController = require("../controllers/soccerevent.controller");

// router.get("/event/:event_id",isLoggedIn,eventController.getEventById);
router.get("/all-soccer-events", isLoggedIn, soccerEventController.getAllSoccerEvents);


module.exports = router;
