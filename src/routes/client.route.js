const express = require('express')
const router = express.Router()
const {registerValidationRules } = require('./../middlewares/validation');
const clientController = require("./../controllers/client.controller");


//client register
router.post("/register",registerValidationRules(),clientController.register);
router.get("/testt",clientController.testt);


module.exports = router