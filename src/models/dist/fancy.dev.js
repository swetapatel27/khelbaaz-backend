"use strict";

var dbConn = require("./../../config/db");

var axios = require("axios");

require("dotenv").config();

var FancyMaster = function FancyMaster(fancy) {};

FancyMaster.getLiveFancyById = function _callee(event_id) {
  var fancy;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "getOdds?eventId=" + event_id));

        case 3:
          fancy = _context.sent;

          if (fancy.status == 200) {
            if (fancy.data != null) {
              if (fancy.data.success && fancy.data.data.hasOwnProperty("t4")) {
                if (fancy.data.data.t4 != null) {
                  if (fancy.data.data.t4.length > 0) {
                    fancy = fancy.data.data.t4;
                  } else {
                    fancy = [];
                  }
                }
              }
            }
          }

          return _context.abrupt("return", fancy);

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

FancyMaster.getFancyById = function _callee2(event_id) {
  var fancy;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from fancies where event_id = ? order by updated_at desc, game_status", event_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          fancy = _context2.sent;
          return _context2.abrupt("return", fancy);

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

FancyMaster.getTestFancyById = function _callee3(event_id) {
  var fancy, matchingEntries;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from fancies where event_id = ? order by srno, runner_name, updated_at desc, game_status", event_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          fancy = _context3.sent;
          return _context3.abrupt("return", fancy);

        case 10:
          return _context3.abrupt("return", []);

        case 12:
          _context3.next = 17;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

FancyMaster.setFancyActive = function _callee4(runner_name, is_active) {
  var result;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update fancies set is_active = ? where runner_name = ?", [is_active, runner_name], function (err, res) {
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

FancyMaster.setFancySuspend = function _callee5(runner_name, is_suspended, event_id) {
  var result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update fancies set is_suspended = ? where runner_name = ? and event_id = ?", [is_suspended, runner_name, event_id], function (err, res) {
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

FancyMaster.checkOddChange = function _callee6(event_id, runner_name, type, price) {
  var change, fancy_odd, fancy;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          change = false;
          _context6.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from fancies where event_id = ? and runner_name = ?", [event_id, runner_name], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          fancy_odd = _context6.sent;
          fancy = fancy_odd[0];
          _context6.t0 = type;
          _context6.next = _context6.t0 === "Back" ? 9 : _context6.t0 === "Lay" ? 11 : 16;
          break;

        case 9:
          if (price != fancy.back_size) {
            change = true;
          }

          return _context6.abrupt("break", 17);

        case 11:
          console.log("oddd-->", fancy.lay_size);
          console.log("price-->", price);
          console.log("change-->", price != fancy.lay_size);

          if (price != fancy.lay_size) {
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

FancyMaster.getFancyRunnerById = function _callee7(event_id, runner_name) {
  var fancy;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from fancies where event_id = ? and runner_name=?", [event_id, runner_name], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0]);
              }
            });
          }));

        case 3:
          fancy = _context7.sent;
          return _context7.abrupt("return", fancy);

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = FancyMaster;