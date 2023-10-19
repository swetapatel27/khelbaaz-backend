"use strict";

var Withdraw = require("../models/withdraw");

var WithdrawProof = require("../models/withdraw_proof");

exports.getWithdrawProofs = function _callee(req, res) {
  var withdraw_id, proof_requests;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          withdraw_id = req.params.withdraw_id;
          _context.next = 4;
          return regeneratorRuntime.awrap(WithdrawProof.getWithdrawProofs(withdraw_id));

        case 4:
          proof_requests = _context.sent;
          res.status(200).send(proof_requests);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.addWithdrawProofs = function _callee2(req, res) {
  var withdraw_id, fileNames, imageObjects, data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          withdraw_id = req.body.id;

          if (!(!req.files || req.files.length === 0)) {
            _context2.next = 6;
            break;
          }

          console.log("No file upload");
          _context2.next = 12;
          break;

        case 6:
          fileNames = req.files.map(function (file) {
            return "/" + file.filename;
          });
          imageObjects = fileNames.map(function (fileName) {
            return new WithdrawProof({
              withdraw_id: withdraw_id,
              image: fileName
            });
          }); // return res.json(imageObjects);

          _context2.next = 10;
          return regeneratorRuntime.awrap(WithdrawProof.uploadProof(imageObjects));

        case 10:
          data = _context2.sent;
          res.send(data);

        case 12:
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send("Error getting data");

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.addWithdrawRequest = function _callee3(req, res) {
  var is_valid, new_withdraw_request, withdraw_request;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Withdraw.checkLastRequest(req.body.user_id));

        case 3:
          is_valid = _context3.sent;

          if (is_valid) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(200).json({
            'error': 'One request is already pending.'
          }));

        case 6:
          new_withdraw_request = new Withdraw(req.body);

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context3.next = 11;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context3.next = 15;
          break;

        case 11:
          _context3.next = 13;
          return regeneratorRuntime.awrap(Withdraw.addWithdrawRequest(new_withdraw_request));

        case 13:
          withdraw_request = _context3.sent;
          res.status(200).send(withdraw_request);

        case 15:
          _context3.next = 21;
          break;

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

exports.getUserWithdrawRequest = function _callee4(req, res) {
  var user_id, user_requests;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          user_id = req.params.user_id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Withdraw.getUserWithdrawRequests(user_id));

        case 4:
          user_requests = _context4.sent;
          res.status(200).send(user_requests);
          _context4.next = 12;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getAdminWithdrawRequest = function _callee5(req, res) {
  var status, days, admin_id, user_requests;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          status = req.params.status;
          days = req.params.days;
          admin_id = req.params.admin_id;
          _context5.next = 6;
          return regeneratorRuntime.awrap(Withdraw.getAdminWithdrawRequests(admin_id, status, days));

        case 6:
          user_requests = _context5.sent;
          res.status(200).send(user_requests);
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.updateStatusWithdrawRequest = function _callee6(req, res) {
  var status, user_id, req_id, user_requests;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          status = req.body.status;
          user_id = req.body.user_id; // let account_id = req.body.account_id;

          req_id = req.body.req_id;
          _context6.next = 6;
          return regeneratorRuntime.awrap(Withdraw.updateStatusWithdrawRequest(status, user_id, //account_id,
          req_id));

        case 6:
          user_requests = _context6.sent;
          res.status(200).send(user_requests);
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.log(err);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};