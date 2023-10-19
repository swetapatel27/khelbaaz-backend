const express = require('express')
const router = express.Router()
const {isLoggedIn} = require("./../middlewares/verify");
const receiverController = require("./../controllers/receiver.controller");


//get receivers by role
router.get("/get-receivers/:creator_id/:role/:type?",isLoggedIn,receiverController.getReceiversByRole);


module.exports = router;