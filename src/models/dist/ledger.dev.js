"use strict";

var dbConn = require("../../config/db");

require("dotenv").config();

var LadgersMaster = function LadgersMaster() {};

LadgersMaster.savedata = function _callee(data) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO ledger SET ?", data, function (err, res) {
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

LadgersMaster.bonusLedger = function _callee2(data) {
  var result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("data>>>", data);
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO bonus_ledger SET ?", data, function (err, res) {
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
          _context2.t0 = _context2["catch"](1);
          console.log(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

module.exports = LadgersMaster;