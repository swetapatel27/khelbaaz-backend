const cron = require("node-cron");
const moment = require("moment");
const { getBookList } = require("../controllers/bookmaker.controller");
const { saveSoccerData } = require("../controllers/newsoccer.controller");
const {
  storeCompetitions,
  storeEvents,
  storeMarkets,
  storeSession,
  storeMatchOdds,
  storeFancy,
  storeNewMatchOdds,
  storeNewBookOdds,
  storeBookMarkets,
} = require("./getfunctions");

const {
  storeTennisCompetitions,
  storeTennisEvents,
  storeTennisMarkets,
  storeTennisOdds,
} = require("./getTennisFunctions");

const {
  storeSoccerCompetitions,
  storeSoccerEvents,
  storeSoccerMarkets,
  storeSoccerOdds,
} = require("./getSoccerFunctions");

const deleteMethods = require("./deleteFunctions");

// async function getCricketData() {
//   await storeMarkets();
//   // console.log("-----------------markets added-----------");
//   // await storeSession();
//   // console.log("-----------------sessions added-----------");
//   const matchOddList = await storeNewMatchOdds();
//   // console.log("-----------------match odds added-----------");
//   // await storeNewBookOdds();
//   // console.log("-----------------book odds added-----------");
// }

async function getcompetitions() {
  const competitionList = await storeCompetitions();
  console.log("-----------------competitions added-----------");
  const eventList = await storeEvents(competitionList);
  console.log("-----------------events added-----------");
  // console.log("eventList--->", eventList);
  const marketList = await storeMarkets(eventList);
  console.log("-----------------markets added-----------");
  const sessionList = await storeSession();
  console.log("-----------------sessions added-----------");
  const fancyList = await storeFancy();
  console.log("-----------------fancy added-----------");
  const matchOddList = await storeNewMatchOdds();
  console.log("-----------------match odds added-----------");
  const BookerMarketList = await storeBookMarkets(eventList);
  console.log("-----------------Bookmaker markets added-----------");
  await storeNewBookOdds();
  console.log("-----------------Bookmaker odds added-----------");
}

async function CricketCron() {
  await getcompetitions();
  const cron3 = cron.schedule("0 */30 * * * *", getcompetitions, false);
  const cronJobSession = cron.schedule("*/3 * * * * *", storeSession, false);
  const cronJobMatchOdds = cron.schedule(
    "*/1 * * * * *",
    storeNewMatchOdds,
    false
  );
  const cronJobBookmakerOdds = cron.schedule(
    "*/1 * * * * *",
    storeNewBookOdds,
    false
  );
  const cronJobFancy = cron.schedule("*/3 * * * * *", storeFancy, false);
}

// async function test() {
//   await getCricketData();
//   const cron3 = cron.schedule("0 */15 * * * *", getCricketData, false);
//   const cronJobSession = cron.schedule("*/3 * * * * *", storeSession, false);
//   const cronJobFancy = cron.schedule("*/3 * * * * *", storeFancy, false);
//   const cronJobMatchOdds = cron.schedule(
//     "*/1 * * * * *",
//     storeNewMatchOdds,
//     false
//   );
//   const cronJobBookOdds = cron.schedule(
//     "*/1 * * * * *",
//     storeNewBookOdds,
//     false
//   );
// }

CricketCron();

// function calls for tennis
async function getTennisCompetitions() {
  const tennisCompetitionList = await storeTennisCompetitions();
  console.log("-----------------Tennis competitions added-----------");
  const tennisEventList = await storeTennisEvents(tennisCompetitionList);
  console.log("-----------------Tennis events added-----------");
  const tennisMarketList = await storeTennisMarkets(tennisEventList);
  console.log("-----------------Tennis markets added-----------");
  const matchOddList = await storeTennisOdds();
  console.log("-----------------Tennis odds added-----------");
}

//cron for tennis
async function TennisCron() {
  await getTennisCompetitions();
  const cronTennis = cron.schedule(
    "0 */30 * * * *",
    () => {
      getTennisCompetitions();
    },
    false
  );
  const cronJobTennishOdds = cron.schedule(
    "*/2 * * * * *",
    () => {
      storeTennisOdds();
    },
    false
  );
}

TennisCron();

// function calls for soccer
async function getSoccerCompetitions() {
  const soccerCompetitionList = await storeSoccerCompetitions();
  console.log("-----------------Soccer competitions added-----------");
  const soccerEventList = await storeSoccerEvents(soccerCompetitionList);
  console.log("-----------------Soccer events added-----------");
  const soccerMarketList = await storeSoccerMarkets(soccerEventList);
  console.log("-----------------Soccer markets added-----------");
  const matchOddList = await storeSoccerOdds();
  //console.log("-----------------Soccer odds added-----------");
}

//cron for soccer
async function SoccerCron() {
  await getSoccerCompetitions();
  const cronSoccer = cron.schedule(
    "0 */30 * * * *",
    () => {
      getSoccerCompetitions();
    },
    false
  );
  const cronJobSoccerOdds = cron.schedule(
    "*/2 * * * * *",
    () => {
      storeSoccerOdds();
    },
    false
  );
}

SoccerCron();

cron.schedule("0 0 0 */10 * *", () => {
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
