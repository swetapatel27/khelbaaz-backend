"use strict";

var Sessionbets = require("../models/sessionbets");

exports.addSessionbets = function _callee(req, res) {
  var sessionbet, main_type, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          sessionbet = new Sessionbets(req.body);
          main_type = req.body.main_type;

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context.next = 7;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context.next = 11;
          break;

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(Sessionbets.addSessionBet(sessionbet, main_type));

        case 9:
          data = _context.sent;
          res.status(200).send({
            message: data
          });

        case 11:
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send("Error getting data");

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.updateSessionBet = function _callee2(req, res) {
  var sessionbet, data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          sessionbet = new Sessionbets(req.body);
          sessionbet["exp_amount"] = req.body.exp_amount;
          sessionbet["is_switched"] = req.body.is_switched;

          if (!(req.body.constructor === Object && Object.keys(req.body).length === 0)) {
            _context2.next = 8;
            break;
          }

          res.status(400).send({
            error: true,
            message: "Please provide all required field"
          });
          _context2.next = 12;
          break;

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(Sessionbets.updateSessionBet(sessionbet));

        case 10:
          data = _context2.sent;
          res.status(200).send({
            message: data
          });

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

exports.getSessionBetsByEventId = function _callee3(req, res) {
  var event_id, user_id, sessionbets;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          event_id = req.params.event_id;
          user_id = req.params.user_id;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Sessionbets.getSessionBetByEventId(event_id, user_id));

        case 5:
          sessionbets = _context3.sent;
          res.send(sessionbets);
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

exports.getSessionBetsByRunner = function _callee4(req, res) {
  var runner_name, user_id, sessionbets_runnername;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          runner_name = req.body.runner_name;
          user_id = req.body.user_id;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Sessionbets.getSessionBetsByRunner(user_id, runner_name));

        case 5:
          sessionbets_runnername = _context4.sent;
          res.send(sessionbets_runnername);
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
};

exports.getBetHistoryByEventId = function _callee5(req, res) {
  var event_id, sessionbets_histories;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          event_id = req.params.event_id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Sessionbets.betHistoryByEventId(event_id));

        case 4:
          sessionbets_histories = _context5.sent;
          res.send(sessionbets_histories);
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getSessionBetsByUserID = function _callee6(req, res) {
  var user_id, sessionbets_byuserid;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          user_id = req.params.user_id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Sessionbets.getSessionBetsByUserID(user_id));

        case 4:
          sessionbets_byuserid = _context6.sent;
          res.send(sessionbets_byuserid);
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
};

exports.getBetHistoryByRunner = function _callee7(req, res) {
  var runner_name, event_id, sessionbets_byrunner;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          runner_name = req.params.runner_name;
          event_id = req.params.event_id;
          _context7.next = 5;
          return regeneratorRuntime.awrap(Sessionbets.getBetHistoryByRunner(runner_name, event_id));

        case 5:
          sessionbets_byrunner = _context7.sent;
          res.send(sessionbets_byrunner);
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
};

exports.getSessionBetByDateFilter = function _callee8(req, res) {
  var user_id, from, to, sessionbets;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          user_id = req.params.user_id;
          from = req.params.from;
          to = req.params.to;
          _context8.next = 6;
          return regeneratorRuntime.awrap(Sessionbets.getSessionBetsByDateFilter(user_id, from, to));

        case 6:
          sessionbets = _context8.sent;
          res.send(sessionbets);
          _context8.next = 14;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getOpenSessionBetsInAdmin = function _callee9(req, res) {
  var status, user_id, sessionbets;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          status = req.params.status;
          user_id = req.params.user_id;
          _context9.next = 5;
          return regeneratorRuntime.awrap(Sessionbets.getOpenSessionBetsInAdmin(user_id, status));

        case 5:
          sessionbets = _context9.sent;
          res.send(sessionbets);
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

exports.getOpenSessionBets = function _callee10(req, res) {
  var status, days, user_id, sessionbets;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          status = req.params.status;
          days = req.params.days;
          user_id = req.params.user_id;
          _context10.next = 6;
          return regeneratorRuntime.awrap(Sessionbets.getOpenSessionBets(user_id, status, days));

        case 6:
          sessionbets = _context10.sent;
          res.send(sessionbets);
          _context10.next = 14;
          break;

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; //get all bets by event id for each admin.


exports.getSessionBetsPlaced = function _callee11(req, res) {
  var creator_id, event_id, betsplaced;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          creator_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context11.next = 5;
          return regeneratorRuntime.awrap(Sessionbets.getSessionBetsPlaced(creator_id, event_id));

        case 5:
          betsplaced = _context11.sent;
          res.send(betsplaced);
          _context11.next = 13;
          break;

        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getSessionAdminExp = function _callee12(req, res) {
  var admin_id, event_id, exposures;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          admin_id = req.params.admin_id;
          event_id = req.params.event_id;
          _context12.next = 5;
          return regeneratorRuntime.awrap(Sessionbets.getSessionAdminExp(admin_id, event_id));

        case 5:
          exposures = _context12.sent;
          res.send(exposures);
          _context12.next = 13;
          break;

        case 9:
          _context12.prev = 9;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getSessionByRunnerEvent = function _callee13(req, res) {
  var user_id, event_id, runner_name, exposures;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          user_id = req.params.user_id;
          event_id = req.params.event_id;
          runner_name = req.params.runner_name;
          _context13.next = 6;
          return regeneratorRuntime.awrap(Sessionbets.getSessionByRunnerEvent(user_id, event_id, runner_name));

        case 6:
          exposures = _context13.sent;
          res.send(exposures);
          _context13.next = 14;
          break;

        case 10:
          _context13.prev = 10;
          _context13.t0 = _context13["catch"](0);
          console.log(_context13.t0);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.addAndDeleteSessionBets = function _callee14(req, res) {
  var event_id, runner_name, exposures;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          event_id = req.params.event_id;
          runner_name = req.params.runner_name;
          console.log("sas", req.params);
          _context14.next = 6;
          return regeneratorRuntime.awrap(Sessionbets.addAndDeleteSessionBets(event_id, runner_name));

        case 6:
          exposures = _context14.sent;
          res.send(exposures);
          _context14.next = 14;
          break;

        case 10:
          _context14.prev = 10;
          _context14.t0 = _context14["catch"](0);
          console.log(_context14.t0);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.deleteSessionbets = function _callee15(req, res) {
  var itemIds, deleted_bets;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          itemIds = req.query.ids.split(",");
          _context15.next = 4;
          return regeneratorRuntime.awrap(Sessionbets.deleteSessionbets(itemIds));

        case 4:
          deleted_bets = _context15.sent;
          res.send(deleted_bets);
          _context15.next = 12;
          break;

        case 8:
          _context15.prev = 8;
          _context15.t0 = _context15["catch"](0);
          console.log(_context15.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 8]]);
};