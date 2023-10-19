"use strict";

var Deposit = require("../models/deposit");

exports.addDepositRequest = function _callee(req, res) {
  var is_valid, is_refvalid, new_deposit_request, fileUrl, deposit_request;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Deposit.checkLastRequest(req.body.user_id));

        case 3:
          is_valid = _context.sent;

          if (is_valid) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            'error': 'One request is already pending.'
          }));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(Deposit.checkRefNo(req.body.user_id, req.body.transaction_id));

        case 8:
          is_refvalid = _context.sent;

          if (is_refvalid) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            'error': "You cann't use same utr twice."
          }));

        case 11:
          new_deposit_request = new Deposit(req.body);
          fileUrl = "/" + req.file.filename;

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context.next = 17;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context.next = 21;
          break;

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(Deposit.addDepositRequest(new_deposit_request, fileUrl));

        case 19:
          deposit_request = _context.sent;
          res.status(200).send(deposit_request);

        case 21:
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send("Error getting data");

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

exports.getUserDepositRequest = function _callee2(req, res) {
  var user_id, user_requests;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          user_id = req.params.user_id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Deposit.getUserDepositRequests(user_id));

        case 4:
          user_requests = _context2.sent;
          res.status(200).send(user_requests);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getAdminDepositRequest = function _callee3(req, res) {
  var status, days, admin_id, user_requests;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          status = req.params.status;
          days = req.params.days;
          admin_id = req.params.admin_id;
          _context3.next = 6;
          return regeneratorRuntime.awrap(Deposit.getAdminDepositRequests(admin_id, status, days));

        case 6:
          user_requests = _context3.sent;
          res.status(200).send(user_requests);
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.updateStatusDepositRequest = function _callee4(req, res) {
  var status, user_id, req_id, user_requests;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          status = req.body.status;
          user_id = req.body.user_id;
          req_id = req.body.req_id;
          _context4.next = 6;
          return regeneratorRuntime.awrap(Deposit.updateStatusDepositRequest(status, user_id, req_id));

        case 6:
          user_requests = _context4.sent;
          res.status(200).send(user_requests);
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};