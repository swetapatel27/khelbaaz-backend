"use strict";

var TennisBets = require("../models/tennisbets");

exports.addTennisbets = function _callee(req, res) {
  var tennisbet, main_type, market_name, enable_draw, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          tennisbet = new TennisBets(req.body);
          main_type = req.body.main_type;
          market_name = req.body.market_name;
          enable_draw = req.body.enable_draw;

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
          return regeneratorRuntime.awrap(TennisBets.addTennisBet(tennisbet, main_type, market_name, enable_draw));

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

exports.getTennisBetByEventIdByUserID = function _callee2(req, res) {
  var event_id, user_id, matchbets;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          event_id = req.params.event_id;
          user_id = req.params.user_id;
          _context2.next = 5;
          return regeneratorRuntime.awrap(TennisBets.getTennisBetByEventIdByUserID(event_id, user_id));

        case 5:
          matchbets = _context2.sent;
          res.send(matchbets);
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getTennisBetsByEventId = function _callee3(req, res) {
  var event_id, user_id, matchbets;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          event_id = req.params.event_id;
          user_id = req.params.user_id;
          _context3.next = 5;
          return regeneratorRuntime.awrap(TennisBets.getTennisBetsByEventId(event_id, user_id));

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
}; //get all bets by event id for each admin.


exports.getTennisBetsPlaced = function _callee4(req, res) {
  var creator_id, event_id, betsplaced;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          creator_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context4.next = 5;
          return regeneratorRuntime.awrap(TennisBets.getTennisBetsPlaced(creator_id, event_id));

        case 5:
          betsplaced = _context4.sent;
          res.send(betsplaced);
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
}; //get all open bets for user


exports.getOpenTennisBets = function _callee5(req, res) {
  var status, days, user_id, tennisbets;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          status = req.params.status;
          days = req.params.days;
          user_id = req.params.user_id;
          _context5.next = 6;
          return regeneratorRuntime.awrap(TennisBets.getOpenTennisBets(user_id, status, days));

        case 6:
          tennisbets = _context5.sent;
          res.send(tennisbets);
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; //get all open bets for user in admin


exports.getOpenTennisBetsInAdmin = function _callee6(req, res) {
  var user_id, tennisbets;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          user_id = req.params.user_id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(TennisBets.getOpenTennisBetsInAdmin(user_id));

        case 4:
          tennisbets = _context6.sent;
          res.send(tennisbets);
          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; //summation of exposures for specific event_id and respective admin/agents


exports.getSumExpByTennisEvent = function _callee7(req, res) {
  var admin_id, event_id, sum_exposures;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          admin_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context7.next = 5;
          return regeneratorRuntime.awrap(TennisBets.getSumExpByTennisEvent(admin_id, event_id));

        case 5:
          sum_exposures = _context7.sent;
          res.send(sum_exposures);
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //all eventwise summation of exposures for respective admin/agents but for inplay matches only


exports.getSumExpInPlayTennisEvents = function _callee8(req, res) {
  var admin_id, sum_exposures;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          admin_id = req.params.creator_id;
          _context8.next = 4;
          return regeneratorRuntime.awrap(TennisBets.getSumExpInPlayTennisEvents(admin_id));

        case 4:
          sum_exposures = _context8.sent;
          res.send(sum_exposures);
          _context8.next = 12;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; //get exposure status of users for particular event for agents


exports.getUserExpStatus = function _callee9(req, res) {
  var admin_id, event_id, user_exposures;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          admin_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context9.next = 5;
          return regeneratorRuntime.awrap(TennisBets.getUserExpStatus(admin_id, event_id));

        case 5:
          user_exposures = _context9.sent;
          res.send(user_exposures);
          _context9.next = 13;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
};