"use strict";

var User = require('../models/user');

var Bonus = require('../models/bonus');

var Ledger = require('../models/bonus_ledger'); // const bonusCron = require('../cron/weeklyBonus');\


exports.bonus = function _callee(username, req, res) {
  var bonus;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Bonus.addBonus(username));

        case 3:
          bonus = _context.sent;
          console.log('bonus', bonus); //return ;
          // const getTotalBonusIssued = await Ledger.bonusLadger(); 

          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send("Error getting data");

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.convertBonus = function _callee2(req, res) {
  var user_id, bonus_amount, bonusCoverted;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user_id = req.body.user_id;
          bonus_amount = req.body.bonus_amount; // console.log("bonus>>>>>>",bonus)

          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Bonus.addBonusToAccount(user_id, bonus_amount));

        case 5:
          bonusCoverted = _context2.sent;
          // await Ledger.bonusDepositLedger(bonusCoverted);
          res.send(bonusCoverted);
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](2);
          console.log(_context2.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

exports.editBonusAmount = function _callee3(req, res) {
  var setRegistrationBonus, setReferralBonus, setBonusConverson, setLossBonusPercent, setDepositBonusPercent, setEnableBonus, editedBonus;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          setRegistrationBonus = req.body.registration_bonus;
          setReferralBonus = req.body.referral_bonus;
          setBonusConverson = req.body.bonus_conversion;
          setLossBonusPercent = req.body.loss_bonus_percent;
          setDepositBonusPercent = req.body.deposit_bonus_percent;
          setEnableBonus = req.body.enable_bonus;
          _context3.prev = 6;
          _context3.next = 9;
          return regeneratorRuntime.awrap(Bonus.editBonusAmount(setRegistrationBonus, setReferralBonus, setBonusConverson, setLossBonusPercent, setDepositBonusPercent, setEnableBonus));

        case 9:
          editedBonus = _context3.sent;
          res.send(editedBonus);
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](6);
          console.log(_context3.t0);
          res.status(500).send("Error While Changing Bonus");

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[6, 13]]);
};

exports.referralBonus = function _callee4(user_id, req, res) {
  var result;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Bonus.getReferralBonus(user_id));

        case 3:
          result = _context4.sent;
          _context4.next = 10;
          break;

        case 6:
          _context4.prev = 6;
          _context4.t0 = _context4["catch"](0);
          console.log(err);
          res.status(500).send("Error Adding Bonus");

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.lossBonus = function _callee5(req, res) {
  var user_id, bonusOnLoss;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          user_id = req.body.user_id;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Bonus.getLossBonus(user_id));

        case 4:
          bonusOnLoss = _context5.sent;
          res.send(bonusOnLoss);
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](1);
          console.log(err);
          res.status(500).send("Error getting Bonus");

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.firstDepositBonus = function _callee6(amount, user_id, req, res) {
  var depositBonus;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Bonus.firstDepositBonus(amount, user_id));

        case 3:
          depositBonus = _context6.sent;
          _context6.next = 10;
          break;

        case 6:
          _context6.prev = 6;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          res.status(500).send("Error getting Bonus");

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.getTotalBonus = function _callee7(req, res) {
  var getTotalBonusIssued;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Bonus.getTotalBonusDetails());

        case 3:
          getTotalBonusIssued = _context7.sent;
          res.send(getTotalBonusIssued);
          _context7.next = 11;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          res.status(500).send("Error getting total Bonus");

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // exports.addToLedger = async function (req,res) {
//   const user_id = req.body.user_id;
//   const event_name = req.body.event_name;
//   const subtype = req.body.subtype;
//   const runner_name = req.body.runner_name;
//   const profit_loss = req.body.profit_loss;
//   try {
//     const getTotalBonusIssued = await Ledger.bonusLadger(2,200); 
//     res.send(getTotalBonusIssued);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error getting total Bonus");
//   }
// }