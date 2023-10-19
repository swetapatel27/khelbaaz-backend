"use strict";

var dbConn = require("./../../config/db");

require("dotenv").config();

var SoccerOddMaster = function SoccerOddMaster() {};

SoccerOddMaster.getSoccerOdds = function _callee() {
  var response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select tod.*,tm.start_time from soccerodds as tod join soccermarkets as tm on tod.event_id=tm.event_id order by tm.start_time ", function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          response = _context.sent;
          return _context.abrupt("return", response);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SoccerOddMaster.getSoccertoddByMarketId = function _callee2(market_id) {
  var market;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select tod.*,tm.start_time from soccerodds as tod join soccermarkets as tm on tod.event_id = tm.event_id WHERE tod.market_id = ?", market_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          market = _context2.sent;
          return _context2.abrupt("return", market);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SoccerOddMaster.getSoccerOddByEvent = function _callee3(event_id) {
  var market;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query( //"SELECT tod.*, te.event_name, te.start_time as open_date FROM `soccerodds` tod join soccermarkets te on tod.event_id = te.event_id where tod.event_id = ?",
            "SELECT tod.* FROM `soccerodds` tod where tod.event_id = ?", event_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          market = _context3.sent;
          return _context3.abrupt("return", market);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SoccerOddMaster.setSoccerOddActive = function _callee4(market_id, is_active, col) {
  var result;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update soccerodds set " + col + " = ? where market_id = ?", [is_active, market_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          result = _context4.sent;
          return _context4.abrupt("return", result);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SoccerOddMaster.setSoccerOddSuspend = function _callee5(market_id, is_suspended, col) {
  var result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update soccerodds set " + col + " = ? where market_id = ?", [is_suspended, market_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          result = _context5.sent;
          return _context5.abrupt("return", result);

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

SoccerOddMaster.checkSoccerOddPriceChange = function _callee6(market_id, runner_name, type, price) {
  var change, market_odd, market;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          change = false;
          _context6.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from soccerodds where market_id = ?", [market_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          market_odd = _context6.sent;
          market = market_odd[0];
          _context6.t0 = runner_name;
          _context6.next = _context6.t0 === market.runner1 ? 9 : _context6.t0 === market.runner2 ? 11 : _context6.t0 === market.runner3 ? 13 : 15;
          break;

        case 9:
          if (type == "Back") {
            if (price != market.back0_price) {
              change = true;
            }
          } else if (type == "Lay") {
            if (price != market.lay0_price) {
              change = true;
            }
          }

          return _context6.abrupt("break", 16);

        case 11:
          if (type == "Back") {
            if (price != market.back1_price) {
              change = true;
            }
          } else if (type == "Lay") {
            if (price != market.lay1_price) {
              change = true;
            }
          }

          return _context6.abrupt("break", 16);

        case 13:
          if (type == "Back") {
            if (price != market.back2_price) {
              change = true;
            }
          } else if (type == "Lay") {
            if (price != market.lay2_price) {
              change = true;
            }
          }

          return _context6.abrupt("break", 16);

        case 15:
          return _context6.abrupt("break", 16);

        case 16:
          return _context6.abrupt("return", change);

        case 19:
          _context6.prev = 19;
          _context6.t1 = _context6["catch"](0);
          console.log(_context6.t1);

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

module.exports = SoccerOddMaster;