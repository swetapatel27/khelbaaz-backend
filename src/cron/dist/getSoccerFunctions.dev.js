"use strict";

var dbConn = require("../../config/db");

var axios = require("axios");

var moment = require("moment");

require("dotenv").config(); //store soccer markets based on event ids


storeSoccerMarkets = function storeSoccerMarkets() {
  var timeoutMilliseconds, res, response, t1, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

  return regeneratorRuntime.async(function storeSoccerMarkets$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          timeoutMilliseconds = 60000; // Adjust the timeout value as needed

          dbConn.query("truncate table soccermarkets", function (err, res) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log("soccer market truncated");
            }
          });
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "socker", {
            timeout: timeoutMilliseconds
          }));

        case 5:
          res = _context2.sent;
          response = res.data;

          if (!response.success) {
            _context2.next = 42;
            break;
          }

          t1 = response.data.t1;

          if (!(t1 && Array.isArray(t1) && t1.length > 0)) {
            _context2.next = 39;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 13;

          _loop = function _loop() {
            var market, sortedSection;
            return regeneratorRuntime.async(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    market = _step.value;
                    sortedSection = market.section.slice().sort(function (a, b) {
                      return a.sno - b.sno;
                    });
                    _context.next = 4;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      dbConn.query("Insert into soccermarkets(event_id,market_id,event_name,market_name,inplay,tv,bm,f,back1,lay1,back12,lay12,back11,lay11,status,start_time,runner1,runner2,runner3)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [market.gmid, market.mid, market.ename, "Match Odds", typeof market.iplay == "string" ? JSON.parse(market.iplay.toLowerCase()) : market.iplay, typeof market.tv == "string" ? JSON.parse(market.tv.toLowerCase()) : market.tv, typeof market.bm == "string" ? JSON.parse(market.bm.toLowerCase()) : market.bm, typeof market.f == "string" ? JSON.parse(market.f.toLowerCase()) : market.f, sortedSection[0].odds[0].oname == "back1" ? sortedSection[0].odds[0].odds : sortedSection[0].odds[1].odds, sortedSection[0].odds[1].oname == "lay1" ? sortedSection[0].odds[1].odds : sortedSection[0].odds[0].odds, sortedSection[1].odds[0].oname == "back1" ? sortedSection[1].odds[0].odds : sortedSection[1].odds[1].odds, sortedSection[1].odds[1].oname == "lay1" ? sortedSection[1].odds[1].odds : sortedSection[1].odds[0].odds, sortedSection[2].odds[0].oname == "back1" ? sortedSection[2].odds[0].odds : sortedSection[2].odds[1].odds, sortedSection[2].odds[1].oname == "lay1" ? sortedSection[2].odds[1].odds : sortedSection[2].odds[0].odds, market.status, market.stime, sortedSection[0].nat, sortedSection[2].nat, sortedSection[1].nat], function (err, res) {
                        if (err) {
                          reject(err);
                        } else {
                          resolve();
                        }
                      });
                    }));

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          _iterator = t1[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 22;
            break;
          }

          _context2.next = 19;
          return regeneratorRuntime.awrap(_loop());

        case 19:
          _iteratorNormalCompletion = true;
          _context2.next = 16;
          break;

        case 22:
          _context2.next = 28;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 28:
          _context2.prev = 28;
          _context2.prev = 29;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 31:
          _context2.prev = 31;

          if (!_didIteratorError) {
            _context2.next = 34;
            break;
          }

          throw _iteratorError;

        case 34:
          return _context2.finish(31);

        case 35:
          return _context2.finish(28);

        case 36:
          console.log("soccer markets added");
          _context2.next = 40;
          break;

        case 39:
          console.warn("No t1 data found for soccer markets");

        case 40:
          _context2.next = 43;
          break;

        case 42:
          throw new Error("Soccer Market API request was not successful");

        case 43:
          _context2.next = 48;
          break;

        case 45:
          _context2.prev = 45;
          _context2.t1 = _context2["catch"](2);
          console.error(_context2.t1);

        case 48:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 45], [13, 24, 28, 36], [29,, 31, 35]]);
}; //store soccer odds based on market ids


storeSoccerOdds = function storeSoccerOdds() {
  var events;
  return regeneratorRuntime.async(function storeSoccerOdds$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select event_id,event_name from soccermarkets", function (err, res) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                var eventInfo = res.map(function (e) {
                  return {
                    eventId: e.event_id,
                    eventName: e.event_name
                  };
                });
                resolve(eventInfo);
              }
            });
          }));

        case 2:
          events = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Promise.all(events.map(function (_ref) {
            var eventId = _ref.eventId,
                eventName = _ref.eventName;
            return fetchAndInsertSoccerOdds(eventId, eventName);
          })));

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

function fetchAndInsertSoccerOdds(eventId, eventName) {
  var timeoutMilliseconds, soccer_odds, soccerOdds, runner, sortedSection, index1, index2;
  return regeneratorRuntime.async(function fetchAndInsertSoccerOdds$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          // console.log("odds-->", process.env.API_URL + "getOdds?eventId=" + eventId);
          timeoutMilliseconds = 20000; // Adjust the timeout value as needed

          _context4.next = 4;
          return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "getOdds?eventId=" + eventId, {
            timeout: timeoutMilliseconds
          }));

        case 4:
          soccer_odds = _context4.sent;

          if (!(soccer_odds.data != null)) {
            _context4.next = 24;
            break;
          }

          if (!(soccer_odds.data.status === 200)) {
            _context4.next = 22;
            break;
          }

          if (!(soccer_odds.data.msg == "success" && soccer_odds.data.hasOwnProperty("data"))) {
            _context4.next = 22;
            break;
          }

          soccerOdds = soccer_odds.data.data[0]; // console.log("eventname-->", eventName);
          // console.log("event id,name-->", eventId, soccerOdds.ename);
          // Insert marketOdds into the database

          if (!(soccerOdds != null)) {
            _context4.next = 21;
            break;
          }

          runner = getRunners(eventName);
          soccer = soccerOdds;
          sortedSection = filterSections(soccer.section);
          index1 = sortedSection.findIndex(function (obj) {
            return obj.nat.toLowerCase().trim() === runner[0].toLowerCase().trim();
          });
          index2 = sortedSection.findIndex(function (obj) {
            return obj.nat.toLowerCase().trim() === runner[1].toLowerCase().trim();
          }); // if (eventId == 717107278) {
          //   console.log("sorted-->", sortedSection);
          //   console.log(runner[0] + "-->" + index1);
          //   console.log(runner[1] + "-->" + index2);
          //   console.log(sortedSection[index2] + "-->" + index2);
          // }
          // console.log(sortedSection);
          // const sortedSection = soccer.section
          //   .slice()
          //   .sort((a, b) => a.sno - b.sno);
          // console.log("event id-->", eventId);
          // console.log("event name -->", soccer.ename);

          sql_query = "insert into soccerodds(event_id,market_id,event_name,runner1,runner2,runner3,status,status1,status2,status3,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,runner3=?,status=?,status1=?,status2=?,status3=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?";
          values = [eventId, soccer.gmid, eventName, runner[0], runner[1], runner[2], soccer.status.toLowerCase(), sortedSection[0].gstatus, sortedSection[1].gstatus, sortedSection[2].gstatus, soccer.iplay, sortedSection[index1].odds[0].oname == "back1" ? sortedSection[index1].odds[0].odds : sortedSection[index1].odds[1].odds, sortedSection[index1].odds[0].oname == "back1" ? sortedSection[index1].odds[0].size : sortedSection[index1].odds[1].size, sortedSection[index1].odds[1].oname == "lay1" ? sortedSection[index1].odds[1].odds : sortedSection[index1].odds[0].odds, sortedSection[index1].odds[1].oname == "lay1" ? sortedSection[index1].odds[1].size : sortedSection[index1].odds[0].size, sortedSection[index2].odds[0].oname == "back1" ? sortedSection[index2].odds[0].odds : sortedSection[index2].odds[1].odds, sortedSection[index2].odds[0].oname == "back1" ? sortedSection[index2].odds[0].size : sortedSection[index2].odds[1].size, sortedSection[index2].odds[1].oname == "lay1" ? sortedSection[index2].odds[1].odds : sortedSection[index2].odds[0].odds, sortedSection[index2].odds[1].oname == "lay1" ? sortedSection[index2].odds[1].size : sortedSection[index2].odds[0].size, sortedSection[2].odds[0].oname == "back1" ? sortedSection[2].odds[0].odds : sortedSection[2].odds[1].odds, sortedSection[2].odds[0].oname == "back1" ? sortedSection[2].odds[0].size : sortedSection[2].odds[1].size, sortedSection[2].odds[1].oname == "lay1" ? sortedSection[2].odds[1].odds : sortedSection[2].odds[0].odds, sortedSection[2].odds[1].oname == "lay1" ? sortedSection[2].odds[1].size : sortedSection[2].odds[0].size, eventId, soccer.gmid, eventName, runner[0], runner[1], runner[2], soccer.status.toLowerCase(), sortedSection[0].gstatus, sortedSection[1].gstatus, sortedSection[2].gstatus, soccer.iplay, sortedSection[0].odds[0].oname == "back1" ? sortedSection[0].odds[0].odds : sortedSection[0].odds[1].odds, sortedSection[0].odds[0].oname == "back1" ? sortedSection[0].odds[0].size : sortedSection[0].odds[1].size, sortedSection[0].odds[1].oname == "lay1" ? sortedSection[0].odds[1].odds : sortedSection[0].odds[0].odds, sortedSection[0].odds[1].oname == "lay1" ? sortedSection[0].odds[1].size : sortedSection[0].odds[0].size, sortedSection[1].odds[0].oname == "back1" ? sortedSection[1].odds[0].odds : sortedSection[1].odds[1].odds, sortedSection[1].odds[0].oname == "back1" ? sortedSection[1].odds[0].size : sortedSection[1].odds[1].size, sortedSection[1].odds[1].oname == "lay1" ? sortedSection[1].odds[1].odds : sortedSection[1].odds[0].odds, sortedSection[1].odds[1].oname == "lay1" ? sortedSection[1].odds[1].size : sortedSection[1].odds[0].size, sortedSection[2].odds[0].oname == "back1" ? sortedSection[2].odds[0].odds : sortedSection[2].odds[1].odds, sortedSection[2].odds[0].oname == "back1" ? sortedSection[2].odds[0].size : sortedSection[2].odds[1].size, sortedSection[2].odds[1].oname == "lay1" ? sortedSection[2].odds[1].odds : sortedSection[2].odds[0].odds, sortedSection[2].odds[1].oname == "lay1" ? sortedSection[2].odds[1].size : sortedSection[2].odds[0].size]; // values = [
          //   eventId,
          //   soccer.gmid,
          //   eventName,
          //   sortedSection[0].nat,
          //   sortedSection[2].nat,
          //   sortedSection[1].nat,
          //   soccer.status,
          //   sortedSection[0].gstatus,
          //   sortedSection[2].gstatus,
          //   sortedSection[1].gstatus,
          //   soccer.iplay,
          //   sortedSection[0].odds[0].oname == "back1"
          //     ? sortedSection[0].odds[0].odds
          //     : sortedSection[0].odds[1].odds,
          //   sortedSection[0].odds[0].oname == "back1"
          //     ? sortedSection[0].odds[0].size
          //     : sortedSection[0].odds[1].size,
          //   sortedSection[0].odds[1].oname == "lay1"
          //     ? sortedSection[0].odds[1].odds
          //     : sortedSection[0].odds[0].odds,
          //   sortedSection[0].odds[1].oname == "lay1"
          //     ? sortedSection[0].odds[1].size
          //     : sortedSection[0].odds[0].size,
          //   sortedSection[2].odds[0].oname == "back1"
          //     ? sortedSection[2].odds[0].odds
          //     : sortedSection[2].odds[1].odds,
          //   sortedSection[2].odds[0].oname == "back1"
          //     ? sortedSection[2].odds[0].size
          //     : sortedSection[2].odds[1].size,
          //   sortedSection[2].odds[1].oname == "lay1"
          //     ? sortedSection[2].odds[1].odds
          //     : sortedSection[2].odds[0].odds,
          //   sortedSection[2].odds[1].oname == "lay1"
          //     ? sortedSection[2].odds[1].size
          //     : sortedSection[2].odds[0].size,
          //   sortedSection[1].odds[0].oname == "back1"
          //     ? sortedSection[1].odds[0].odds
          //     : sortedSection[1].odds[1].odds,
          //   sortedSection[1].odds[0].oname == "back1"
          //     ? sortedSection[1].odds[0].size
          //     : sortedSection[1].odds[1].size,
          //   sortedSection[1].odds[1].oname == "lay1"
          //     ? sortedSection[1].odds[1].odds
          //     : sortedSection[1].odds[0].odds,
          //   sortedSection[1].odds[1].oname == "lay1"
          //     ? sortedSection[1].odds[1].size
          //     : sortedSection[1].odds[0].size,
          //   eventId,
          //   soccer.gmid,
          //   eventName,
          //   sortedSection[0].nat,
          //   sortedSection[2].nat,
          //   sortedSection[1].nat,
          //   soccer.status,
          //   sortedSection[0].gstatus,
          //   sortedSection[2].gstatus,
          //   sortedSection[1].gstatus,
          //   soccer.iplay,
          //   sortedSection[0].odds[0].oname == "back1"
          //     ? sortedSection[0].odds[0].odds
          //     : sortedSection[0].odds[1].odds,
          //   sortedSection[0].odds[0].oname == "back1"
          //     ? sortedSection[0].odds[0].size
          //     : sortedSection[0].odds[1].size,
          //   sortedSection[0].odds[1].oname == "lay1"
          //     ? sortedSection[0].odds[1].odds
          //     : sortedSection[0].odds[0].odds,
          //   sortedSection[0].odds[1].oname == "lay1"
          //     ? sortedSection[0].odds[1].size
          //     : sortedSection[0].odds[0].size,
          //   sortedSection[2].odds[0].oname == "back1"
          //     ? sortedSection[2].odds[0].odds
          //     : sortedSection[2].odds[1].odds,
          //   sortedSection[2].odds[0].oname == "back1"
          //     ? sortedSection[2].odds[0].size
          //     : sortedSection[2].odds[1].size,
          //   sortedSection[2].odds[1].oname == "lay1"
          //     ? sortedSection[2].odds[1].odds
          //     : sortedSection[2].odds[0].odds,
          //   sortedSection[2].odds[1].oname == "lay1"
          //     ? sortedSection[2].odds[1].size
          //     : sortedSection[2].odds[0].size,
          //   sortedSection[1].odds[0].oname == "back1"
          //     ? sortedSection[1].odds[0].odds
          //     : sortedSection[1].odds[1].odds,
          //   sortedSection[1].odds[0].oname == "back1"
          //     ? sortedSection[1].odds[0].size
          //     : sortedSection[1].odds[1].size,
          //   sortedSection[1].odds[1].oname == "lay1"
          //     ? sortedSection[1].odds[1].odds
          //     : sortedSection[1].odds[0].odds,
          //   sortedSection[1].odds[1].oname == "lay1"
          //     ? sortedSection[1].odds[1].size
          //     : sortedSection[1].odds[0].size,
          // ];

          _context4.next = 19;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query(sql_query, values, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 19:
          _context4.next = 22;
          break;

        case 21:
          console.log("soccer data null for " + eventId);

        case 22:
          _context4.next = 25;
          break;

        case 24:
          console.log("Soccer data is null for " + eventId);

        case 25:
          _context4.next = 30;
          break;

        case 27:
          _context4.prev = 27;
          _context4.t0 = _context4["catch"](0);

          if (axios.isCancel(_context4.t0)) {
            console.log("Request canceled due to timeout", _context4.t0.message);
          } else {
            console.log(_context4.t0);
            console.error("An error occurred-->", eventId);
          }

        case 30:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 27]]);
}

function getRunners(text) {
  var words = text.split(" ");
  var teamNames = [];

  for (var i = 0; i < words.length; i++) {
    var currentWord = words[i].trim();

    if (currentWord && currentWord !== "-" && currentWord.toLowerCase() !== "v") {
      var teamName = currentWord;

      for (var j = i + 1; j < words.length; j++) {
        var nextWord = words[j].trim();

        if (nextWord && nextWord !== "-" && nextWord.toLowerCase() !== "v") {
          teamName += " " + nextWord;
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

function filterSections(sectionArray) {
  sectionArray.sort(function (a, b) {
    if (a.nat === "The Draw" || a.nat === "Draw") return 1;
    if (b.nat === "The Draw" || b.nat === "Draw") return -1;
    return a.nat.localeCompare(b.nat);
  }); // sectionArray.sort((a, b) => a.sno - b.sno)

  return sectionArray;
} // store soccer competition Ids


storeSoccerCompetitions = function storeSoccerCompetitions() {
  var test, response, competitions, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop2, _iterator2, _step2;

  return regeneratorRuntime.async(function storeSoccerCompetitions$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          test = [];
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "fetch_data?Action=listCompetitions&EventTypeID=1"));

        case 4:
          response = _context6.sent;
          competitions = response.data;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context6.prev = 9;

          _loop2 = function _loop2() {
            var competition, _result;

            return regeneratorRuntime.async(function _loop2$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    competition = _step2.value;
                    _context5.prev = 1;
                    _context5.next = 4;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      dbConn.query("REPLACE INTO soccercompetitions(competition_id,competition_name) values(?,?)", [competition.competition.id, competition.competition.name], function (err, res) {
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
                    _result = _context5.sent;
                    test.push(_result);
                    _context5.next = 12;
                    break;

                  case 8:
                    _context5.prev = 8;
                    _context5.t0 = _context5["catch"](1);
                    console.error(_context5.t0);
                    result(_context5.t0, null);

                  case 12:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[1, 8]]);
          };

          _iterator2 = competitions[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context6.next = 18;
            break;
          }

          _context6.next = 15;
          return regeneratorRuntime.awrap(_loop2());

        case 15:
          _iteratorNormalCompletion2 = true;
          _context6.next = 12;
          break;

        case 18:
          _context6.next = 24;
          break;

        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](9);
          _didIteratorError2 = true;
          _iteratorError2 = _context6.t0;

        case 24:
          _context6.prev = 24;
          _context6.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context6.prev = 27;

          if (!_didIteratorError2) {
            _context6.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context6.finish(27);

        case 31:
          return _context6.finish(24);

        case 32:
          return _context6.abrupt("return", test);

        case 35:
          _context6.prev = 35;
          _context6.t1 = _context6["catch"](1);
          console.error(_context6.t1);

        case 38:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 35], [9, 20, 24, 32], [25,, 27, 31]]);
}; //store soccer events based on competiotion Ids


storeSoccerEvents = function storeSoccerEvents(competitions) {
  var eventList, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _loop3, _iterator3, _step3;

  return regeneratorRuntime.async(function storeSoccerEvents$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          eventList = [];
          _context9.prev = 1;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context9.prev = 5;

          _loop3 = function _loop3() {
            var competition, response, events, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _loop4, _iterator4, _step4;

            return regeneratorRuntime.async(function _loop3$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    competition = _step3.value;
                    _context8.next = 3;
                    return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "fetch_data?Action=listEvents&EventTypeID=1&CompetitionID=" + competition));

                  case 3:
                    response = _context8.sent;
                    events = response.data;
                    _iteratorNormalCompletion4 = true;
                    _didIteratorError4 = false;
                    _iteratorError4 = undefined;
                    _context8.prev = 8;

                    _loop4 = function _loop4() {
                      var event, _result2;

                      return regeneratorRuntime.async(function _loop4$(_context7) {
                        while (1) {
                          switch (_context7.prev = _context7.next) {
                            case 0:
                              event = _step4.value;
                              _context7.prev = 1;
                              _context7.next = 4;
                              return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                                var event_date = moment(event.event.openDate).format("YYYY-MM-DD HH:mm:ss");
                                dbConn.query("REPLACE INTO soccerevents(competition_id,event_id,event_name,open_date,timezone) values(?,?,?,?,?)", [competition, event.event.id, event.event.name, event_date, event.event.timezone], function (err, res) {
                                  if (err) {
                                    console.log(err);
                                    reject(err);
                                  } else {
                                    var insertedId = res.insertId;
                                    resolve(event.event.id);
                                  }
                                });
                              }));

                            case 4:
                              _result2 = _context7.sent;
                              eventList.push(_result2);
                              _context7.next = 12;
                              break;

                            case 8:
                              _context7.prev = 8;
                              _context7.t0 = _context7["catch"](1);
                              console.error(_context7.t0);
                              result(_context7.t0, null);

                            case 12:
                            case "end":
                              return _context7.stop();
                          }
                        }
                      }, null, null, [[1, 8]]);
                    };

                    _iterator4 = events[Symbol.iterator]();

                  case 11:
                    if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                      _context8.next = 17;
                      break;
                    }

                    _context8.next = 14;
                    return regeneratorRuntime.awrap(_loop4());

                  case 14:
                    _iteratorNormalCompletion4 = true;
                    _context8.next = 11;
                    break;

                  case 17:
                    _context8.next = 23;
                    break;

                  case 19:
                    _context8.prev = 19;
                    _context8.t0 = _context8["catch"](8);
                    _didIteratorError4 = true;
                    _iteratorError4 = _context8.t0;

                  case 23:
                    _context8.prev = 23;
                    _context8.prev = 24;

                    if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                      _iterator4["return"]();
                    }

                  case 26:
                    _context8.prev = 26;

                    if (!_didIteratorError4) {
                      _context8.next = 29;
                      break;
                    }

                    throw _iteratorError4;

                  case 29:
                    return _context8.finish(26);

                  case 30:
                    return _context8.finish(23);

                  case 31:
                  case "end":
                    return _context8.stop();
                }
              }
            }, null, null, [[8, 19, 23, 31], [24,, 26, 30]]);
          };

          _iterator3 = competitions[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context9.next = 14;
            break;
          }

          _context9.next = 11;
          return regeneratorRuntime.awrap(_loop3());

        case 11:
          _iteratorNormalCompletion3 = true;
          _context9.next = 8;
          break;

        case 14:
          _context9.next = 20;
          break;

        case 16:
          _context9.prev = 16;
          _context9.t0 = _context9["catch"](5);
          _didIteratorError3 = true;
          _iteratorError3 = _context9.t0;

        case 20:
          _context9.prev = 20;
          _context9.prev = 21;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 23:
          _context9.prev = 23;

          if (!_didIteratorError3) {
            _context9.next = 26;
            break;
          }

          throw _iteratorError3;

        case 26:
          return _context9.finish(23);

        case 27:
          return _context9.finish(20);

        case 28:
          return _context9.abrupt("return", eventList);

        case 31:
          _context9.prev = 31;
          _context9.t1 = _context9["catch"](1);
          console.error(_context9.t1);

        case 34:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 31], [5, 16, 20, 28], [21,, 23, 27]]);
}; //store soccer markets based on event ids


storeSoccerMarkets2 = function storeSoccerMarkets2(events) {
  var marketList, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _loop5, _iterator5, _step5;

  return regeneratorRuntime.async(function storeSoccerMarkets2$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          marketList = [];
          dbConn.query("truncate table soccermarkets", function (err, res) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log("truncated");
            }
          });
          _context11.prev = 2;
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context11.prev = 6;

          _loop5 = function _loop5() {
            var event, response, market, _result3;

            return regeneratorRuntime.async(function _loop5$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    event = _step5.value;
                    _context10.next = 3;
                    return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "fetch_data?Action=listMarketTypes&EventID=" + event));

                  case 3:
                    response = _context10.sent;
                    market = response.data; // console.log("event", event);
                    // console.log("market--->", market);

                    _context10.prev = 5;
                    _context10.next = 8;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var runnerlist = [];

                      for (var i = 0; i < 3; i++) {
                        if (market[0].runners[i]) {
                          runnerlist.push(market[0].runners[i].runnerName);
                        } else {
                          runnerlist.push(null);
                        }
                      }

                      dbConn.query("REPLACE INTO soccermarkets(event_id,market_id,market_name,start_time,runner1,runner2,runner3) values(?,?,?,?,?,?,?)", [event, market[0].marketId, market[0].marketName, moment(market[0].marketStartTime).format("YYYY-MM-DD HH:mm:ss"), runnerlist[0], runnerlist[1], runnerlist[2]], function (err, res) {
                        if (err) {
                          console.log(err);
                          reject(err);
                        } else {
                          var insertedId = res.insertId;
                          resolve(market[0].marketId);
                        }
                      });
                    }));

                  case 8:
                    _result3 = _context10.sent;
                    marketList.push(_result3);
                    _context10.next = 16;
                    break;

                  case 12:
                    _context10.prev = 12;
                    _context10.t0 = _context10["catch"](5);
                    console.error(_context10.t0);
                    result(_context10.t0, null);

                  case 16:
                  case "end":
                    return _context10.stop();
                }
              }
            }, null, null, [[5, 12]]);
          };

          _iterator5 = events[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context11.next = 15;
            break;
          }

          _context11.next = 12;
          return regeneratorRuntime.awrap(_loop5());

        case 12:
          _iteratorNormalCompletion5 = true;
          _context11.next = 9;
          break;

        case 15:
          _context11.next = 21;
          break;

        case 17:
          _context11.prev = 17;
          _context11.t0 = _context11["catch"](6);
          _didIteratorError5 = true;
          _iteratorError5 = _context11.t0;

        case 21:
          _context11.prev = 21;
          _context11.prev = 22;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 24:
          _context11.prev = 24;

          if (!_didIteratorError5) {
            _context11.next = 27;
            break;
          }

          throw _iteratorError5;

        case 27:
          return _context11.finish(24);

        case 28:
          return _context11.finish(21);

        case 29:
          return _context11.abrupt("return", marketList);

        case 32:
          _context11.prev = 32;
          _context11.t1 = _context11["catch"](2);
          console.error(_context11.t1);

        case 35:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[2, 32], [6, 17, 21, 29], [22,, 24, 28]]);
}; //store soccer odds based on market ids


storeSoccerOdds2 = function storeSoccerOdds2() {
  var markets, market_ids;
  return regeneratorRuntime.async(function storeSoccerOdds2$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query("select market_id from soccermarkets", function (err, res) {
              if (err) {
                reject(err);
              } else {
                var _market_ids = res.map(function (m) {
                  return m.market_id;
                });

                var response = {
                  markets: res,
                  market_ids: _market_ids.join(",")
                };
                resolve(response);
              }
            });
          }));

        case 2:
          markets = _context12.sent;
          // console.log("Soccer markets-->", markets.market_ids.split(","));
          // console.log("divided--->", this.chunkIntoN(markets.market_ids.split(","), 5));
          market_ids = this.chunkIntoN(markets.market_ids.split(","), 5);
          this.storeSoccerOddsPromise(market_ids);

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  }, null, this);
};

storeSoccerMarketOdds = function storeSoccerMarketOdds(market_ids) {
  var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _result4;

  return regeneratorRuntime.async(function storeSoccerMarketOdds$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(axios.get(process.env.API_URL + "listMarketBookOdds?market_id=" + market_ids));

        case 2:
          market_odds = _context13.sent;
          market_odds = market_odds.data;
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context13.prev = 7;
          _iterator6 = market_odds[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context13.next = 18;
            break;
          }

          market = _step6.value;

          if (!(market.market == "Match Odds")) {
            _context13.next = 15;
            break;
          }

          _context13.next = 14;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var sql_query = ""; //for runner length 1

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

              sql_query = "insert into soccerodds(event_id,market_id,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size)values(?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?";
              values = [market.eventid, market.marketId, market.runners[0].runner, null, market.status, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size, market.eventid, market.marketId, market.runners[0].runner, null, market.status, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size];
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

              sql_query = "insert into soccerodds(event_id,market_id,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?";
              values = [market.eventid, market.marketId, market.runners[0].runner, market.runners[1].runner, market.status, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size, market.runners[1].ex.availableToBack[0].price, market.runners[1].ex.availableToBack[0].size, market.runners[1].ex.availableToLay[0].price, market.runners[1].ex.availableToLay[0].size, market.eventid, market.marketId, market.runners[0].runner, market.runners[1].runner, market.status, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size, market.runners[1].ex.availableToBack[0].price, market.runners[1].ex.availableToBack[0].size, market.runners[1].ex.availableToLay[0].price, market.runners[1].ex.availableToLay[0].size];
            }

            if (market.runners.length == 3) {
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

              if (market.runners[2].ex.availableToBack.length == 0) {
                market.runners[2].ex.availableToBack = [{
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

              if (market.runners[2].ex.availableToLay.length == 0) {
                market.runners[2].ex.availableToLay = [{
                  price: 0,
                  size: 0
                }];
              }

              sql_query = "insert into soccerodds(event_id,market_id,runner1,runner2,runner3,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,runner3=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?";
              values = [market.eventid, market.marketId, market.runners[0].runner, market.runners[1].runner, market.runners[2].runner, market.status, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size, market.runners[1].ex.availableToBack[0].price, market.runners[1].ex.availableToBack[0].size, market.runners[1].ex.availableToLay[0].price, market.runners[1].ex.availableToLay[0].size, market.runners[2].ex.availableToBack[0].price, market.runners[2].ex.availableToBack[0].size, market.runners[2].ex.availableToLay[0].price, market.runners[2].ex.availableToLay[0].size, market.eventid, market.marketId, market.runners[0].runner, market.runners[1].runner, market.runners[2].runner, market.status, market.inplay, market.runners[0].ex.availableToBack[0].price, market.runners[0].ex.availableToBack[0].size, market.runners[0].ex.availableToLay[0].price, market.runners[0].ex.availableToLay[0].size, market.runners[1].ex.availableToBack[0].price, market.runners[1].ex.availableToBack[0].size, market.runners[1].ex.availableToLay[0].price, market.runners[1].ex.availableToLay[0].size, market.runners[2].ex.availableToBack[0].price, market.runners[2].ex.availableToBack[0].size, market.runners[2].ex.availableToLay[0].price, market.runners[2].ex.availableToLay[0].size];
            }

            dbConn.query(sql_query, values, function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 14:
          _result4 = _context13.sent;

        case 15:
          _iteratorNormalCompletion6 = true;
          _context13.next = 9;
          break;

        case 18:
          _context13.next = 24;
          break;

        case 20:
          _context13.prev = 20;
          _context13.t0 = _context13["catch"](7);
          _didIteratorError6 = true;
          _iteratorError6 = _context13.t0;

        case 24:
          _context13.prev = 24;
          _context13.prev = 25;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 27:
          _context13.prev = 27;

          if (!_didIteratorError6) {
            _context13.next = 30;
            break;
          }

          throw _iteratorError6;

        case 30:
          return _context13.finish(27);

        case 31:
          return _context13.finish(24);

        case 32:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[7, 20, 24, 32], [25,, 27, 31]]);
};

storeSoccerOddsPromise = function storeSoccerOddsPromise(market_ids) {
  return regeneratorRuntime.async(function storeSoccerOddsPromise$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          // Use Promise.all to execute functions in parallel
          Promise.all(market_ids.map(function (market_id) {
            return storeSoccerMarketOdds(market_id);
          })).then(function () {// console.log("All Soccer API calls and data storage completed.");
          })["catch"](function (error) {
            console.error("Error occurred: ".concat(error.message));
          });

        case 1:
        case "end":
          return _context14.stop();
      }
    }
  });
}; //divide markets array into n size


chunkIntoN = function chunkIntoN(array, n) {
  var result = [];
  var chunkSize = Math.ceil(array.length / n); // Calculate the size of each chunk

  for (var i = 0; i < array.length; i += chunkSize) {
    var chunk = array.slice(i, i + chunkSize); // Extract a chunk of the array

    result.push(chunk.join(",")); // Join the chunk elements with commas and push to the result array
  }

  return result;
};

module.exports = {
  storeSoccerCompetitions: storeSoccerCompetitions,
  storeSoccerEvents: storeSoccerEvents,
  storeSoccerMarkets: storeSoccerMarkets,
  storeSoccerOdds: storeSoccerOdds
};