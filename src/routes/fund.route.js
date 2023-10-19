const express = require("express");
const router = express.Router();
const {
  userValidationRules,
  logInValidationRules,
  fundTransferValidateRules,
} = require("./../middlewares/validation");

const { isLoggedIn } = require("./../middlewares/verify");
const fundController = require("./../controllers/fund.controller");

//update fundTransfer
router.post(
  "/fundtransfer",
  isLoggedIn,
  fundTransferValidateRules(),
  fundController.fundTransfer
);

//get fund transfer details
router.get(
  "/fund-transfer-details/:user_id",
  isLoggedIn,
  fundController.fundTransferDetails
);

//get fund transder details in credit debit form for client
router.get(
  "/fund-transaction-details/:user_id",
  isLoggedIn,
  fundController.fundTransactionDetails
);

//get agent ledger for arjun for respective agent
router.get(
  "/agent-ledger-today/:user_id",
  isLoggedIn,
  fundController.agentLedgerToday
);

//get agent ledger with filter for arjun for respective agent
router.get(
  "/agent-ledger-filter/:user_id/:from_date/:to_date",
  isLoggedIn,
  fundController.agentLedgerFilter
);
module.exports = router;
