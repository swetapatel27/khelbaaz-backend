const express = require('express')
const router = express.Router()
const {isLoggedIn } = require('../middlewares/verify');

const scoreController = require("../controllers/score.controller");


router.get("/score/:event_id",isLoggedIn,scoreController.getScoreById);


module.exports = router