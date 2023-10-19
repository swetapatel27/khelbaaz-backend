"use strict";

var dbConn = require("./../../config/db");

var axios = require("axios");

require("dotenv").config();

var MarketoddMaster = function MarketoddMaster(market) {
  this.event_id = market.event_id;
  this.market_id = market.market_id;
  this.market_name = market.market_name;
  this.start_time = market.start_time;
  this.runner1 = market.runner1;
  this.runner2 = market.runner2;
  this.draw = market.draw;
};

MarketoddMaster.getMarketodds = function _callee() {
  var response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select m.*,mo.is_declared from markets as m JOIN marketodds mo ON mo.event_id = m.event_id ", function (err, res) {
              // dbConn.query("select * from markets", (err, res) => {
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
          console.error(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // MarketoddMaster.getMarketodd = async function(market_id){
//     try{
//         const response = await axios.get(process.env.API_URL+'listMarketBookOdds?market_id='+market_id);
//         const res = response.data;
//         return res;
//     }catch(error){
//         console.error(error);
//     }
// }


MarketoddMaster.getMarketodd = function _callee2(event_id) {
  var _market;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query( //"select * from marketodds where event_id = ?",
            "select m.*,mo.start_time from marketodds as m JOIN markets mo ON mo.event_id = m.event_id where m.event_id = ?", event_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          _market = _context2.sent;
          return _context2.abrupt("return", _market);

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
}; //get live match odds


MarketoddMaster.getLiveMarketodd = function _callee3(event_id) {
  var existing_market, market_odds;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from marketodds where event_id = ?", event_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res[0]);
              }
            });
          }));

        case 3:
          existing_market = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "getOdds?eventId=" + event_id));

        case 6:
          market_odds = _context3.sent;

          if (market_odds.status == 200) {
            if (market_odds.data != null) {
              if (market_odds.data.success && market_odds.data.data.hasOwnProperty("t1")) {
                console.log(market_odds.data.data.t1);
              }
            }
          }

          console.log(existing_market);
          return _context3.abrupt("return", market);

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

MarketoddMaster.getMarketOddByEvent = function _callee4(event_id) {
  var _market2;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from marketodds where event_id = ?", event_id, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          _market2 = _context4.sent;
          return _context4.abrupt("return", _market2);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

MarketoddMaster.setMarketOddActive = function _callee5(market_id, is_active, col) {
  var result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update marketodds set " + col + " = ? where market_id = ?", [is_active, market_id], function (err, res) {
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

MarketoddMaster.setMarketOddSuspend = function _callee6(market_id, is_suspended, col) {
  var result;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update marketodds set " + col + " = ? where market_id = ?", [is_suspended, market_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          result = _context6.sent;
          return _context6.abrupt("return", result);

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

MarketoddMaster.addMarketTVLink = function _callee7(event_id, link) {
  var result;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("update marketodds set link = ? where event_id = ?", [link, event_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          result = _context7.sent;
          return _context7.abrupt("return", result);

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

MarketoddMaster.checkMatchOddPriceChange = function _callee8(market_id, runner_name, type, price) {
  var change, market_odd, _market3;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          change = false;
          _context8.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select * from marketodds where market_id = ?", [market_id], function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 4:
          market_odd = _context8.sent;
          _market3 = market_odd[0];
          _context8.t0 = runner_name;
          _context8.next = _context8.t0 === _market3.runner1 ? 9 : _context8.t0 === _market3.runner2 ? 11 : _context8.t0 === "Draw" ? 13 : 15;
          break;

        case 9:
          if (type == "Back") {
            console.log("price-->", price);
            console.log("market price-->", _market3.back0_price);
            console.log("market price change-->", Number(Math.abs(price - _market3.back0_price)).toFixed(2));

            if (Number(Math.abs(price - _market3.back0_price)).toFixed(2) > 0.02) {
              change = true;
            }
          } else if (type == "Lay") {
            console.log("price-->", price);
            console.log("market price-->", _market3.lay0_price);
            console.log("market price change-->", Number(Math.abs(price - _market3.lay0_price)).toFixed(2));

            if (Number(Math.abs(price - _market3.lay0_price)).toFixed(2) > 0.02) {
              change = true;
            }
          }

          return _context8.abrupt("break", 16);

        case 11:
          if (type == "Back") {
            if (Number(Math.abs(price - _market3.back1_price)).toFixed(2) > 0.02) {
              change = true;
            }
          } else if (type == "Lay") {
            if (Number(Math.abs(price - _market3.lay1_price)).toFixed(2) > 0.02) {
              change = true;
            }
          }

          return _context8.abrupt("break", 16);

        case 13:
          if (type == "Back") {
            if (Number(Math.abs(price - _market3.back2_price)).toFixed(2) > 0.02) {
              change = true;
            }
          } else if (type == "Lay") {
            if (Number(Math.abs(price - _market3.lay2_price)).toFixed(2) > 0.02) {
              change = true;
            }
          }

          return _context8.abrupt("break", 16);

        case 15:
          return _context8.abrupt("break", 16);

        case 16:
          return _context8.abrupt("return", change);

        case 19:
          _context8.prev = 19;
          _context8.t1 = _context8["catch"](0);
          console.log(_context8.t1);

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

module.exports = MarketoddMaster;