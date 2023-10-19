"use strict";

var dbConn = require("../../config/db");

require("dotenv").config();

var CasinoLadgersMaster = function CasinoLadgersMaster() {};

CasinoLadgersMaster.savedata = function _callee(data) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO casino_ledger SET ?", data, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          result = _context.sent;
          return _context.abrupt("return", result);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

CasinoLadgersMaster.getClientLedgerByDays = function _callee2(user_id, days) {
  var qry, ledger;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          qry = "SELECT * FROM `casino_ledger` where user_id = ? and created_at >= CURDATE() - INTERVAL ? DAY ORDER BY created_at desc";
          values = [user_id, days];
          _context2.next = 5;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(qry, values, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 5:
          ledger = _context2.sent;
          return _context2.abrupt("return", ledger);

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = CasinoLadgersMaster;