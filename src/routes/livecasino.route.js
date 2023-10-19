const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./../middlewares/verify");
const casinoController = require("./../controllers/livecasino.controller");

router.get(
  "/casino/account-activation",
  isLoggedIn,
  casinoController.accountActivation
);

router.get(
  "/casino/vendorlist",
  isLoggedIn,
  casinoController.getvenderlist
);

router.get(
  "/casino/gamelist/:provider",
  isLoggedIn,
  casinoController.getGamelistByprovider
);

router.get(
  "/casino/gameUrl/:gameid",
  isLoggedIn,
  casinoController.getGameUrlByid
);

router.post(
  "/add-casino-deposit-request",
  isLoggedIn,
  casinoController.depositRequest
);
router.get(
  "/get-casino-deposit-request/:user_id",
  isLoggedIn,
  casinoController.getCasinoDepositRequest
);

router.post(
  "/add-casino-withdraw-request",
  isLoggedIn,
  casinoController.withdrawRequest
);
router.get(
  "/get-casino-withdraw-request/:user_id",
  isLoggedIn,
  casinoController.getCasinoWithdrawRequest
);

router.get(
  "/get-casinoledger/:user_id/:days",
  isLoggedIn,
  casinoController.getClientLedgerByDays
);

module.exports = router;
