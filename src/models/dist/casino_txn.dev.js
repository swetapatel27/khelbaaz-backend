"use strict";

var dbConn = require("../../config/db");

var Exposure = require("./exposure");

require("dotenv").config();

var CasinoTxnMaster = function CasinoTxnMaster(request) {
  this.txn_id = request.txn_id;
  this.user_id = request.user_id;
  this.amount = request.amount;
  this.casino_amount = request.casino_amount;
  this.type = request.type;
};

CasinoTxnMaster.saveData = function _callee(request_data) {
  var user_id, amount, casino_points, type, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user_id = request_data.user_id, amount = request_data.amount, casino_points = request_data.casino_points, type = request_data.type;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO casino_txn set ?", [request_data], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          result = _context.sent;
          return _context.abrupt("return", result);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

CasinoTxnMaster.saveFundLadger = function _callee2(user_id, amount, casino_points, type) {
  var ledger_data, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          ledger_data = {};
          ledger_data.user_id = user_id;
          ledger_data.event_id = null;
          ledger_data.type = "fund";

          if (type == 'deposit') {
            ledger_data.event_name = "Deposit ".concat(casino_points, "p to casino wallet");
            ledger_data.subtype = "widthdraw";
            ledger_data.runner_name = "widthdraw";
            ledger_data.profit_loss = -Math.abs(amount);
          } else {
            ledger_data.event_name = "Widthdraw ".concat(casino_points, "p from casino wallet");
            ledger_data.subtype = "deposit";
            ledger_data.runner_name = "deposit";
            ledger_data.profit_loss = amount;
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO ledger set ?", [ledger_data], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 8:
          result = _context2.sent;
          return _context2.abrupt("return", result);

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

CasinoTxnMaster.getCasinoTxnRequests = function _callee3(user_id, type) {
  var result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from casino_txn where user_id = ? AND type = ? ORDER BY id DESC", [user_id, type], function (err, res) {
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