"use strict";

var dbConn = require("../../config/db");

require("dotenv").config();

var CasinoBetsMaster = function CasinoBetsMaster() {};

CasinoBetsMaster.savedata = function _callee(data) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("INSERT INTO casino_bets SET ?", data, function (err, res) {
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

CasinoBetsMaster.checkFinished = function _callee2(user_id, gameid, roundid) {
  var result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT count(*) as total FROM casino_results WHERE user_id = ? AND gameid = ? AND roundid = ? AND is_finished='1'", [user_id, gameid, roundid], function (err, res) {
              if (err) {
                reject(err);
              } else {
                if (res[0].total > 0) {
                  resolve(false);
                } else {
                  resolve(true);
                }
              }
            });
          }));

        case 3:
          result = _context2.sent;
          return _context2.abrupt("return", result);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

CasinoBetsMaster.calculateProfit = function _callee3(user_id, gameid, roundid) {
  var result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("SELECT SUM(amount) as total FROM casino_bets WHERE user_id = ? AND gameid = ? AND roundid = ?", [user_id, gameid, roundid], function (err, res) {
              if (err) {
                reject(0);
              } else {
                if (res[0].total) {
                  resolve(res[0].total);
                } else {
                  resolve(0);
                }
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

module.exports = CasinoBetsMaster;