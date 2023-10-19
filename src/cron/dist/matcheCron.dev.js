"use strict";

var cron = require("node-cron");

var moment = require("moment");

var _require = require("../controllers/bookmaker.controller"),
    getBookList = _require.getBookList;

var _require2 = require("../controllers/newsoccer.controller"),
    saveSoccerData = _require2.saveSoccerData;

var _require3 = require("./getfunctions"),
    storeCompetitions = _require3.storeCompetitions,
    storeEvents = _require3.storeEvents,
    storeMarkets = _require3.storeMarkets,
    storeSession = _require3.storeSession,
    storeMatchOdds = _require3.storeMatchOdds,
    storeFancy = _require3.storeFancy,
    storeNewMatchOdds = _require3.storeNewMatchOdds,
    storeNewBookOdds = _require3.storeNewBookOdds;

var _require4 = require("./getTennisFunctions"),
    storeTennisCompetitions = _require4.storeTennisCompetitions,
    storeTennisEvents = _require4.storeTennisEvents,
    storeTennisMarkets = _require4.storeTennisMarkets,
    storeTennisOdds = _require4.storeTennisOdds;

var _require5 = require("./getSoccerFunctions"),
    storeSoccerCompetitions = _require5.storeSoccerCompetitions,
    storeSoccerEvents = _require5.storeSoccerEvents,
    storeSoccerMarkets = _require5.storeSoccerMarkets,
    storeSoccerOdds = _require5.storeSoccerOdds;

var deleteMethods = require("./deleteFunctions");

function getCricketData() {
  var matchOddList;
  return regeneratorRuntime.async(function getCricketData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(storeMarkets());

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(storeNewMatchOdds());

        case 4:
          matchOddList = _context.sent;

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getcompetitions() {
  var competitionList, eventList, marketList, sessionList, matchOddList;
  return regeneratorRuntime.async(function getcompetitions$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(storeCompetitions());

        case 2:
          competitionList = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(storeEvents(competitionList));

        case 5:
          eventList = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(storeMarkets(eventList));

        case 8:
          marketList = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(storeSession());

        case 11:
          sessionList = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(storeMatchOdds());

        case 14:
          matchOddList = _context2.sent;

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function test() {
  var cron3, cronJobSession, cronJobFancy, cronJobMatchOdds, cronJobBookOdds;
  return regeneratorRuntime.async(function test$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(getCricketData());

        case 2:
          cron3 = cron.schedule("0 */15 * * * *", getCricketData, false);
          cronJobSession = cron.schedule("*/3 * * * * *", storeSession, false);
          cronJobFancy = cron.schedule("*/3 * * * * *", storeFancy, false);
          cronJobMatchOdds = cron.schedule("*/1 * * * * *", storeNewMatchOdds, false);
          cronJobBookOdds = cron.schedule("*/1 * * * * *", storeNewBookOdds, false);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}

test(); // function calls for soccer

function getSoccerData() {
  return regeneratorRuntime.async(function getSoccerData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(storeSoccerMarkets());

        case 2:
          _context4.next = 4;
          return regeneratorRuntime.awrap(storeSoccerOdds());

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
} //cron for soccer


function SoccerCron() {
  var cronSoccer, cronJobSoccerOdds;
  return regeneratorRuntime.async(function SoccerCron$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(getSoccerData());

        case 2:
          cronSoccer = cron.schedule("0 */30 * * * *", function () {
            getSoccerData();
          }, false);
          cronJobSoccerOdds = cron.schedule("*/1 * * * * *", function () {
            storeSoccerOdds();
          }, false);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
}

SoccerCron(); // function calls for tennis

function getTennisData() {
  return regeneratorRuntime.async(function getTennisData$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(storeTennisMarkets());

        case 2:
          _context6.next = 4;
          return regeneratorRuntime.awrap(storeTennisOdds());

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
} //cron for tennis


function TennisCron() {
  var cronTennis, cronJobTennishOdds;
  return regeneratorRuntime.async(function TennisCron$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(getTennisData());

        case 2:
          cronTennis = cron.schedule("0 */30 * * * *", function () {
            getTennisData();
          }, false);
          cronJobTennishOdds = cron.schedule("*/1 * * * * *", function () {
            storeTennisOdds();
          }, false);

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
}

TennisCron(); // async function bookMakerCompetitions() {
//   const cronJobTennishOdds = cron.schedule(
//     "*/6 * * * * *",
//     () => {
//       getBookList();
//     },
//     false
//   );
// }
// bookMakerCompetitions();

function newSoccerCompetitions() {
  var cronJobTennishOdds;
  return regeneratorRuntime.async(function newSoccerCompetitions$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          cronJobTennishOdds = cron.schedule("*/6 * * * * *", function () {
            saveSoccerData();
          }, false);

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
} //newSoccerCompetitions();
// function calls for tennis


function getTennisCompetitions() {
  var tennisCompetitionList, tennisEventList, tennisMarketList, matchOddList;
  return regeneratorRuntime.async(function getTennisCompetitions$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(storeTennisCompetitions());

        case 2:
          tennisCompetitionList = _context9.sent;
          _context9.next = 5;
          return regeneratorRuntime.awrap(storeTennisEvents(tennisCompetitionList));

        case 5:
          tennisEventList = _context9.sent;
          _context9.next = 8;
          return regeneratorRuntime.awrap(storeTennisMarkets(tennisEventList));

        case 8:
          tennisMarketList = _context9.sent;
          _context9.next = 11;
          return regeneratorRuntime.awrap(storeTennisOdds());

        case 11:
          matchOddList = _context9.sent;

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  });
} //cron for tennis


function TennisCron_old() {
  var cronTennis, cronJobTennishOdds;
  return regeneratorRuntime.async(function TennisCron_old$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(getTennisCompetitions());

        case 2:
          cronTennis = cron.schedule("0 */30 * * * *", function () {
            getTennisCompetitions();
          }, false);
          cronJobTennishOdds = cron.schedule("*/1 * * * * *", function () {
            storeTennisOdds();
          }, false);

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
} //TennisCron_old();
// function calls for soccer


function getSoccerCompetitions() {
  var soccerCompetitionList, soccerEventList, soccerMarketList, matchOddList;
  return regeneratorRuntime.async(function getSoccerCompetitions$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(storeSoccerCompetitions());

        case 2:
          soccerCompetitionList = _context11.sent;
          _context11.next = 5;
          return regeneratorRuntime.awrap(storeSoccerEvents(soccerCompetitionList));

        case 5:
          soccerEventList = _context11.sent;
          _context11.next = 8;
          return regeneratorRuntime.awrap(storeSoccerMarkets(soccerEventList));

        case 8:
          soccerMarketList = _context11.sent;
          _context11.next = 11;
          return regeneratorRuntime.awrap(storeSoccerOdds());

        case 11:
          matchOddList = _context11.sent;

        case 12:
        case "end":
          return _context11.stop();
      }
    }
  });
} //cron for soccer


function SoccerCron_old() {
  var cronSoccer, cronJobSoccerOdds;
  return regeneratorRuntime.async(function SoccerCron_old$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(getSoccerCompetitions());

        case 2:
          cronSoccer = cron.schedule("0 */30 * * * *", function () {
            getSoccerCompetitions();
          }, false);
          cronJobSoccerOdds = cron.schedule("*/1 * * * * *", function () {
            storeSoccerOdds();
          }, false);

        case 4:
        case "end":
          return _context12.stop();
      }
    }
  });
} // SoccerCron_old();


cron.schedule("0 0 0 */10 * *", function () {
  // This code will run every 10 days at midnight (00:00:00)
  console.log("Deletion cron started");
  deleteMethods.deleteCricketEvent();
  deleteMethods.deleteTennisEvent();
  deleteMethods.deleteSoccerEvent();
  deleteMethods.deleteCricketOdds();
  deleteMethods.deleteCricketSessions();
  deleteMethods.deleteTennisOdds();
  deleteMethods.deleteSoccerOdds();
  console.log("Deletion cron completed");
});
module.exports = {
  getcompetitions: getcompetitions,
  test: test
};