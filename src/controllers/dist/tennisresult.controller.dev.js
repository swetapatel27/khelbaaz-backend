"use strict";

var tennisResult = require("../models/tennisresult");

exports.addTennisResult = function _callee(req, res) {
  var result, manual_session, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("tennis_bet------------->", req.body);
          result = new tennisResult(req.body.session_details);
          manual_session = req.body.manual_session;
          console.log("tennis_result--->", result);

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context.next = 9;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context.next = 13;
          break;

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(tennisResult.addTennisResult(result, manual_session));

        case 11:
          data = _context.sent;
          res.status(200).send({
            message: data
          });

        case 13:
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send("Error getting data");

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.rollBackTennisResult = function _callee2(req, res) {
  var result, data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          result = new tennisResult(req.body);
          console.log("roleback_tennis--->", result);

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context2.next = 7;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context2.next = 11;
          break;

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(tennisResult.rollBackTennisResult(result));

        case 9:
          data = _context2.sent;
          res.status(200).send({
            message: data
          });

        case 11:
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send("Error getting data");

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.getTennisAllBetsPL = function _callee3(req, res) {
  var user_id, all_bets_pl;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          user_id = req.params.user_id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(tennisResult.getTennisAllBetsPL(user_id));

        case 4:
          all_bets_pl = _context3.sent;
          res.status(200).send(all_bets_pl);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};