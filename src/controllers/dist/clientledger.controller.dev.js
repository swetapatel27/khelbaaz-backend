"use strict";

var ClientLedger = require("../models/clientledger");

exports.getClientLedgerByDays = function _callee(req, res) {
  var user_id, days, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          user_id = req.params.user_id;
          days = req.params.days;
          _context.next = 5;
          return regeneratorRuntime.awrap(ClientLedger.getClientLedgerByDays(user_id, days));

        case 5:
          data = _context.sent;
          res.send(data);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getUserProfitLose = function _callee2(req, res) {
  var user_id, data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          user_id = req.params.user_id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(ClientLedger.getUserProfitLose(user_id));

        case 4:
          data = _context2.sent;
          res.send(data);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};