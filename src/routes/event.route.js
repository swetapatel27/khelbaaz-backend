const express = require('express')
const router = express.Router()
const {isLoggedIn } = require('./../middlewares/verify');

const eventController = require("../controllers/event.controller");


router.get("/event/:event_id",isLoggedIn,eventController.getEventById);
router.get("/all-events",isLoggedIn,eventController.getAllEvents);


module.exports = router