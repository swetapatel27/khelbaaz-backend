const express = require('express')
const router = express.Router()
const {isLoggedIn } = require('./../middlewares/verify');
const transactionController = require("./../controllers/transaction.controller");

//add client transaction
router.post("/add-transaction",isLoggedIn,transactionController.create);
//fetch transaction history  user wise
router.get("/get-transaction-details/:user_id",isLoggedIn,transactionController.getTransactionDetailsByID);

module.exports = router