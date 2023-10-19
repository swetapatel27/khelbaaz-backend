"use strict";

var Matchbets = require("../models/matchbets");

exports.addMatchbets = function _callee(req, res) {
  var matchbet, main_type, market_name, enable_draw, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          matchbet = new Matchbets(req.body);
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
          return regeneratorRuntime.awrap(Matchbets.addMatchBet(matchbet, main_type, market_name, enable_draw));

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

exports.getMatchBetsByEventId = function _callee2(req, res) {
  var event_id, user_id, matchbets;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          event_id = req.params.event_id;
          user_id = req.params.user_id;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Matchbets.getMatchBetByEventId(event_id, user_id));

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

exports.getMatchBetsByUserID = function _callee3(req, res) {
  var user_id, matchbets_byuserid;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          user_id = req.params.user_id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Matchbets.getMatchBetsByUserID(user_id));

        case 4:
          matchbets_byuserid = _context3.sent;
          res.send(matchbets_byuserid);
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

exports.getMatchBetHistoryByEventId = function _callee4(req, res) {
  var event_id, matchbets_byeventid;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          event_id = req.params.event_id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Matchbets.getMatchBetHistoryByEventId(event_id));

        case 4:
          matchbets_byeventid = _context4.sent;
          res.send(matchbets_byeventid);
          _context4.next = 12;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getMatchBetByEventIdByUserID = function _callee5(req, res) {
  var event_id, user_id, matchbets;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          event_id = req.params.event_id;
          user_id = req.params.user_id;
          _context5.next = 5;
          return regeneratorRuntime.awrap(Matchbets.getMatchBetByEventIdByUserID(event_id, user_id));

        case 5:
          matchbets = _context5.sent;
          res.send(matchbets);
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
};

exports.getMatchBetByFilter = function _callee6(req, res) {
  var user_id, from, to, matchbets;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          user_id = req.params.user_id;
          from = req.params.from;
          to = req.params.to;
          _context6.next = 6;
          return regeneratorRuntime.awrap(Matchbets.getMatchBetByFilter(user_id, from, to));

        case 6:
          matchbets = _context6.sent;
          res.send(matchbets);
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          res.status(500).send("Error getting data");

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getOpenMatchBetsInadmin = function _callee7(req, res) {
  var user_id, matchbets;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          user_id = req.params.user_id;
          _context7.next = 4;
          return regeneratorRuntime.awrap(Matchbets.getOpenMatchBetsInadmin(user_id));

        case 4:
          matchbets = _context7.sent;
          res.send(matchbets);
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

exports.getOpenMatchBets = function _callee8(req, res) {
  var status, days, user_id, matchbets;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          status = req.params.status;
          days = req.params.days;
          user_id = req.params.user_id;
          _context8.next = 6;
          return regeneratorRuntime.awrap(Matchbets.getOpenMatchBets(user_id, status, days));

        case 6:
          matchbets = _context8.sent;
          res.send(matchbets);
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

exports.getBetPlacedMatches = function _callee9(req, res) {
  var betplaced_matches;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(Matchbets.getBetPlacedMatches());

        case 3:
          betplaced_matches = _context9.sent;
          res.send(betplaced_matches);
          _context9.next = 11;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          res.status(500).send("Error getting data");

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //get all bets by event id for each admin.


exports.getMatchBetsPlaced = function _callee10(req, res) {
  var creator_id, event_id, betsplaced;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          creator_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context10.next = 5;
          return regeneratorRuntime.awrap(Matchbets.getMatchBetsPlaced(creator_id, event_id));

        case 5:
          betsplaced = _context10.sent;
          res.send(betsplaced);
          _context10.next = 13;
          break;

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //get all latest for each user bets by event id for each admin.


exports.getLatestMatchBet = function _callee11(req, res) {
  var creator_id, event_id, latestbetsplaced;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          creator_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context11.next = 5;
          return regeneratorRuntime.awrap(Matchbets.getLatestMatchBet(creator_id, event_id));

        case 5:
          latestbetsplaced = _context11.sent;
          res.send(latestbetsplaced);
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

exports.getAdminExp = function _callee12(req, res) {
  var admin_id, event_id, exposures;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          admin_id = req.params.admin_id;
          event_id = req.params.event_id;
          _context12.next = 5;
          return regeneratorRuntime.awrap(Matchbets.getAdminExp(admin_id, event_id));

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
}; //summation of exposures for specific event_id and respective admin/agents


exports.getSumExpByEvent = function _callee13(req, res) {
  var admin_id, event_id, sum_exposures;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          admin_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context13.next = 5;
          return regeneratorRuntime.awrap(Matchbets.getSumExpByEvent(admin_id, event_id));

        case 5:
          sum_exposures = _context13.sent;
          res.send(sum_exposures);
          _context13.next = 13;
          break;

        case 9:
          _context13.prev = 9;
          _context13.t0 = _context13["catch"](0);
          console.log(_context13.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //all eventwise summation of exposures for respective admin/agents but for inplay matches only


exports.getSumExpInPlayEvents = function _callee14(req, res) {
  var admin_id, sum_exposures;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          admin_id = req.params.creator_id;
          _context14.next = 4;
          return regeneratorRuntime.awrap(Matchbets.getSumExpInPlayEvents(admin_id));

        case 4:
          sum_exposures = _context14.sent;
          res.send(sum_exposures);
          _context14.next = 12;
          break;

        case 8:
          _context14.prev = 8;
          _context14.t0 = _context14["catch"](0);
          console.log(_context14.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; //get exposure status of users for particular event for agents


exports.getUserExpStatus = function _callee15(req, res) {
  var admin_id, event_id, user_exposures;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          admin_id = req.params.creator_id;
          event_id = req.params.event_id;
          _context15.next = 5;
          return regeneratorRuntime.awrap(Matchbets.getUserExpStatus(admin_id, event_id));

        case 5:
          user_exposures = _context15.sent;
          res.send(user_exposures);
          _context15.next = 13;
          break;

        case 9:
          _context15.prev = 9;
          _context15.t0 = _context15["catch"](0);
          console.log(_context15.t0);
          res.status(500).send("Error getting data");

        case 13:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //get all matchbets by event id


exports.getAllBetsByEventId = function _callee16(req, res) {
  var event_id, match_bets;
  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          event_id = req.params.event_id;
          _context16.next = 4;
          return regeneratorRuntime.awrap(Matchbets.getAllBetsByEventId(event_id));

        case 4:
          match_bets = _context16.sent;
          res.send(match_bets);
          _context16.next = 12;
          break;

        case 8:
          _context16.prev = 8;
          _context16.t0 = _context16["catch"](0);
          console.log(_context16.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; //delete specific matchbets


exports.deleteMatchbets = function _callee17(req, res) {
  var itemIds, deleted_bets;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          itemIds = req.query.ids.split(",");
          _context17.next = 4;
          return regeneratorRuntime.awrap(Matchbets.deleteMatchbets(itemIds));

        case 4:
          deleted_bets = _context17.sent;
          res.send(deleted_bets);
          _context17.next = 12;
          break;

        case 8:
          _context17.prev = 8;
          _context17.t0 = _context17["catch"](0);
          console.log(_context17.t0);
          res.status(500).send("Error getting data");

        case 12:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.testBet = function _callee18(req, res) {
  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          console.log("in matchbet controller");

        case 1:
        case "end":
          return _context18.stop();
      }
    }
  });
};