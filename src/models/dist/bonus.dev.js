"use strict";

var dbConn = require("../../config/db");

var Ledger = require("./bonus_ledger");

var User = function User(user) {
  this.user_id = user.user_id;
  this.bonus_amount = user.bonus_amount;
  this.username = user.username;
  this.balance = user.balance;
  this.setRegistrationBonus = user.setRegistrationBonus;
  this.setReferralBonus = user.setReferralBonus;
  this.setLossBonus = user.setLossBonus;
  this.setFirtDepositBonus = user.setFirstDepositBonus;
  this.setFirtDepositBonusPercent = user.setFirtDepositBonusPercent;
  this.setLossBonusPercent = user.setLossBonusPercent;
  this.setBonusCoversion = user.setBonusCoversion;
};

User.addBonus = function _callee(username) {
  var bonusAmount, bonus, userid, bonusHistory;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT registration_bonus from adminbonus", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0].registration_bonus);
              }
            });
          }));

        case 3:
          bonusAmount = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("UPDATE users SET bonus = ? WHERE username=? ", [bonusAmount, username], function (err, user) {
              if (err) {
                reject(err);
              } else {
                resolve(user);
              }
            });
          }));

        case 6:
          bonus = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT id from users where username=?", [username], function (err, res) {
              if (err) {
                reject(err);
              } else {
                console.log('nnk--->', [res, username]);
                resolve(res[0].id);
              }
            });
          }));

        case 9:
          userid = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(Ledger.bonusLadger(userid, bonusAmount, "registation bonus"));

        case 12:
          bonusHistory = _context.sent;
          return _context.abrupt("return", bonus);

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

User.addBonusToAccount = function _callee2(user_id, bonus_amount) {
  var bonusConversion, convertedAmount, user_data, result, bonusHistoryToMain, bonusHistory;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!(bonus_amount < 100)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", {
            error: "Amount must be greater than 100"
          });

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT bonus_conversion FROM adminbonus", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0].bonus_conversion);
              }
            });
          }));

        case 7:
          bonusConversion = _context2.sent;
          convertedAmount = bonus_amount * (bonusConversion / 100); // console.log("convertesAmount>>>>", convertedAmount)
          // let remainingBonus = bonus_amount-covertedAmount;

          _context2.next = 11;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("UPDATE users SET bonus=bonus-? WHERE id=?", [bonus_amount, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0]);
              }
            });
          }));

        case 11:
          user_data = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("UPDATE users SET balance=balance+ ? WHERE id=?", [convertedAmount, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 14:
          result = _context2.sent;
          _context2.next = 17;
          return regeneratorRuntime.awrap(Ledger.bonusLadger(user_id, -convertedAmount, "Bonus claimed"));

        case 17:
          bonusHistoryToMain = _context2.sent;
          _context2.next = 20;
          return regeneratorRuntime.awrap(Ledger.bonusLadger(user_id, convertedAmount, "Bonus claimed"));

        case 20:
          bonusHistory = _context2.sent;
          return _context2.abrupt("return", result);

        case 22:
          _context2.next = 27;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

User.editBonusAmount = function _callee3(setRegistrationBonus, setReferralBonus, setBonusConverson, setLossBonusPercent, setDepositBonusPercent, setEnableBonus) {
  var query;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (reject, resolve) {
            dbConn.query("UPDATE adminbonus SET registration_bonus= ?, referral_bonus=?, bonus_conversion=?, loss_bonus_percent=?, deposit_bonus_percent=?, enable_bonus=? WHERE id=1", [setRegistrationBonus, setReferralBonus, setBonusConverson, setLossBonusPercent, setDepositBonusPercent, setEnableBonus], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          query = _context3.sent;
          return _context3.abrupt("return", query);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

User.getReferralBonus = function _callee4(referer_name) {
  var refBonus, addRefferalBonus, userid, bonusHistory;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT referral_bonus FROM adminbonus", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0].referral_bonus);
              }
            });
          }));

        case 3:
          refBonus = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("UPDATE users SET bonus=bonus+?  WHERE username=?", [refBonus, referer_name], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 6:
          addRefferalBonus = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT id from users where username=?", [referer_name], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0].id);
              }
            });
          }));

        case 9:
          userid = _context4.sent;
          _context4.next = 12;
          return regeneratorRuntime.awrap(Ledger.bonusLadger(userid, refBonus, "referral bonus"));

        case 12:
          bonusHistory = _context4.sent;
          return _context4.abrupt("return", addRefferalBonus);

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

User.firstDepositBonus = function _callee5(amount, user_id) {
  var getDepositPercentage, depositBonusAmount, depositBonus, bonusHistory;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT deposit_bonus_percent FROM adminbonus", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0].deposit_bonus_percent);
              }
            });
          }));

        case 3:
          getDepositPercentage = _context5.sent;
          depositBonusAmount = amount * (getDepositPercentage / 100);
          _context5.next = 7;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("UPDATE users SET bonus=bonus+? WHERE id=?", [depositBonusAmount, user_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 7:
          depositBonus = _context5.sent;
          _context5.next = 10;
          return regeneratorRuntime.awrap(Ledger.bonusLadger(user_id, depositBonusAmount, "first deposit bonus"));

        case 10:
          bonusHistory = _context5.sent;
          return _context5.abrupt("return", depositBonus);

        case 14:
          _context5.prev = 14;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; //total Bonus details for admin for last 24 hours


User.getTotalBonusDetails = function _callee6() {
  var totalBonus, totalBonusClaimed, bonusClaimed;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT SUM(amount) as total_bonus FROM bonus_ledger WHERE event_name = 'bonus credited' AND created_at >= CURRENT_TIMESTAMP - INTERVAL 24 HOUR", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 2:
          totalBonus = _context6.sent;
          _context6.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT SUM(amount) as total_bonus_claimed FROM bonus_ledger WHERE event_name = 'bonus claimed' AND created_at >= CURRENT_TIMESTAMP - INTERVAL 24 HOUR ", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0].total_bonus);
              }
            });
          }));

        case 5:
          totalBonusClaimed = _context6.sent;
          bonusClaimed = Math.abs(totalBonusClaimed[0].total_bonus_claimed);
          return _context6.abrupt("return", {
            totalBonus: totalBonus,
            bonusClaimed: bonusClaimed
          });

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports = User;