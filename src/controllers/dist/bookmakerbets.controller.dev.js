"use strict";

var BookmakerBets = require("../models/bookmakerbets");

exports.getOpenMatchBets = function _callee(req, res) {
  var status, days, user_id, matchbets;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          status = req.params.status;
          days = req.params.days;
          user_id = req.params.user_id;
          _context.next = 6;
          return regeneratorRuntime.awrap(BookmakerBets.getOpenMatchBets(user_id, status, days));

        case 6:
          matchbets = _context.sent;
          res.send(matchbets);
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
};

exports.addBookmakerbet = function _callee2(req, res) {
  var matchbet, main_type, market_name, enable_draw, data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          matchbet = new BookmakerBets(req.body);
          main_type = req.body.main_type;
          market_name = req.body.market_name;
          enable_draw = req.body.enable_draw;

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context2.next = 9;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context2.next = 13;
          break;

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(BookmakerBets.addBookMakerBet(matchbet, main_type, market_name, enable_draw));

        case 11:
          data = _context2.sent;
          res.status(200).send({
            message: data
          });

        case 13:
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send("Error getting data");

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.getAllMatchBetsByEventId = function _callee3(req, res) {
  var event_id, user_id, matchbets;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          event_id = req.params.event_id;
          user_id = req.params.user_id;
          _context3.next = 5;
          return regeneratorRuntime.awrap(BookmakerBets.getAllMatchBetsByEventId(event_id, user_id));

        case 5:
          matchbets = _context3.sent;
          res.send(matchbets);
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
};

exports.getBookBetByEventIdByUserID = function _callee4(req, res) {
  var event_id, user_id, bookmakerbets;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          event_id = req.params.event_id;
          user_id = req.params.user_id;
          _context4.next = 5;
          return regeneratorRuntime.awrap(BookmakerBets.getBookBetByEventIdByUserID(event_id, user_id));

        case 5:
          bookmakerbets = _context4.sent;
          res.send(bookmakerbets);
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //get all bets by event id for each admin.


exports.getBookmakerBetsPlaced = function _callee5(req, res) {
  var creator_id, event_id, betsplaced;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          creator_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context5.next = 5;
          return regeneratorRuntime.awrap(BookmakerBets.getBookmakerBetsPlaced(creator_id, event_id));

        case 5:
          betsplaced = _context5.sent;
          res.send(betsplaced);
          _context5.next = 13;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //summation of exposures for specific event_id and respective admin/agents


exports.getBookmakerSumExpByEvent = function _callee6(req, res) {
  var admin_id, event_id, sum_exposures;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          admin_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context6.next = 5;
          return regeneratorRuntime.awrap(BookmakerBets.getBookmakerSumExpByEvent(admin_id, event_id));

        case 5:
          sum_exposures = _context6.sent;
          res.send(sum_exposures);
          _context6.next = 13;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //get all open bets for user in admin


exports.getOpenBookmakerBetsInAdmin = function _callee7(req, res) {
  var user_id, bookmakerbets;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          user_id = req.params.user_id;
          _context7.next = 4;
          return regeneratorRuntime.awrap(BookmakerBets.getOpenBookmakerBetsInAdmin(user_id));

        case 4:
          bookmakerbets = _context7.sent;
          res.send(bookmakerbets);
          _context7.next = 12;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
};