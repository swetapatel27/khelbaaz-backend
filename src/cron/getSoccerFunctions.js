var dbConn = require("../../config/db");
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

// store soccer competition Ids
storeSoccerCompetitions = async function () {
  let test = [];
  try {
    const response = await axios.get(
      process.env.API_URL + "fetch_data?Action=listCompetitions&EventTypeID=1"
    );
    const competitions = response.data;

    for (const competition of competitions) {
      try {
        const result = await new Promise((resolve, reject) => {
          dbConn.query(
            "REPLACE INTO soccercompetitions(competition_id,competition_name) values(?,?)",
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

//store soccer events based on competiotion Ids
storeSoccerEvents = async function (competitions) {
  let eventList = [];
  try {
    for (const competition of competitions) {
      const response = await axios.get(
        process.env.API_URL +
          "fetch_data?Action=listEvents&EventTypeID=1&CompetitionID=" +
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
              "REPLACE INTO soccerevents(competition_id,event_id,event_name,open_date,timezone) values(?,?,?,?,?)",
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

//store soccer markets based on event ids
storeSoccerMarkets = async function (events) {
  let marketList = [];
  dbConn.query("truncate table soccermarkets", (err, res) => {
    if (err) {
      console.log(err);
      reject(err);
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
        if (market[0].marketName.toLowerCase() == "match odds") {
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
              "REPLACE INTO soccermarkets(event_id,market_id,event_name,market_name,start_time,runner1,runner2,runner3) values(?,?,?,?,?,?,?,?)",
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
        }
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

//store soccer odds based on market ids
storeSoccerOdds = async function () {
  const events = await new Promise((resolve, reject) => {
    dbConn.query(
      "select event_id,market_id,event_name from soccermarkets",
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
      fetchAndInsertSoccerOdds(eventId, marketId, eventName)
    )
  );
  console.log("All soccer odds fetched and inserted.");
};

async function fetchAndInsertSoccerOdds(eventId, marketId, eventName) {
  try {
    // console.log("odds-->", process.env.API_URL + "getOdds?eventId=" + eventId);
    const timeoutMilliseconds = 20000; // Adjust the timeout value as needed
    const soccer_odds = await axios.get(
      process.env.API_URL + "listMarketBookOdds?market_id=" + marketId,
      {
        timeout: timeoutMilliseconds,
      }
    );

    // Process and insert data into the database (modify the following code based on your needs)
    if (soccer_odds.data != null) {
      const soccerOdds = soccer_odds.data[0];
      // console.log("eventname-->", eventName);
      // console.log("event id,name-->", eventId, soccerOdds.ename);
      // Insert marketOdds into the database
      if (soccerOdds != null) {
        market = soccerOdds;
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
            "insert into soccerodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size)values(?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?";
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
            "insert into soccerodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?";
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
            "insert into soccerodds(event_id,market_id,event_name,runner1,runner2,runner3,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,runner3=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?";
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
        console.log("soccer data null for " + eventId);
      }
    } else {
      console.log("Soccer data is null for " + eventId);
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled due to timeout", error.message);
    } else {
      // console.log(error);
      console.error("An error occurred-->", eventId + ", " + marketId);
    }
  }
}



//store soccer odds based on market ids
storeSoccerOdds2 = async function () {
  const markets = await new Promise((resolve, reject) => {
    dbConn.query("select market_id from soccermarkets", (err, res) => {
      if (err) {
        reject(err);
      } else {
        let market_ids = res.map((m) => m.market_id);
        let response = { markets: res, market_ids: market_ids.join(",") };
        resolve(response);
      }
    });
  });
  // console.log("Soccer markets-->", markets.market_ids.split(","));
  // console.log("divided--->", this.chunkIntoN(markets.market_ids.split(","), 5));
  let market_ids = this.chunkIntoN(markets.market_ids.split(","), 5);
  this.storeSoccerOddsPromise(market_ids);
};

storeSoccerMarketOdds = async function (market_ids) {
  // console.log(
  //   "soccer-->",
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
            "insert into soccerodds(event_id,market_id,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size)values(?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?";
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
            "insert into soccerodds(event_id,market_id,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?";
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
            "insert into soccerodds(event_id,market_id,runner1,runner2,runner3,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,runner3=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?";
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

storeSoccerOddsPromise = async function (market_ids) {
  // Use Promise.all to execute functions in parallel
  Promise.all(market_ids.map((market_id) => storeSoccerMarketOdds(market_id)))
    .then(() => {
      // console.log("All Soccer API calls and data storage completed.");
    })
    .catch((error) => {
      console.error(`Error occurred: ${error.message}`);
    });
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
  storeSoccerCompetitions,
  storeSoccerEvents,
  storeSoccerMarkets,
  storeSoccerOdds,
};
