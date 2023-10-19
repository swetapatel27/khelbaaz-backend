"use strict";

var Ladger = require("./ledger");

exports.bonusLadgerToMain = function _callee(user_id, profit, description) {
  var ledger_data, ledger_data2;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          ledger_data = {};
          ledger_data.user_id = user_id;
          ledger_data.profit_loss = profit;
          ledger_data.description = description;
          ledger_data.subtype = profit < 1 ? "withdraw" : "deposit";
          ledger_data2 = {
            user_id: ledger_data.user_id,
            event_name: description == "Bonus claimed" ? "bonus claimed" : "bonus credited",
            type: "Bonus",
            subtype: ledger_data.subtype,
            runner_name: ledger_data.description,
            profit_loss: ledger_data.profit_loss
          };
          console.log("ledgerdata", ledger_data2);
          _context.next = 9;
          return regeneratorRuntime.awrap(Ladger.savedata(ledger_data2));

        case 9:
          return _context.abrupt("return", _context.sent);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.bonusLadger = function _callee2(user_id, profit, description) {
  var ledger_data, ledger_data1;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          ledger_data = {};
          ledger_data.user_id = user_id;
          ledger_data.profit_loss = profit;
          ledger_data.description = description;
          ledger_data.subtype = profit < 1 ? "withdraw" : "deposit";
          ledger_data1 = {
            user_id: ledger_data.user_id,
            event_name: description == "Bonus claimed" ? "bonus claimed" : "bonus credited",
            type: "Bonus",
            subtype: ledger_data.subtype,
            description: ledger_data.description,
            amount: ledger_data.profit_loss
          };
          console.log("ledgerdata", ledger_data1);
          _context2.next = 9;
          return regeneratorRuntime.awrap(Ladger.bonusLedger(ledger_data1));

        case 9:
          return _context2.abrupt("return", _context2.sent);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
};