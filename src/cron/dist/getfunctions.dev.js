"use strict";

var dbConn = require("./../../config/db");

var axios = require("axios");

var moment = require("moment");

require("dotenv").config();

storeCompetitions = function storeCompetitions() {
  var test, response, competitions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

  return regeneratorRuntime.async(function storeCompetitions$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          test = [];
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "fetch_data?Action=listCompetitions&EventTypeID=4"));

        case 4:
          response = _context2.sent;
          competitions = response.data;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 9;

          _loop = function _loop() {
            var competition, _result;

            return regeneratorRuntime.async(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    competition = _step.value;
                    _context.prev = 1;
                    _context.next = 4;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      dbConn.query("REPLACE INTO competitions(competition_id,competition_name) values(?,?)", [competition.competition.id, competition.competition.name], function (err, res) {
                        if (err) {
                          console.log(err);
                          reject(err);
                        } else {
                          var insertedId = res.insertId;
                          resolve(competition.competition.id);
                        }
                      });
                    }));

                  case 4:
                    _result = _context.sent;
                    test.push(_result);
                    _context.next = 12;
                    break;

                  case 8:
                    _context.prev = 8;
                    _context.t0 = _context["catch"](1);
                    console.error(_context.t0);
                    result(_context.t0, null);

                  case 12:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[1, 8]]);
          };

          _iterator = competitions[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 18;
            break;
          }

          _context2.next = 15;
          return regeneratorRuntime.awrap(_loop());

        case 15:
          _iteratorNormalCompletion = true;
          _context2.next = 12;
          break;

        case 18:
          _context2.next = 24;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 24:
          _context2.prev = 24;
          _context2.prev = 25;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 27:
          _context2.prev = 27;

          if (!_didIteratorError) {
            _context2.next = 30;
            break;
          }

          throw _iteratorError;

        case 30:
          return _context2.finish(27);

        case 31:
          return _context2.finish(24);

        case 32:
          return _context2.abrupt("return", test);

        case 35:
          _context2.prev = 35;
          _context2.t1 = _context2["catch"](1);
          console.error(_context2.t1);

        case 38:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 35], [9, 20, 24, 32], [25,, 27, 31]]);
};

storeEvents = function storeEvents(competitions) {
  var eventList, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop2, _iterator2, _step2;

  return regeneratorRuntime.async(function storeEvents$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          eventList = [];
          _context5.prev = 1;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context5.prev = 5;

          _loop2 = function _loop2() {
            var competition, response, events, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _loop3, _iterator3, _step3;

            return regeneratorRuntime.async(function _loop2$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    competition = _step2.value;
                    _context4.next = 3;
                    return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "fetch_data?Action=listEvents&EventTypeID=4&CompetitionID=" + competition));

                  case 3:
                    response = _context4.sent;
                    events = response.data; // console.log("events of comp",events);

                    _iteratorNormalCompletion3 = true;
                    _didIteratorError3 = false;
                    _iteratorError3 = undefined;
                    _context4.prev = 8;

                    _loop3 = function _loop3() {
                      var event, _result2;

                      return regeneratorRuntime.async(function _loop3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              event = _step3.value;
                              _context3.prev = 1;
                              _context3.next = 4;
                              return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                                // console.log("single event",event);
                                var event_date = moment(event.event.openDate).format("YYYY-MM-DD HH:mm:ss");
                                dbConn.query("REPLACE INTO events(competition_id,event_id,event_name,open_date,timezone) values(?,?,?,?,?)", [competition, event.event.id, event.event.name, event_date, event.event.timezone], function (err, res) {
                                  if (err) {
                                    console.log(err);
                                    reject(err);
                                  } else {
                                    var insertedId = res.insertId;
                                    var event_data = {
                                      event_id: event.event.id,
                                      event_name: event.event.name
                                    };
                                    resolve(event_data);
                                  }
                                });
                              }));

                            case 4:
                              _result2 = _context3.sent;
                              eventList.push(_result2);
                              _context3.next = 12;
                              break;

                            case 8:
                              _context3.prev = 8;
                              _context3.t0 = _context3["catch"](1);
                              console.error(_context3.t0);
                              result(_context3.t0, null);

                            case 12:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, null, null, [[1, 8]]);
                    };

                    _iterator3 = events[Symbol.iterator]();

                  case 11:
                    if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                      _context4.next = 17;
                      break;
                    }

                    _context4.next = 14;
                    return regeneratorRuntime.awrap(_loop3());

                  case 14:
                    _iteratorNormalCompletion3 = true;
                    _context4.next = 11;
                    break;

                  case 17:
                    _context4.next = 23;
                    break;

                  case 19:
                    _context4.prev = 19;
                    _context4.t0 = _context4["catch"](8);
                    _didIteratorError3 = true;
                    _iteratorError3 = _context4.t0;

                  case 23:
                    _context4.prev = 23;
                    _context4.prev = 24;

                    if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                      _iterator3["return"]();
                    }

                  case 26:
                    _context4.prev = 26;

                    if (!_didIteratorError3) {
                      _context4.next = 29;
                      break;
                    }

                    throw _iteratorError3;

                  case 29:
                    return _context4.finish(26);

                  case 30:
                    return _context4.finish(23);

                  case 31:
                  case "end":
                    return _context4.stop();
                }
              }
            }, null, null, [[8, 19, 23, 31], [24,, 26, 30]]);
          };

          _iterator2 = competitions[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context5.next = 14;
            break;
          }

          _context5.next = 11;
          return regeneratorRuntime.awrap(_loop2());

        case 11:
          _iteratorNormalCompletion2 = true;
          _context5.next = 8;
          break;

        case 14:
          _context5.next = 20;
          break;

        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](5);
          _didIteratorError2 = true;
          _iteratorError2 = _context5.t0;

        case 20:
          _context5.prev = 20;
          _context5.prev = 21;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 23:
          _context5.prev = 23;

          if (!_didIteratorError2) {
            _context5.next = 26;
            break;
          }

          throw _iteratorError2;

        case 26:
          return _context5.finish(23);

        case 27:
          return _context5.finish(20);

        case 28:
          return _context5.abrupt("return", eventList);

        case 31:
          _context5.prev = 31;
          _context5.t1 = _context5["catch"](1);
          console.error(_context5.t1);

        case 34:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 31], [5, 16, 20, 28], [21,, 23, 27]]);
};

storeMarkets = function storeMarkets(events) {
  var marketList, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _loop4, _iterator4, _step4;

  return regeneratorRuntime.async(function storeMarkets$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          marketList = [];
          dbConn.query("truncate table markets", function (err, res) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log("truncated");
            }
          });
          _context7.prev = 2;
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context7.prev = 6;

          _loop4 = function _loop4() {
            var event, response, market, _result3;

            return regeneratorRuntime.async(function _loop4$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    event = _step4.value;
                    _context6.next = 3;
                    return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "fetch_data?Action=listMarketTypes&EventID=" + event.event_id));

                  case 3:
                    response = _context6.sent;
                    market = response.data;

                    if (!(market[0].marketName.toLowerCase() == "match odds")) {
                      _context6.next = 17;
                      break;
                    }

                    _context6.prev = 6;
                    _context6.next = 9;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var runnerlist = [];

                      for (var i = 0; i < 3; i++) {
                        if (market[0].runners[i]) {
                          runnerlist.push(market[0].runners[i].runnerName);
                        } else {
                          runnerlist.push(null);
                        }
                      }

                      dbConn.query("REPLACE INTO markets(event_id,market_id,event_name,market_name,start_time,runner1,runner2,draw) values(?,?,?,?,?,?,?,?)", [event.event_id, market[0].marketId, event.event_name, market[0].marketName, market[0].marketStartTime === "" ? "0001-01-01 00:00:00" : moment(market[0].marketStartTime).format("YYYY-MM-DD HH:mm:ss"), runnerlist[0], runnerlist[1], runnerlist[2]], function (err, res) {
                        if (err) {
                          console.log(err);
                          reject(err);
                        } else {
                          var insertedId = res.insertId;
                          resolve(market[0].marketId);
                        }
                      });
                    }));

                  case 9:
                    _result3 = _context6.sent;
                    marketList.push(_result3);
                    _context6.next = 17;
                    break;

                  case 13:
                    _context6.prev = 13;
                    _context6.t0 = _context6["catch"](6);
                    console.error(_context6.t0);
                    result(_context6.t0, null);

                  case 17:
                  case "end":
                    return _context6.stop();
                }
              }
            }, null, null, [[6, 13]]);
          };

          _iterator4 = events[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context7.next = 15;
            break;
          }

          _context7.next = 12;
          return regeneratorRuntime.awrap(_loop4());

        case 12:
          _iteratorNormalCompletion4 = true;
          _context7.next = 9;
          break;

        case 15:
          _context7.next = 21;
          break;

        case 17:
          _context7.prev = 17;
          _context7.t0 = _context7["catch"](6);
          _didIteratorError4 = true;
          _iteratorError4 = _context7.t0;

        case 21:
          _context7.prev = 21;
          _context7.prev = 22;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 24:
          _context7.prev = 24;

          if (!_didIteratorError4) {
            _context7.next = 27;
            break;
          }

          throw _iteratorError4;

        case 27:
          return _context7.finish(24);

        case 28:
          return _context7.finish(21);

        case 29:
          return _context7.abrupt("return", marketList);

        case 32:
          _context7.prev = 32;
          _context7.t1 = _context7["catch"](2);
          console.error(_context7.t1);

        case 35:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 32], [6, 17, 21, 29], [22,, 24, 28]]);
}; // storeMatchOdds = async function () {
//   const markets = await new Promise((resolve, reject) => {
//     dbConn.query(
//       "select event_id,runner1,runner2, market_id from markets",
//       (err, res) => {
//         if (err) {
//           reject(err);
//         } else {
//           let market_ids = res.map((m) => m.market_id);
//           let response = { markets: res, market_ids: market_ids.join(",") };
//           resolve(response);
//         }
//       }
//     );
//   });
//   const market_odds = await axios.get(
//     process.env.API_URL + "listMarketBookOdds?market_id=" + markets.market_ids
//   );
//   const finale_marketOdds = markets.markets.reduce((acc, item) => {
//     const market = market_odds.data.find((m) => m.marketId == item.market_id);
//     if (market) {
//       acc.push({ ...item, ...market });
//     }
//     return acc;
//   }, []);
//   for (market of finale_marketOdds) {
//     // console.log(market);
//     if (market.market == "Match Odds") {
//       // console.log("-------------------------------");
//       // console.log("runner1 id ---->",market.event_id);
//       // console.log("runner1 id ---->",market.runner1);
//       // console.log("runner2 id ---->",market.runner2);
//       // console.log("market id ---->",market.marketId);
//       // console.log("runners size-->",market.runners.length);
//       // console.log('back0 price-->',market.runners[0].ex.availableToBack[0]);
//       // console.log('lay0 price-->',market.runners[0].ex.availableToLay[0]);
//       // console.log('back1 price-->',market.runners[1].ex.availableToBack[0]);
//       // console.log('lay1 price-->',market.runners[1].ex.availableToLay[0]);
//       // console.log("-------------------------------");
//       const result = await new Promise((resolve, reject) => {
//         let sql_query = "";
//         //for runner length 1
//         if (market.runners.length == 1) {
//           if (market.runners[0].ex.availableToBack.length == 0) {
//             market.runners[0].ex.availableToBack = [{ price: 0, size: 0 }];
//           }
//           // if (market.runners[1].ex.availableToBack.length == 0) {
//           //   market.runners[1].ex.availableToBack = [{ price: 0, size: 0 }];
//           // }
//           if (market.runners[0].ex.availableToLay.length == 0) {
//             market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
//           }
//           // if (market.runners[1].ex.availableToLay.length == 0) {
//           //   market.runners[1].ex.availableToLay = [{ price: 0, size: 0 }];
//           // }
//           sql_query =
//             "insert into marketodds(event_id,market_id,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size)values(?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?";
//           values = [
//             market.event_id,
//             market.market_id,
//             market.runner1,
//             market.runner2,
//             market.status,
//             market.inplay,
//             market.runners[0].ex.availableToBack[0].price,
//             market.runners[0].ex.availableToBack[0].size,
//             market.runners[0].ex.availableToLay[0].price,
//             market.runners[0].ex.availableToLay[0].size,
//             market.event_id,
//             market.market_id,
//             market.runner1,
//             market.runner2,
//             market.status,
//             market.inplay,
//             market.runners[0].ex.availableToBack[0].price,
//             market.runners[0].ex.availableToBack[0].size,
//             market.runners[0].ex.availableToLay[0].price,
//             market.runners[0].ex.availableToLay[0].size,
//           ];
//         }
//         // for runner length 2
//         if (market.runners.length == 2) {
//           if (market.runners[0].ex.availableToBack.length == 0) {
//             market.runners[0].ex.availableToBack = [{ price: 0, size: 0 }];
//           }
//           if (market.runners[1].ex.availableToBack.length == 0) {
//             market.runners[1].ex.availableToBack = [{ price: 0, size: 0 }];
//           }
//           if (market.runners[0].ex.availableToLay.length == 0) {
//             market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
//           }
//           if (market.runners[1].ex.availableToLay.length == 0) {
//             market.runners[1].ex.availableToLay = [{ price: 0, size: 0 }];
//           }
//           sql_query =
//             "insert into marketodds(event_id,market_id,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?";
//           values = [
//             market.event_id,
//             market.market_id,
//             market.runner1,
//             market.runner2,
//             market.status,
//             market.inplay,
//             market.runners[0].ex.availableToBack[0].price,
//             market.runners[0].ex.availableToBack[0].size,
//             market.runners[0].ex.availableToLay[0].price,
//             market.runners[0].ex.availableToLay[0].size,
//             market.runners[1].ex.availableToBack[0].price,
//             market.runners[1].ex.availableToBack[0].size,
//             market.runners[1].ex.availableToLay[0].price,
//             market.runners[1].ex.availableToLay[0].size,
//             market.event_id,
//             market.market_id,
//             market.runner1,
//             market.runner2,
//             market.status,
//             market.inplay,
//             market.runners[0].ex.availableToBack[0].price,
//             market.runners[0].ex.availableToBack[0].size,
//             market.runners[0].ex.availableToLay[0].price,
//             market.runners[0].ex.availableToLay[0].size,
//             market.runners[1].ex.availableToBack[0].price,
//             market.runners[1].ex.availableToBack[0].size,
//             market.runners[1].ex.availableToLay[0].price,
//             market.runners[1].ex.availableToLay[0].size,
//           ];
//         }
//         if (market.runners.length == 3) {
//           if (market.runners[0].ex.availableToBack.length == 0) {
//             market.runners[0].ex.availableToBack = [{ price: 0, size: 0 }];
//           }
//           if (market.runners[1].ex.availableToBack.length == 0) {
//             market.runners[1].ex.availableToBack = [{ price: 0, size: 0 }];
//           }
//           if (market.runners[2].ex.availableToBack.length == 0) {
//             market.runners[2].ex.availableToBack = [{ price: 0, size: 0 }];
//           }
//           if (market.runners[0].ex.availableToLay.length == 0) {
//             market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
//           }
//           if (market.runners[1].ex.availableToLay.length == 0) {
//             market.runners[1].ex.availableToLay = [{ price: 0, size: 0 }];
//           }
//           if (market.runners[2].ex.availableToLay.length == 0) {
//             market.runners[2].ex.availableToLay = [{ price: 0, size: 0 }];
//           }
//           sql_query =
//             "insert into marketodds(event_id,market_id,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?";
//           values = [
//             market.event_id,
//             market.market_id,
//             market.runner1,
//             market.runner2,
//             market.status,
//             market.inplay,
//             market.runners[0].ex.availableToBack[0].price,
//             market.runners[0].ex.availableToBack[0].size,
//             market.runners[0].ex.availableToLay[0].price,
//             market.runners[0].ex.availableToLay[0].size,
//             market.runners[1].ex.availableToBack[0].price,
//             market.runners[1].ex.availableToBack[0].size,
//             market.runners[1].ex.availableToLay[0].price,
//             market.runners[1].ex.availableToLay[0].size,
//             market.runners[2].ex.availableToBack[0].price,
//             market.runners[2].ex.availableToBack[0].size,
//             market.runners[2].ex.availableToLay[0].price,
//             market.runners[2].ex.availableToLay[0].size,
//             market.event_id,
//             market.market_id,
//             market.runner1,
//             market.runner2,
//             market.status,
//             market.inplay,
//             market.runners[0].ex.availableToBack[0].price,
//             market.runners[0].ex.availableToBack[0].size,
//             market.runners[0].ex.availableToLay[0].price,
//             market.runners[0].ex.availableToLay[0].size,
//             market.runners[1].ex.availableToBack[0].price,
//             market.runners[1].ex.availableToBack[0].size,
//             market.runners[1].ex.availableToLay[0].price,
//             market.runners[1].ex.availableToLay[0].size,
//             market.runners[2].ex.availableToBack[0].price,
//             market.runners[2].ex.availableToBack[0].size,
//             market.runners[2].ex.availableToLay[0].price,
//             market.runners[2].ex.availableToLay[0].size,
//           ];
//         }
//         // console.log("query---->", query);
//         // console.log("---------------------");
//         // console.log("values---->", values);
//         dbConn.query(sql_query, values, (err, res) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(res);
//           }
//         });
//       });
//     }
//   }
// };


storeNewMatchOdds = function storeNewMatchOdds() {
  var events;
  return regeneratorRuntime.async(function storeNewMatchOdds$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select event_id,market_id,event_name,runner1,runner2 from markets", function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                //const eventIds = res.map((e) => e.event_id);
                var eventInfo = res.map(function (e) {
                  return {
                    eventId: e.event_id,
                    marketId: e.market_id,
                    eventName: e.event_name,
                    runner1: e.runner1,
                    runner2: e.runner2
                  };
                });
                resolve(eventInfo);
              }
            });
          }));

        case 2:
          events = _context8.sent;
          _context8.next = 5;
          return regeneratorRuntime.awrap(Promise.all(events.map(function (_ref) {
            var eventId = _ref.eventId,
                marketId = _ref.marketId,
                eventName = _ref.eventName,
                runner1 = _ref.runner1,
                runner2 = _ref.runner2;
            return fetchAndInsertMarketOdds(eventId, marketId, eventName, runner1, runner2);
          }) //eventIds.map((eventId) => fetchAndInsertMarketOdds(eventId))
          ));

        case 5:
          console.log("All market odds fetched and inserted.");

        case 6:
        case "end":
          return _context8.stop();
      }
    }
  });
};

storeSession = function storeSession() {
  var events, promises;
  return regeneratorRuntime.async(function storeSession$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select event_id, market_id from markets", function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                var eventInfo = res.map(function (e) {
                  return {
                    event_id: e.event_id,
                    market_id: e.market_id
                  };
                });
                resolve(eventInfo);
              }
            });
          }));

        case 3:
          events = _context10.sent;
          promises = events.map(function _callee(_ref2) {
            var event_id, market_id, timeoutMilliseconds, session, sessions, output, insertionPromises;
            return regeneratorRuntime.async(function _callee$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    event_id = _ref2.event_id, market_id = _ref2.market_id;
                    _context9.prev = 1;
                    timeoutMilliseconds = 20000; // Adjust the timeout value as needed
                    // console.log(
                    //   "session----->",
                    //   process.env.API_URL + "getOdds?eventId=" + event
                    // );

                    _context9.next = 5;
                    return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "listMarketBookSession?match_id=" + event_id, {
                      timeout: timeoutMilliseconds
                    }));

                  case 5:
                    session = _context9.sent;
                    sessions = session.data;

                    if (!(sessions.length > 0)) {
                      _context9.next = 13;
                      break;
                    }

                    sessions = sessions.filter(function (obj) {
                      return obj.gtype === "session";
                    }); // console.log(sessions.length);

                    output = {
                      event_id: event_id,
                      market_id: market_id,
                      sessions: sessions
                    };
                    insertionPromises = output.sessions.map(function (session) {
                      return new Promise(function (resolve, reject) {
                        query = "insert into sessions(event_id,market_id,runner_name,lay_price,lay_size,back_price,back_size,game_status,game_type,min,max)values(?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id =?,market_id=?,runner_name=?,lay_price=?,lay_size=?,back_price=?,back_size=?,game_status=?,game_type=?,min=?,max=?";
                        dbConn.query(query, [output.event_id, output.market_id, session.RunnerName, session.LayPrice1, session.LaySize1, session.BackPrice1, session.BackSize1, session.GameStatus, session.gtype, session.min, session.max, output.event_id, output.market_id, session.RunnerName, session.LayPrice1, session.LaySize1, session.BackPrice1, session.BackSize1, session.GameStatus, session.gtype, session.min, session.max], function (err, res) {
                          if (err) {
                            reject(err);
                          } else {
                            resolve();
                          }
                        });
                      });
                    });
                    _context9.next = 13;
                    return regeneratorRuntime.awrap(Promise.all(insertionPromises));

                  case 13:
                    _context9.next = 18;
                    break;

                  case 15:
                    _context9.prev = 15;
                    _context9.t0 = _context9["catch"](1);
                    console.log("Session API Error ", event_id);

                  case 18:
                  case "end":
                    return _context9.stop();
                }
              }
            }, null, null, [[1, 15]]);
          });
          _context10.next = 7;
          return regeneratorRuntime.awrap(Promise.all(promises));

        case 7:
          console.log("sessions added");
          _context10.next = 13;
          break;

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          console.log("error-->", _context10.t0);

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

storeFancy = function storeFancy() {
  var events, promises;
  return regeneratorRuntime.async(function storeFancy$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select event_id, market_id from markets", function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                var eventInfo = res.map(function (e) {
                  return {
                    event_id: e.event_id,
                    market_id: e.market_id
                  };
                });
                resolve(eventInfo);
              }
            });
          }));

        case 3:
          events = _context12.sent;
          promises = events.map(function _callee2(_ref3) {
            var event_id, market_id, timeoutMilliseconds, fancies, fancy, output, filteredToss, insertionPromises;
            return regeneratorRuntime.async(function _callee2$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    event_id = _ref3.event_id, market_id = _ref3.market_id;
                    _context11.prev = 1;
                    timeoutMilliseconds = 20000; // Adjust the timeout value as needed
                    // console.log(
                    //   "session----->",
                    //   process.env.API_URL + "getOdds?eventId=" + event
                    // );

                    _context11.next = 5;
                    return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "listMarketBookSession?match_id=" + event_id, {
                      timeout: timeoutMilliseconds
                    }));

                  case 5:
                    fancies = _context11.sent;
                    fancy = fancies.data;

                    if (!(fancy.length > 0)) {
                      _context11.next = 14;
                      break;
                    }

                    fancy = fancy.filter(function (obj) {
                      return obj.gtype === "fancy1";
                    });
                    output = {
                      event_id: event_id,
                      market_id: market_id,
                      fancies: fancy
                    };
                    filteredToss = output.fancies.filter(function (obj) {
                      return obj.srno == 1 && (obj.RunnerName.includes("toss") || obj.RunnerName.includes("Toss"));
                    });
                    insertionPromises = filteredToss.map(function (fancy) {
                      return new Promise(function (resolve, reject) {
                        query = "insert into fancies(event_id,market_id,runner_name,lay_price,lay_size,back_price,back_size,game_status,game_type,srno)values(?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id =?,market_id=?,runner_name=?,lay_price=?,lay_size=?,back_price=?,back_size=?,game_status=?,game_type=?,srno=?";
                        dbConn.query(query, [output.event_id, output.market_id, fancy.RunnerName, fancy.LayPrice1, fancy.LaySize1, fancy.BackPrice1, fancy.BackSize1, fancy.GameStatus, fancy.gtype, fancy.srno, output.event_id, output.market_id, fancy.RunnerName, fancy.LayPrice1, fancy.LaySize1, fancy.BackPrice1, fancy.BackSize1, fancy.GameStatus, fancy.gtype, fancy.srno], function (err, res) {
                          if (err) {
                            reject(err);
                          } else {
                            resolve();
                          }
                        });
                      });
                    });
                    _context11.next = 14;
                    return regeneratorRuntime.awrap(Promise.all(insertionPromises));

                  case 14:
                    _context11.next = 19;
                    break;

                  case 16:
                    _context11.prev = 16;
                    _context11.t0 = _context11["catch"](1);
                    console.log("Fancy API Error", event_id);

                  case 19:
                  case "end":
                    return _context11.stop();
                }
              }
            }, null, null, [[1, 16]]);
          });
          _context12.next = 7;
          return regeneratorRuntime.awrap(Promise.all(promises));

        case 7:
          console.log("fancy added");
          _context12.next = 13;
          break;

        case 10:
          _context12.prev = 10;
          _context12.t0 = _context12["catch"](0);
          console.log("error-->", _context12.t0);

        case 13:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

function fetchAndInsertMarketOdds(eventId, marketId, eventName, p_runner1, p_runner2) {
  var event_name, runner1, runner2, timeoutMilliseconds, market_odds, _market;

  return regeneratorRuntime.async(function fetchAndInsertMarketOdds$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          event_name = eventName;
          runner1 = p_runner1;
          runner2 = p_runner2; // console.log("odds-->", process.env.API_URL + "getOdds?eventId=" + eventId);

          timeoutMilliseconds = 20000; // Adjust the timeout value as needed

          _context13.next = 7;
          return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "listMarketBookOdds?market_id=" + marketId, {
            timeout: timeoutMilliseconds
          }));

        case 7:
          market_odds = _context13.sent;

          if (!(market_odds.status === 200 && market_odds.statusText.toLowerCase() == "ok")) {
            _context13.next = 19;
            break;
          }

          if (!(market_odds.data != null)) {
            _context13.next = 19;
            break;
          }

          _market = market_odds.data[0];

          if (!_market.hasOwnProperty("crossMatching")) {
            _context13.next = 16;
            break;
          }

          _context13.next = 14;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var sql_query = "insert into marketodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,is_suspended0,is_suspended1)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,is_suspended0=1,is_suspended1=1";
            var values = [_market.eventid, _market.marketId, event_name, runner1, runner2, _market.status, _market.inplay, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, _market.eventid, _market.marketId, event_name, runner1, runner2, _market.status, _market.inplay, 0, 0, 0, 0, 0, 0, 0, 0];
            dbConn.query(sql_query, values, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 14:
          _context13.next = 19;
          break;

        case 16:
          if (!(_market.market == "Match Odds")) {
            _context13.next = 19;
            break;
          }

          _context13.next = 19;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var sql_query = ""; //for runner length 1

            if (_market.runners.length == 1) {
              if (_market.runners[0].ex.availableToBack.length == 0) {
                _market.runners[0].ex.availableToBack = [{
                  price: 0,
                  size: 0
                }];
              }

              if (_market.runners[0].ex.availableToLay.length == 0) {
                _market.runners[0].ex.availableToLay = [{
                  price: 0,
                  size: 0
                }];
              }

              sql_query = "insert into marketodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size)values(?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?";
              values = [_market.eventid, _market.marketId, event_name, runner1, runner2, _market.status, _market.inplay, _market.runners[0].ex.availableToBack[0].price, _market.runners[0].ex.availableToBack[0].size, _market.runners[0].ex.availableToLay[0].price, _market.runners[0].ex.availableToLay[0].size, _market.eventid, _market.marketId, event_name, runner1, runner2, _market.status, _market.inplay, _market.runners[0].ex.availableToBack[0].price, _market.runners[0].ex.availableToBack[0].size, _market.runners[0].ex.availableToLay[0].price, _market.runners[0].ex.availableToLay[0].size];
            } // for runner length 2


            if (_market.runners.length == 2) {
              if (_market.runners[0].ex.availableToBack.length == 0) {
                _market.runners[0].ex.availableToBack = [{
                  price: 0,
                  size: 0
                }];
              }

              if (_market.runners[1].ex.availableToBack.length == 0) {
                _market.runners[1].ex.availableToBack = [{
                  price: 0,
                  size: 0
                }];
              }

              if (_market.runners[0].ex.availableToLay.length == 0) {
                _market.runners[0].ex.availableToLay = [{
                  price: 0,
                  size: 0
                }];
              }

              if (_market.runners[1].ex.availableToLay.length == 0) {
                _market.runners[1].ex.availableToLay = [{
                  price: 0,
                  size: 0
                }];
              }

              sql_query = "insert into marketodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?";
              values = [_market.eventid, _market.marketId, event_name, runner1, runner2, _market.status, _market.inplay, _market.runners[0].ex.availableToBack[0].price, _market.runners[0].ex.availableToBack[0].size, _market.runners[0].ex.availableToLay[0].price, _market.runners[0].ex.availableToLay[0].size, _market.runners[1].ex.availableToBack[0].price, _market.runners[1].ex.availableToBack[0].size, _market.runners[1].ex.availableToLay[0].price, _market.runners[1].ex.availableToLay[0].size, _market.eventid, _market.marketId, event_name, runner1, runner2, _market.status, _market.inplay, _market.runners[0].ex.availableToBack[0].price, _market.runners[0].ex.availableToBack[0].size, _market.runners[0].ex.availableToLay[0].price, _market.runners[0].ex.availableToLay[0].size, _market.runners[1].ex.availableToBack[0].price, _market.runners[1].ex.availableToBack[0].size, _market.runners[1].ex.availableToLay[0].price, _market.runners[1].ex.availableToLay[0].size];
            }

            if (_market.runners.length == 3) {
              if (_market.runners[0].ex.availableToBack.length == 0) {
                _market.runners[0].ex.availableToBack = [{
                  price: 0,
                  size: 0
                }];
              }

              if (_market.runners[1].ex.availableToBack.length == 0) {
                _market.runners[1].ex.availableToBack = [{
                  price: 0,
                  size: 0
                }];
              }

              if (_market.runners[2].ex.availableToBack.length == 0) {
                _market.runners[2].ex.availableToBack = [{
                  price: 0,
                  size: 0
                }];
              }

              if (_market.runners[0].ex.availableToLay.length == 0) {
                _market.runners[0].ex.availableToLay = [{
                  price: 0,
                  size: 0
                }];
              }

              if (_market.runners[1].ex.availableToLay.length == 0) {
                _market.runners[1].ex.availableToLay = [{
                  price: 0,
                  size: 0
                }];
              }

              if (_market.runners[2].ex.availableToLay.length == 0) {
                _market.runners[2].ex.availableToLay = [{
                  price: 0,
                  size: 0
                }];
              }

              sql_query = "insert into marketodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?";
              values = [_market.eventid, _market.marketId, event_name, runner1, runner2, _market.status, _market.inplay, _market.runners[0].ex.availableToBack[0].price, _market.runners[0].ex.availableToBack[0].size, _market.runners[0].ex.availableToLay[0].price, _market.runners[0].ex.availableToLay[0].size, _market.runners[1].ex.availableToBack[0].price, _market.runners[1].ex.availableToBack[0].size, _market.runners[1].ex.availableToLay[0].price, _market.runners[1].ex.availableToLay[0].size, _market.runners[2].ex.availableToBack[0].price, _market.runners[2].ex.availableToBack[0].size, _market.runners[2].ex.availableToLay[0].price, _market.runners[2].ex.availableToLay[0].size, _market.eventid, _market.marketId, event_name, runner1, runner2, _market.status, _market.inplay, _market.runners[0].ex.availableToBack[0].price, _market.runners[0].ex.availableToBack[0].size, _market.runners[0].ex.availableToLay[0].price, _market.runners[0].ex.availableToLay[0].size, _market.runners[1].ex.availableToBack[0].price, _market.runners[1].ex.availableToBack[0].size, _market.runners[1].ex.availableToLay[0].price, _market.runners[1].ex.availableToLay[0].size, _market.runners[2].ex.availableToBack[0].price, _market.runners[2].ex.availableToBack[0].size, _market.runners[2].ex.availableToLay[0].price, _market.runners[2].ex.availableToLay[0].size];
            } // console.log("query---->", query);
            // console.log("---------------------");
            // console.log("values---->", values);


            dbConn.query(sql_query, values, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 19:
          _context13.next = 24;
          break;

        case 21:
          _context13.prev = 21;
          _context13.t0 = _context13["catch"](0);

          if (axios.isCancel(_context13.t0)) {
            // console.log("Request canceled due to timeout", error.message);
            console.log("Request canceled due to timeout", eventId);
          } else {
            console.error("An error occurred-->", eventId);
            console.error("An error occurred-->", _context13.t0);
          }

        case 24:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 21]]);
}

storeNewBookOdds = function storeNewBookOdds() {
  var eventIds;
  return regeneratorRuntime.async(function storeNewBookOdds$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select event_id,event_name,market_id from book_markets", function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                var eventInfo = res.map(function (e) {
                  return {
                    eventId: e.event_id,
                    marketId: e.market_id,
                    eventName: e.event_name
                  };
                });
                resolve(eventInfo);
              }
            });
          }));

        case 2:
          eventIds = _context14.sent;
          _context14.next = 5;
          return regeneratorRuntime.awrap(Promise.all(eventIds.map(function (_ref4) {
            var eventId = _ref4.eventId,
                marketId = _ref4.marketId,
                eventName = _ref4.eventName;
            return fetchAndInsertBookOdds(eventId, marketId, eventName);
          })));

        case 5:
          console.log("All Book odds fetched and inserted.");

        case 6:
        case "end":
          return _context14.stop();
      }
    }
  });
};

function fetchAndInsertBookOdds(eventId, marketId, eventName) {
  var timeoutMilliseconds, bookmaker_odds, bookmaker_odd, market_odds, sql_query;
  return regeneratorRuntime.async(function fetchAndInsertBookOdds$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          // console.log("odds-->", process.env.API_URL + "getOdds?eventId=" + eventId);
          console.log("odds-->", process.env.BOOK_API_URL + "listBookmakerMarketOdds?market_id=" + marketId);
          timeoutMilliseconds = 20000; // Adjust the timeout value as needed

          _context15.next = 5;
          return regeneratorRuntime.awrap(axios.get(process.env.BOOK_API_URL + "listBookmakerMarketOdds?market_id=" + marketId, {
            timeout: timeoutMilliseconds
          }));

        case 5:
          bookmaker_odds = _context15.sent;

          if (!(bookmaker_odds.status == 200 && bookmaker_odds.statusText == "OK")) {
            _context15.next = 21;
            break;
          }

          bookmaker_odd = bookmaker_odds.data; // Process and insert data into the database (modify the following code based on your needs)

          market_odds = bookmaker_odd[0]; // Insert marketOdds into the database

          if (!(market_odds != null)) {
            _context15.next = 18;
            break;
          }

          market = market_odds;
          sql_query = ""; //for runner length 1

          if (market.runners.length == 1) {
            if (market.runners[0].ex.availableToBack.length == 0) {
              market.runners[0].ex.availableToBack = [{
                price: 0,
                size: 0
              }];
            }

            if (market.runners[0].ex.availableToLay.length == 0) {
              market.runners[0].ex.availableToLay = [{
                price: 0,
                size: 0
              }];
            }

            sql_query = "insert into bookmakerodds(event_id,market_id,event_name,runner1,runner2,status,status1,status2,inplay,back0_price,back0_size,lay0_price,lay0_size,min,max)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,status1=?,status2=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,min=?,max=?";
            values = [market.evid, market.marketId, eventName, market.runners[0].runnerName, null, market.status, market.runners[0].status, null, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size, market.min, market.max, market.evid, market.marketId, eventName, market.runners[0].runnerName, null, market.status, market.runners[0].status, null, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size, market.min, market.max];
          } // for runner length 2


          if (market.runners.length == 2) {
            if (market.runners[0].ex.availableToBack.length == 0) {
              market.runners[0].ex.availableToBack = [{
                price: 0,
                size: 0
              }];
            }

            if (market.runners[1].ex.availableToBack.length == 0) {
              market.runners[1].ex.availableToBack = [{
                price: 0,
                size: 0
              }];
            }

            if (market.runners[0].ex.availableToLay.length == 0) {
              market.runners[0].ex.availableToLay = [{
                price: 0,
                size: 0
              }];
            }

            if (market.runners[1].ex.availableToLay.length == 0) {
              market.runners[1].ex.availableToLay = [{
                price: 0,
                size: 0
              }];
            }

            sql_query = "insert into bookmakerodds(event_id,market_id,event_name,runner1,runner2,status,status1,status2,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,min,max)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,status1=?,status2=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,min=?,max=?";
            values = [market.evid, market.marketId, eventName, market.runners[0].runnerName, market.runners[1].runnerName, market.status, market.runners[0].status, market.runners[1].status, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size, market.runners[1].ex.availableToBack[0].price, market.runners[1].ex.availableToBack[0].size, market.runners[1].ex.availableToLay[0].price, market.runners[1].ex.availableToLay[0].size, market.min, market.max, market.evid, market.marketId, eventName, market.runners[0].runnerName, market.runners[1].runnerName, market.status, market.runners[0].status, market.runners[1].status, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size, market.runners[1].ex.availableToBack[0].price, market.runners[1].ex.availableToBack[0].size, market.runners[1].ex.availableToLay[0].price, market.runners[1].ex.availableToLay[0].size, market.min, market.max];
          }

          _context15.next = 16;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(sql_query, values, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 16:
          _context15.next = 19;
          break;

        case 18:
          console.log("Bookmaker data null for " + eventId);

        case 19:
          _context15.next = 22;
          break;

        case 21:
          console.log("No Data for bookmaker event", eventId);

        case 22:
          _context15.next = 27;
          break;

        case 24:
          _context15.prev = 24;
          _context15.t0 = _context15["catch"](0);

          if (axios.isCancel(_context15.t0)) {
            // console.log("Request canceled due to timeout", error.message);
            console.log("Request canceled due to timeout", eventId);
          } else {
            console.error("An error occurred-->", eventId);
            console.error("An error occurred-->", _context15.t0);
          }

        case 27:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 24]]);
}

storeBookMarkets = function storeBookMarkets(events) {
  var bookMarketList, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _loop5, _iterator5, _step5;

  return regeneratorRuntime.async(function storeBookMarkets$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          bookMarketList = []; //truncate book_markets

          _context17.next = 3;
          return regeneratorRuntime.awrap(dbConn.query("truncate table book_markets", function (err, res) {
            if (err) {
              console.log(err);
              reject(err);
            } else {// console.log("truncated");
            }
          }));

        case 3:
          _context17.prev = 3;
          // console.log("events--->", events);
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context17.prev = 7;

          _loop5 = function _loop5() {
            var event, response, market, _result4;

            return regeneratorRuntime.async(function _loop5$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    event = _step5.value;
                    _context16.next = 3;
                    return regeneratorRuntime.awrap(axios.get(process.env.BOOK_API_URL + "fetch_data?Action=listBookmakerMarket&EventID=" + event.event_id));

                  case 3:
                    response = _context16.sent;
                    market = response.data;

                    if (!(market.length > 0)) {
                      _context16.next = 18;
                      break;
                    }

                    if (!(market[0].marketName == "Bookmaker")) {
                      _context16.next = 18;
                      break;
                    }

                    _context16.prev = 7;
                    _context16.next = 10;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var runnerlist = [];

                      for (var i = 0; i < 3; i++) {
                        if (market[0].runners[i]) {
                          runnerlist.push(market[0].runners[i].runnerName);
                        } else {
                          runnerlist.push(null);
                        }
                      }

                      dbConn.query("REPLACE INTO book_markets(event_id,market_id,event_name,market_name,start_time,runner1,runner2) values(?,?,?,?,?,?,?)", [event.event_id, market[0].marketId, event.event_name, market[0].marketName, // moment(market[0].marketStartTime).format(
                      //   "YYYY-MM-DD HH:mm:ss"
                      // ),
                      new Date().toISOString().slice(0, 19).replace("T", " "), runnerlist[0], runnerlist[1], runnerlist[2]], function (err, res) {
                        if (err) {
                          console.log(err);
                          reject(err);
                        } else {
                          var insertedId = res.insertId;
                          resolve(market[0].marketId);
                        }
                      });
                    }));

                  case 10:
                    _result4 = _context16.sent;
                    bookMarketList.push(_result4);
                    _context16.next = 18;
                    break;

                  case 14:
                    _context16.prev = 14;
                    _context16.t0 = _context16["catch"](7);
                    console.error(_context16.t0);
                    result(_context16.t0, null);

                  case 18:
                  case "end":
                    return _context16.stop();
                }
              }
            }, null, null, [[7, 14]]);
          };

          _iterator5 = events[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context17.next = 16;
            break;
          }

          _context17.next = 13;
          return regeneratorRuntime.awrap(_loop5());

        case 13:
          _iteratorNormalCompletion5 = true;
          _context17.next = 10;
          break;

        case 16:
          _context17.next = 22;
          break;

        case 18:
          _context17.prev = 18;
          _context17.t0 = _context17["catch"](7);
          _didIteratorError5 = true;
          _iteratorError5 = _context17.t0;

        case 22:
          _context17.prev = 22;
          _context17.prev = 23;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 25:
          _context17.prev = 25;

          if (!_didIteratorError5) {
            _context17.next = 28;
            break;
          }

          throw _iteratorError5;

        case 28:
          return _context17.finish(25);

        case 29:
          return _context17.finish(22);

        case 30:
          return _context17.abrupt("return", bookMarketList);

        case 33:
          _context17.prev = 33;
          _context17.t1 = _context17["catch"](3);
          console.error(_context17.t1);

        case 36:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[3, 33], [7, 18, 22, 30], [23,, 25, 29]]);
};

module.exports = {
  storeCompetitions: storeCompetitions,
  storeEvents: storeEvents,
  storeMarkets: storeMarkets,
  storeSession: storeSession,
  // storeMatchOdds,
  storeFancy: storeFancy,
  storeNewMatchOdds: storeNewMatchOdds,
  storeNewBookOdds: storeNewBookOdds,
  storeBookMarkets: storeBookMarkets
};