var dbConn = require("../../config/db");
const axios = require("axios");
const moment = require("moment");
const { validate } = require("node-cron");
require("dotenv").config();

// store tennis competition Ids
storeTennisCompetitions = async function () {
  let test = [];
  try {
    const response = await axios.get(
      process.env.API_URL + "fetch_data?Action=listCompetitions&EventTypeID=2"
    );
    const competitions = response.data;

    for (const competition of competitions) {
      try {
        const result = await new Promise((resolve, reject) => {
          dbConn.query(
            "REPLACE INTO tenniscompetitions(competition_id,competition_name) values(?,?)",
            [competition.competition.id, competition.competition.name],
            (err, res) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                const insertedId = res.insertId;
                resolve(competition.competition.id);
              }
            }
          );
        });
        test.push(result);
      } catch (err) {
        console.error(err);
        result(err, null);
      }
    }
    return test;
  } catch (error) {
    console.error(error);
  }
};

//store tennis events based on competiotion Ids
storeTennisEvents = async function (competitions) {
  let eventList = [];
  try {
    for (const competition of competitions) {
      const response = await axios.get(
        process.env.API_URL +
          "fetch_data?Action=listEvents&EventTypeID=2&CompetitionID=" +
          competition
      );
      const events = response.data;
      for (const event of events) {
        try {
          const result = await new Promise((resolve, reject) => {
            let event_date = moment(event.event.openDate).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            dbConn.query(
              "REPLACE INTO tennisevents(competition_id,event_id,event_name,open_date,timezone) values(?,?,?,?,?)",
              [
                competition,
                event.event.id,
                event.event.name,
                event_date,
                event.event.timezone,
              ],
              (err, res) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  const insertedId = res.insertId;
                  const event_data = {
                    event_id: event.event.id,
                    event_name: event.event.name,
                  };
                  resolve(event_data);
                }
              }
            );
          });
          eventList.push(result);
        } catch (err) {
          console.error(err);
          result(err, null);
        }
      }
    }
    return eventList;
  } catch (error) {
    console.error(error);
  }
};

//store tennis markets based on event ids
storeTennisMarkets = async function (events) {
  let marketList = [];
  dbConn.query("truncate table tennismarkets", (err, res) => {
    if (err) {
      console.log(err);
      // reject(err);
    } else {
      console.log("truncated");
    }
  });
  try {
    for (const event of events) {
      const response = await axios.get(
        process.env.API_URL +
          "fetch_data?Action=listMarketTypes&EventID=" +
          event.event_id
      );
      const market = response.data;
      // console.log("event", event);
      // console.log("market--->", market);
      try {
        const result = await new Promise((resolve, reject) => {
          let runnerlist = [];
          for (let i = 0; i < 3; i++) {
            if (market[0].runners[i]) {
              runnerlist.push(market[0].runners[i].runnerName);
            } else {
              runnerlist.push(null);
            }
          }

          dbConn.query(
            "REPLACE INTO tennismarkets(event_id,market_id,event_name,market_name,start_time,runner1,runner2,runner3) values(?,?,?,?,?,?,?,?)",
            [
              event.event_id,
              market[0].marketId,
              event.event_name,
              market[0].marketName,
              moment(market[0].marketStartTime).format("YYYY-MM-DD HH:mm:ss"),
              runnerlist[0],
              runnerlist[1],
              runnerlist[2],
            ],
            (err, res) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                const insertedId = res.insertId;
                resolve(market[0].marketId);
              }
            }
          );
        });
        marketList.push(result);
      } catch (err) {
        console.error(err);
        result(err, null);
      }
    }
    return marketList;
  } catch (error) {
    console.error(error);
  }
};

//store tennis odds based on market ids
storeTennisOdds = async function () {
  const events = await new Promise((resolve, reject) => {
    dbConn.query(
      "select event_id,market_id,event_name from tennismarkets",
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const eventInfo = res.map((e) => ({
            eventId: e.event_id,
            marketId: e.market_id,
            eventName: e.event_name,
          }));
          resolve(eventInfo);
        }
      }
    );
  });

  // Fetch and insert market odds for all events in parallel
  await Promise.all(
    events.map(({ eventId, marketId, eventName }) =>
      fetchAndInsertTennisOdds(eventId, marketId, eventName)
    )
  );
  console.log("All tennis odds fetched and inserted.");
};

async function fetchAndInsertTennisOdds(eventId, marketId, eventName) {
  try {
    // console.log("odds-->", process.env.API_URL + "getOdds?eventId=" + eventId);
    const timeoutMilliseconds = 20000; // Adjust the timeout value as needed
    const tennis_odds = await axios.get(
      process.env.API_URL + "listMarketBookOdds?market_id=" + marketId,
      {
        timeout: timeoutMilliseconds,
      }
    );
    // Process and insert data into the database (modify the following code based on your needs)
    if (tennis_odds.data != null) {
      const tennisOdds = tennis_odds.data[0];
      // console.log("eventname-->", eventName);
      // console.log("event id,name-->", tennisOdds.eventid);
      // Insert marketOdds into the database
      if (tennisOdds != null) {
        market = tennisOdds;
        // console.log("event id-->", eventId);
        // console.log("event name -->", tennis.ename);
        let sql_query = "";
        //for runner length 1
        if (market.runners.length == 1) {
          if (market.runners[0].ex.availableToBack.length == 0) {
            market.runners[0].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[0].ex.availableToLay.length == 0) {
            market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          sql_query =
            "insert into tennisodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size)values(?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?";
          values = [
            market.eventid,
            market.marketId,
            eventName,
            market.runners[0].runner,
            null,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.eventid,
            market.marketId,
            eventName,
            market.runners[0].runner,
            null,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
          ];
        }
        // for runner length 2
        if (market.runners.length == 2) {
          if (market.runners[0].ex.availableToBack.length == 0) {
            market.runners[0].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[1].ex.availableToBack.length == 0) {
            market.runners[1].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[0].ex.availableToLay.length == 0) {
            market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          if (market.runners[1].ex.availableToLay.length == 0) {
            market.runners[1].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          sql_query =
            "insert into tennisodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?";
          values = [
            market.eventid,
            market.marketId,
            eventName,
            market.runners[0].runner,
            market.runners[1].runner,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
            market.eventid,
            market.marketId,
            eventName,
            market.runners[0].runner,
            market.runners[1].runner,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
          ];
        }
        if (market.runners.length == 3) {
          if (market.runners[0].ex.availableToBack.length == 0) {
            market.runners[0].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[1].ex.availableToBack.length == 0) {
            market.runners[1].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[2].ex.availableToBack.length == 0) {
            market.runners[2].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[0].ex.availableToLay.length == 0) {
            market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          if (market.runners[1].ex.availableToLay.length == 0) {
            market.runners[1].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          if (market.runners[2].ex.availableToLay.length == 0) {
            market.runners[2].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          sql_query =
            "insert into tennisodds(event_id,market_id,event_name,runner1,runner2,runner3,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,runner3=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?";
          values = [
            market.eventid,
            market.marketId,
            eventName,
            market.runners[0].runner,
            market.runners[1].runner,
            market.runners[2].runner,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
            market.runners[2].ex.availableToBack[0].price,
            market.runners[2].ex.availableToBack[0].size,
            market.runners[2].ex.availableToLay[0].price,
            market.runners[2].ex.availableToLay[0].size,
            market.eventid,
            market.marketId,
            eventName,
            market.runners[0].runner,
            market.runners[1].runner,
            market.runners[2].runner,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
            market.runners[2].ex.availableToBack[0].price,
            market.runners[2].ex.availableToBack[0].size,
            market.runners[2].ex.availableToLay[0].price,
            market.runners[2].ex.availableToLay[0].size,
          ];
        }
        await new Promise((resolve, reject) => {
          dbConn.query(sql_query, values, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        });
      } else {
        console.log("tennis data null for " + eventId);
      }
    } else {
      console.log("No Data for tennis event", eventId);
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled due to timeout", error.message);
    } else {
      // console.log(error);
      console.error(
        "An error occurred or not data for -->",
        eventId + ", " + marketId
      );
    }
  }
}

//store tennis odds based on market ids
storeTennisOdds_old = async function () {
  const markets = await new Promise((resolve, reject) => {
    dbConn.query("select market_id from tennismarkets", (err, res) => {
      if (err) {
        reject(err);
      } else {
        let market_ids = res.map((m) => m.market_id);
        let response = { markets: res, market_ids: market_ids.join(",") };
        resolve(response);
      }
    });
  });
  // console.log("Tennis markets-->", markets.market_ids.split(","));
  // console.log("divided--->", this.chunkIntoN(markets.market_ids.split(","), 5));
  let market_ids = this.chunkIntoN(markets.market_ids.split(","), 5);
  // console.log("splited market ids-->", market_ids);
  this.storeTennisOddsPromise(market_ids);
};

storeTennisOddsPromise = async function (market_ids) {
  Promise.all(market_ids.map((market_id) => storeTennisMarketOdds(market_id)))
    .then(() => {
      // console.log("All Tennis API calls and data storage completed.");
    })
    .catch((error) => {
      console.error(`Error occurred: ${error.message}`);
    });
};

storeTennisMarketOdds = async function (market_ids) {
  // console.log(
  //   "tennis-->",
  //   process.env.API_URL + "listMarketBookOdds?market_id=" + market_ids
  // );
  market_odds = await axios.get(
    process.env.API_URL + "listMarketBookOdds?market_id=" + market_ids
  );
  market_odds = market_odds.data;

  for (market of market_odds) {
    // console.log("market--->", market);
    if (market.market == "Match Odds") {
      const result = await new Promise((resolve, reject) => {
        let sql_query = "";
        //for runner length 1
        if (market.runners.length == 1) {
          if (market.runners[0].ex.availableToBack.length == 0) {
            market.runners[0].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[0].ex.availableToLay.length == 0) {
            market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          sql_query =
            "insert into tennisodds(event_id,market_id,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size)values(?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?";
          values = [
            market.eventid,
            market.marketId,
            market.runners[0].runner,
            null,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.eventid,
            market.marketId,
            market.runners[0].runner,
            null,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
          ];
        }
        // for runner length 2
        if (market.runners.length == 2) {
          if (market.runners[0].ex.availableToBack.length == 0) {
            market.runners[0].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[1].ex.availableToBack.length == 0) {
            market.runners[1].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[0].ex.availableToLay.length == 0) {
            market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          if (market.runners[1].ex.availableToLay.length == 0) {
            market.runners[1].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          sql_query =
            "insert into tennisodds(event_id,market_id,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?";
          values = [
            market.eventid,
            market.marketId,
            market.runners[0].runner,
            market.runners[1].runner,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
            market.eventid,
            market.marketId,
            market.runners[0].runner,
            market.runners[1].runner,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
          ];
        }
        if (market.runners.length == 3) {
          if (market.runners[0].ex.availableToBack.length == 0) {
            market.runners[0].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[1].ex.availableToBack.length == 0) {
            market.runners[1].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[2].ex.availableToBack.length == 0) {
            market.runners[2].ex.availableToBack = [{ price: 0, size: 0 }];
          }
          if (market.runners[0].ex.availableToLay.length == 0) {
            market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          if (market.runners[1].ex.availableToLay.length == 0) {
            market.runners[1].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          if (market.runners[2].ex.availableToLay.length == 0) {
            market.runners[2].ex.availableToLay = [{ price: 0, size: 0 }];
          }
          sql_query =
            "insert into tennisodds(event_id,market_id,runner1,runner2,runner3,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,runner3=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?";
          values = [
            market.eventid,
            market.marketId,
            market.runners[0].runner,
            market.runners[1].runner,
            market.runners[2].runner,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
            market.runners[2].ex.availableToBack[0].price,
            market.runners[2].ex.availableToBack[0].size,
            market.runners[2].ex.availableToLay[0].price,
            market.runners[2].ex.availableToLay[0].size,
            market.eventid,
            market.marketId,
            market.runners[0].runner,
            market.runners[1].runner,
            market.runners[2].runner,
            market.status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
            market.runners[2].ex.availableToBack[0].price,
            market.runners[2].ex.availableToBack[0].size,
            market.runners[2].ex.availableToLay[0].price,
            market.runners[2].ex.availableToLay[0].size,
          ];
        }
        dbConn.query(sql_query, values, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    }
  }
};

//divide markets array into n size
chunkIntoN = function (array, n) {
  const result = [];
  const chunkSize = Math.ceil(array.length / n); // Calculate the size of each chunk
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize); // Extract a chunk of the array
    result.push(chunk.join(",")); // Join the chunk elements with commas and push to the result array
  }
  return result;
};

module.exports = {
  storeTennisCompetitions,
  storeTennisEvents,
  storeTennisMarkets,
  storeTennisOdds,
};
