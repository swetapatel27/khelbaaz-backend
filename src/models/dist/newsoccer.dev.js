"use strict";

var dbConn = require("./../../config/db");

var moment = require("moment");

var axios = require("axios");

require("dotenv").config();

var NewSoccerMaster = function NewSoccerMaster(market) {
  this.event_id = market.event_id;
};

NewSoccerMaster.saveMarkets = function _callee2() {
  var res, result2, response, result, promises;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(axios.get(process.env.BOOK2_API_URL + "socker"));

        case 2:
          res = _context2.sent;
          result2 = {};
          response = res.data;

          if (!response.success) {
            _context2.next = 12;
            break;
          }

          if (!(response.data.t1.length > 0)) {
            _context2.next = 11;
            break;
          }

          // return response.data.t1;
          // const result = response.data.t1.filter(function (market) {
          //   return market.m == "1";
          // });
          result = response.data.t1; // return result;
          // Use Promise.all to handle multiple async calls concurrently

          promises = result.map(function _callee(market) {
            var m1, eventData, ed;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    //console.log(market);
                    m1 = null;
                    _context.next = 3;
                    return regeneratorRuntime.awrap(saveTomarket(market));

                  case 3:
                    m1 = _context.sent;
                    _context.next = 6;
                    return regeneratorRuntime.awrap(geteventsData(market.gmid));

                  case 6:
                    eventData = _context.sent;
                    _context.next = 9;
                    return regeneratorRuntime.awrap(saveEventData(eventData));

                  case 9:
                    ed = _context.sent;
                    result2[market.gmid] = ed;

                  case 11:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }); // Wait for all promises to resolve

          _context2.next = 11;
          return regeneratorRuntime.awrap(Promise.all(promises));

        case 11:
          return _context2.abrupt("return", result2);

        case 12:
          return _context2.abrupt("return", {
            'status': "something went wrong"
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var geteventsData = function geteventsData(event_id) {
  var res, response, data;
  return regeneratorRuntime.async(function geteventsData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(axios.get(process.env.BOOK2_API_URL + "getOdds?eventId=" + event_id));

        case 3:
          res = _context3.sent;
          response = res.data;

          if (!(response.status == 200)) {
            _context3.next = 14;
            break;
          }

          data = response.data;

          if (!(data && Array.isArray(data) && data.length > 0)) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", data);

        case 11:
          return _context3.abrupt("return", null);

        case 12:
          _context3.next = 15;
          break;

        case 14:
          throw new Error("API request was not successful for event_id: " + event_id);

        case 15:
          _context3.next = 21;
          break;

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](0);
          console.error("Error in geteventsData:", _context3.t0);
          throw _context3.t0;

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

var saveEventData = function saveEventData(data) {
  var market, result;
  return regeneratorRuntime.async(function saveEventData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          market = data[0];

          if (!(market === null || typeof market === 'undefined')) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", true);

        case 3:
          _context4.prev = 3;
          _context4.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var runner = getRunners(market.ename); // return resolve(runner);

            var section = filterSections(market.section); // status - ACTIVE/SUSPENDED/OPEN
            // return resolve(section);

            var r1back = extractOdds(section[0].odds, 'back');
            var r1lay = extractOdds(section[0].odds, 'lay');
            var r2back = extractOdds(section[1].odds, 'back');
            var r2lay = extractOdds(section[1].odds, 'lay');
            var r3back = extractOdds(section[2].odds, 'back');
            var r3lay = extractOdds(section[2].odds, 'lay');
            var data = [market.gmid, market.mid, runner[0], runner[1], runner[2], market.status.toUpperCase(), market.iplay ? 1 : 0, r1back.price, r1back.size, r1lay.price, r1lay.size, r2back.price, r2back.size, r2lay.price, r2lay.size, r3back.price, r3back.size, r3lay.price, r3lay.size, market.gmid, market.mid, runner[0], runner[1], runner[2], market.status.toUpperCase(), market.iplay ? 1 : 0, r1back.price, r1back.size, r1lay.price, r1lay.size, r2back.price, r2back.size, r2lay.price, r2lay.size, r3back.price, r3back.size, r3lay.price, r3lay.size];
            dbConn.query("insert into soccerodds(event_id,market_id,runner1,runner2,runner3,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,runner3=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?", data, function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve(data);
              }
            });
          }));

        case 6:
          result = _context4.sent;
          return _context4.abrupt("return", result);

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](3);
          console.log(_context4.t0);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 10]]);
};

var saveTomarket = function saveTomarket(market) {
  var result;
  return regeneratorRuntime.async(function saveTomarket$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var runner = getRunners(market.ename);
            var data = [market.gmid, market.ename, market.mid, market.mname, moment(market.stime).format("YYYY-MM-DD HH:mm:ss"), runner[0], runner[1], runner[2], market.gmid, market.ename, market.mid, market.mname, moment(market.stime).format("YYYY-MM-DD HH:mm:ss"), runner[0], runner[1], runner[2]]; //dbConn.query("REPLACE INTO soccermarkets(event_id,event_name,market_id,market_name,start_time,runner1,runner2,runner3) values(?,?,?,?,?,?,?,?)",

            dbConn.query("INSERT INTO soccermarkets(event_id,event_name,market_id,market_name,start_time,runner1,runner2,runner3) values(?,?,?,?,?,?,?,?) on duplicate key update event_id=?,event_name=?,market_id=?,market_name=?,start_time=?,runner1=?,runner2=?,runner3=?", data, function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve(data);
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

function filterSections(sectionArray) {
  sectionArray.sort(function (a, b) {
    if (a.nat === "The Draw") return 1;
    if (b.nat === "The Draw") return -1;
    return a.nat.localeCompare(b.nat);
  }); // sectionArray.sort((a, b) => a.sno - b.sno)

  return sectionArray;
}

function getRunners_old(text) {
  var res = text.split("-");
  var ename = res.map(function (s) {
    return s.trim();
  });

  if (ename[1] == null) {
    var res1 = text.split(" v ");
    ename = res1.map(function (s) {
      return s.trim();
    });
  }

  return [ename[0], ename[1], "The Draw"];
}

function getRunners(text) {
  var words = text.split(' ');
  var teamNames = [];

  for (var i = 0; i < words.length; i++) {
    var currentWord = words[i].trim();

    if (currentWord && currentWord !== '-' && currentWord.toLowerCase() !== 'v') {
      var teamName = currentWord;

      for (var j = i + 1; j < words.length; j++) {
        var nextWord = words[j].trim();

        if (nextWord && nextWord !== '-' && nextWord.toLowerCase() !== 'v') {
          teamName += ' ' + nextWord;
          i = j;
        } else {
          break;
        }
      }

      teamNames.push(teamName);
    }
  }

  teamNames.push("The Draw");
  return teamNames;
}

function extractOdds(oddsArray, otype) {
  var price;
  var size;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = oddsArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var odds = _step.value;

      if (odds.otype === otype) {
        price = odds.odds;
        size = odds.size;
        break; // Stop when the first match is found
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    price: price,
    size: size
  };
}

module.exports = NewSoccerMaster;