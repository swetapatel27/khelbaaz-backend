"use strict";

var dbConn = require("./../../config/db");

var axios = require("axios");

require("dotenv").config();

var SessionMaster = function SessionMaster(session) {};

SessionMaster.getLiveSessionById = function _callee(event_id) {
  var session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "getOdds?eventId=" + event_id));

        case 3:
          session = _context.sent;

          if (session.status == 200) {
            if (session.data != null) {
              if (session.data.success && session.data.data.hasOwnProperty("t3")) {
                if (session.data.data.t3 != null) {
                  if (session.data.data.t3.length > 0) {
                    session = session.data.data.t3;
                  } else {
                    session = [];
                  }
                }
              }
            }
          }

          return _context.abrupt("return", session);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

SessionMaster.getSessionById = function _callee2(event_id) {
  var session;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from sessions where event_id = ? order by updated_at desc, game_status", event_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          session = _context2.sent;
          return _context2.abrupt("return", session);

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

SessionMaster.getTestSessionById = function _callee3(event_id) {
  var liveSession, session, matchingEntries;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(SessionMaster.getLiveSessionById(event_id));

        case 3:
          liveSession = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from sessions where event_id = ? order by updated_at desc, game_status", event_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 6:
          session = _context3.sent;

          if (!Array.isArray(liveSession)) {
            _context3.next = 12;
            break;
          }

          matchingEntries = session.filter(function (s) {
            return liveSession.some(function (ls) {
              return ls.nat === s.runner_name;
            });
          });
          return _context3.abrupt("return", matchingEntries);

        case 12:
          console.error("liveSession is not an array or is undefined from getTestSessionById method in sessionmaster");

        case 13:
          _context3.next = 18;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

SessionMaster.setSessionActive = function _callee4(runner_name, is_active) {
  var result;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update sessions set is_active = ? where runner_name = ?", [is_active, runner_name], function (err, res) {
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

SessionMaster.setSessionSuspend = function _callee5(runner_name, is_suspended) {
  var result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update sessions set is_suspended = ? where runner_name = ?", [is_suspended, runner_name], function (err, res) {
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

SessionMaster.checkOddChange = function _callee6(event_id, runner_name, type, price) {
  var change, session_odd, session;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          change = false;
          _context6.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from sessions where event_id = ? and runner_name = ?", [event_id, runner_name], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          session_odd = _context6.sent;
          session = session_odd[0];
          _context6.t0 = type;
          _context6.next = _context6.t0 === "Back" ? 9 : _context6.t0 === "Lay" ? 11 : 16;
          break;

        case 9:
          if (price != session.back_size) {
            change = true;
          }

          return _context6.abrupt("break", 17);

        case 11:
          console.log("oddd-->", session.lay_size);
          console.log("price-->", price);
          console.log("change-->", price != session.lay_size);

          if (price != session.lay_size) {
            change = true;
          }

          return _context6.abrupt("break", 17);

        case 16:
          return _context6.abrupt("break", 17);

        case 17:
          return _context6.abrupt("return", change);

        case 20:
          _context6.prev = 20;
          _context6.t1 = _context6["catch"](0);
          console.log(_context6.t1);

        case 23:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

module.exports = SessionMaster;