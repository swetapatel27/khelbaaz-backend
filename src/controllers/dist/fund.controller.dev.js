"use strict";

var User = require("./../models/user");

var Fund = require("./../models/fund"); //update balance


exports.fundTransfer = function (req, res) {
  data = req.body;
  var new_fund = new Fund(req.body); //handles null error

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field"
    });
  } else {
    User.fundTransfer(data, function (err, data) {
      if (err) {
        res.send(err);
      } else {
        Fund.create(new_fund, function (err, data) {
          if (err) {
            res.send(err);
          } else {
            res.json({
              error: false,
              message: "funds added into fundmaster successfully!",
              data: data
            });
          }
        });
      }
    });
  }
}; //get fund details


exports.fundTransferDetails = function _callee(req, res) {
  var user_id, transfer_details;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          user_id = req.params.user_id;
          console.log("called");
          console.log("id", user_id);
          _context.next = 6;
          return regeneratorRuntime.awrap(Fund.findAll(user_id));

        case 6:
          transfer_details = _context.sent;
          res.send(transfer_details);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; //get fund details


exports.fundTransactionDetails = function _callee2(req, res) {
  var user_id, transfer_details;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          user_id = req.params.user_id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Fund.fundTransactionDetails(user_id));

        case 4:
          transfer_details = _context2.sent;
          res.send(transfer_details);
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
}; //get fund agent ledger


exports.agentLedgerToday = function _callee3(req, res) {
  var role_id, user_id, agent_ledger;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          role_id = req.userData.user.role;
          user_id = req.params.user_id;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Fund.agentLedgerToday(user_id, role_id));

        case 5:
          agent_ledger = _context3.sent;
          res.send(agent_ledger);
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //get fund agent ledger with filter


exports.agentLedgerFilter = function _callee4(req, res) {
  var role_id, user_id, from_date, to_date, agent_ledger;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          role_id = req.userData.user.role;
          user_id = req.params.user_id;
          from_date = req.params.from_date;
          to_date = req.params.to_date;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Fund.agentLedgerFilter(user_id, role_id, from_date, to_date));

        case 7:
          agent_ledger = _context4.sent;
          res.send(agent_ledger);
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).send("Error getting data");

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
};