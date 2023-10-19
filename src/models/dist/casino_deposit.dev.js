"use strict";

var dbConn = require("./../../config/db");

var Exposure = require("./exposure");

require("dotenv").config();

var CasinoTxnMaster = function CasinoTxnMaster(deposit) {
  this.txn_id = deposit.txn_id;
  this.user_id = deposit.user_id;
  this.amount = deposit.amount;
  this.casino_amount = deposit.casino_amount;
  this.type = deposit.type;
};

CasinoTxnMaster.saveDeposit = function _callee(deposit_data) {
  var user_id, amount, casino_points, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user_id = deposit_data.user_id, amount = deposit_data.amount, casino_points = deposit_data.casino_points;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO casino_txn set ?", [deposit_data], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          result = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(this.saveDepositLadger(user_id, amount, casino_points));

        case 7:
          return _context.abrupt("return", result);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, this, [[1, 10]]);
};

CasinoTxnMaster.saveDepositLadger = function _callee2(user_id, amount, casino_points) {
  var ledger_data, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          ledger_data = {
            user_id: user_id,
            event_id: null,
            event_name: "Deposit ".concat(casino_points, "p to casino wallet"),
            type: "fund",
            subtype: "widthdraw",
            runner_name: "widthdraw",
            profit_loss: -Math.abs(amount)
          };
          _context2.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO ledger set ?", [ledger_data], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          result = _context2.sent;
          return _context2.abrupt("return", result);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

CasinoTxnMaster.getCasinoDepositRequests = function _callee3(user_id) {
  var result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from casino_txn where user_id = ? ORDER BY id DESC", user_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          result = _context3.sent;
          return _context3.abrupt("return", result);

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

module.exports = CasinoTxnMaster;