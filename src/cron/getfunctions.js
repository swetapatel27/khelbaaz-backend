var dbConn = require("./../../config/db");
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

storeCompetitions = async function () {
  let test = [];
  try {
    const response = await axios.get(
      process.env.API_URL + "fetch_data?Action=listCompetitions&EventTypeID=4"
    );
    const competitions = response.data;

    for (const competition of competitions) {
      try {
        const result = await new Promise((resolve, reject) => {
          dbConn.query(
            "REPLACE INTO competitions(competition_id,competition_name) values(?,?)",
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

storeEvents = async function (competitions) {
  let eventList = [];
  try {
    for (const competition of competitions) {
      // console.log("comp-->",competition);
      const response = await axios.get(
        process.env.API_URL +
          "fetch_data?Action=listEvents&EventTypeID=4&CompetitionID=" +
          competition
      );
      const events = response.data;

      // console.log("events of comp",events);
      for (const event of events) {
        try {
          const result = await new Promise((resolve, reject) => {
            // console.log("single event",event);
            let event_date = moment(event.event.openDate).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            dbConn.query(
              "REPLACE INTO events(competition_id,event_id,event_name,open_date,timezone) values(?,?,?,?,?)",
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

storeMarkets = async function (events) {
  let marketList = [];
  dbConn.query("truncate table markets", (err, res) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      console.log("truncated");
    }
  });
  try {
    for (const event of events) {
      // console.log("event-->", event);
      const response = await axios.get(
        process.env.API_URL +
          "fetch_data?Action=listMarketTypes&EventID=" +
          event.event_id
      );
      const market = response.data;
      if (market[0].marketName.toLowerCase() == "match odds") {
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
              "REPLACE INTO markets(event_id,market_id,event_name,market_name,start_time,runner1,runner2,draw) values(?,?,?,?,?,?,?,?)",
              [
                event.event_id,
                market[0].marketId,
                event.event_name,
                market[0].marketName,
                market[0].marketStartTime === ""
                  ? "0001-01-01 00:00:00"
                  : moment(market[0].marketStartTime).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
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
    }
    return marketList;
  } catch (error) {
    console.error(error);
  }
};

// storeMatchOdds = async function () {
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

storeNewMatchOdds = async function () {
  const events = await new Promise((resolve, reject) => {
    dbConn.query(
      "select event_id,market_id,event_name,runner1,runner2 from markets",
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          //const eventIds = res.map((e) => e.event_id);
          const eventInfo = res.map((e) => ({
            eventId: e.event_id,
            marketId: e.market_id,
            eventName: e.event_name,
            runner1: e.runner1,
            runner2: e.runner2,
          }));
          resolve(eventInfo);
        }
      }
    );
  });

  // Fetch and insert market odds for all events in parallel
  await Promise.all(
    events.map(({ eventId, marketId, eventName, runner1, runner2 }) =>
      fetchAndInsertMarketOdds(eventId, marketId, eventName, runner1, runner2)
    )
    //eventIds.map((eventId) => fetchAndInsertMarketOdds(eventId))
  );
  console.log("All market odds fetched and inserted.");
};

storeSession = async function () {
  try {
    const events = await new Promise((resolve, reject) => {
      dbConn.query("select event_id, market_id from markets", (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const eventInfo = res.map((e) => ({
            event_id: e.event_id,
            market_id: e.market_id,
          }));
          resolve(eventInfo);
        }
      });
    });

    const promises = events.map(async ({ event_id, market_id }) => {
      try {
        const timeoutMilliseconds = 20000; // Adjust the timeout value as needed
        // console.log(
        //   "session----->",
        //   process.env.API_URL + "getOdds?eventId=" + event
        // );
        const session = await axios.get(
          process.env.API_URL + "listMarketBookSession?match_id=" + event_id,
          {
            timeout: timeoutMilliseconds,
          }
        );

        let sessions = session.data;
        if (sessions.length > 0) {
          sessions = sessions.filter((obj) => obj.gtype === "session");
          // console.log(sessions.length);
          const output = {
            event_id: event_id,
            market_id: market_id,
            sessions: sessions,
          };
          const insertionPromises = output.sessions.map((session) => {
            return new Promise((resolve, reject) => {
              query =
                "insert into sessions(event_id,market_id,runner_name,lay_price,lay_size,back_price,back_size,game_status,game_type,min,max)values(?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id =?,market_id=?,runner_name=?,lay_price=?,lay_size=?,back_price=?,back_size=?,game_status=?,game_type=?,min=?,max=?";
              dbConn.query(
                query,
                [
                  output.event_id,
                  output.market_id,
                  session.RunnerName,
                  session.LayPrice1,
                  session.LaySize1,
                  session.BackPrice1,
                  session.BackSize1,
                  session.GameStatus,
                  session.gtype,
                  session.min,
                  session.max,
                  output.event_id,
                  output.market_id,
                  session.RunnerName,
                  session.LayPrice1,
                  session.LaySize1,
                  session.BackPrice1,
                  session.BackSize1,
                  session.GameStatus,
                  session.gtype,
                  session.min,
                  session.max,
                ],
                (err, res) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
          });

          await Promise.all(insertionPromises);
        }
      } catch (error) {
        console.log("Session API Error ", event_id);
      }
    });
    await Promise.all(promises);
    console.log("sessions added");
  } catch (error) {
    console.log("error-->", error);
  }
};

storeFancy = async function () {
  try {
    const events = await new Promise((resolve, reject) => {
      dbConn.query("select event_id, market_id from markets", (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const eventInfo = res.map((e) => ({
            event_id: e.event_id,
            market_id: e.market_id,
          }));
          resolve(eventInfo);
        }
      });
    });

    const promises = events.map(async ({ event_id, market_id }) => {
      try {
        const timeoutMilliseconds = 20000; // Adjust the timeout value as needed
        // console.log(
        //   "session----->",
        //   process.env.API_URL + "getOdds?eventId=" + event
        // );
        const fancies = await axios.get(
          process.env.API_URL + "listMarketBookSession?match_id=" + event_id,
          {
            timeout: timeoutMilliseconds,
          }
        );

        let fancy = fancies.data;
        if (fancy.length > 0) {
          fancy = fancy.filter((obj) => obj.gtype === "fancy1");
          const output = {
            event_id: event_id,
            market_id: market_id,
            fancies: fancy,
          };
          const filteredToss = output.fancies.filter(
            (obj) =>
              obj.srno == 1 &&
              (obj.RunnerName.includes("toss") ||
                obj.RunnerName.includes("Toss"))
          );
          const insertionPromises = filteredToss.map((fancy) => {
            return new Promise((resolve, reject) => {
              query =
                "insert into fancies(event_id,market_id,runner_name,lay_price,lay_size,back_price,back_size,game_status,game_type,srno)values(?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id =?,market_id=?,runner_name=?,lay_price=?,lay_size=?,back_price=?,back_size=?,game_status=?,game_type=?,srno=?";
              dbConn.query(
                query,
                [
                  output.event_id,
                  output.market_id,
                  fancy.RunnerName,
                  fancy.LayPrice1,
                  fancy.LaySize1,
                  fancy.BackPrice1,
                  fancy.BackSize1,
                  fancy.GameStatus,
                  fancy.gtype,
                  fancy.srno,
                  output.event_id,
                  output.market_id,
                  fancy.RunnerName,
                  fancy.LayPrice1,
                  fancy.LaySize1,
                  fancy.BackPrice1,
                  fancy.BackSize1,
                  fancy.GameStatus,
                  fancy.gtype,
                  fancy.srno,
                ],
                (err, res) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
          });

          await Promise.all(insertionPromises);
        }
      } catch (error) {
        console.log("Fancy API Error", event_id);
      }
    });

    await Promise.all(promises);
    console.log("fancy added");
  } catch (error) {
    console.log("error-->", error);
  }
};

async function fetchAndInsertMarketOdds(
  eventId,
  marketId,
  eventName,
  p_runner1,
  p_runner2
) {
  try {
    let event_name = eventName;
    let runner1 = p_runner1;
    let runner2 = p_runner2;

    // console.log("odds-->", process.env.API_URL + "getOdds?eventId=" + eventId);
    const timeoutMilliseconds = 20000; // Adjust the timeout value as needed
    const market_odds = await axios.get(
      process.env.API_URL + "listMarketBookOdds?market_id=" + marketId,
      {
        timeout: timeoutMilliseconds,
      }
    );

    // Process and insert data into the database (modify the following code based on your needs)
    if (
      market_odds.status === 200 &&
      market_odds.statusText.toLowerCase() == "ok"
    ) {
      if (market_odds.data != null) {
        const market = market_odds.data[0];
        if (market.hasOwnProperty("crossMatching")) {
          await new Promise((resolve, reject) => {
            let sql_query =
              "insert into marketodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,is_suspended0,is_suspended1)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,is_suspended0=1,is_suspended1=1";
            let values = [
              eventId,
              market.marketId,
              event_name,
              runner1,
              runner2,
              market.status,
              market.inplay,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              eventId,
              market.marketId,
              event_name,
              runner1,
              runner2,
              market.status,
              market.inplay,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
            ];
            dbConn.query(sql_query, values, (err, res) => {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          });
        } else {
          if (market.market == "Match Odds") {
            // console.log("in-->");
            // console.log("in-->", event_name);
            await new Promise((resolve, reject) => {
              let sql_query = "";
              //for runner length 1
              if (market.runners.length == 1) {
                if (market.runners[0].ex.availableToBack.length == 0) {
                  market.runners[0].ex.availableToBack = [
                    { price: 0, size: 0 },
                  ];
                }
                if (market.runners[0].ex.availableToLay.length == 0) {
                  market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
                }

                sql_query =
                  "insert into marketodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size)values(?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?";
                values = [
                  market.eventid,
                  market.marketId,
                  event_name,
                  runner1,
                  runner2,
                  market.status,
                  market.inplay,
                  market.runners[0].ex.availableToBack[0].price,
                  market.runners[0].ex.availableToBack[0].size,
                  market.runners[0].ex.availableToLay[0].price,
                  market.runners[0].ex.availableToLay[0].size,
                  market.eventid,
                  market.marketId,
                  event_name,
                  runner1,
                  runner2,
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
                  market.runners[0].ex.availableToBack = [
                    { price: 0, size: 0 },
                  ];
                }
                if (market.runners[1].ex.availableToBack.length == 0) {
                  market.runners[1].ex.availableToBack = [
                    { price: 0, size: 0 },
                  ];
                }
                if (market.runners[0].ex.availableToLay.length == 0) {
                  market.runners[0].ex.availableToLay = [{ price: 0, size: 0 }];
                }
                if (market.runners[1].ex.availableToLay.length == 0) {
                  market.runners[1].ex.availableToLay = [{ price: 0, size: 0 }];
                }
                sql_query =
                  "insert into marketodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?";
                values = [
                  market.eventid,
                  market.marketId,
                  event_name,
                  runner1,
                  runner2,
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
                  event_name,
                  runner1,
                  runner2,
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
                  market.runners[0].ex.availableToBack = [
                    { price: 0, size: 0 },
                  ];
                }
                if (market.runners[1].ex.availableToBack.length == 0) {
                  market.runners[1].ex.availableToBack = [
                    { price: 0, size: 0 },
                  ];
                }
                if (market.runners[2].ex.availableToBack.length == 0) {
                  market.runners[2].ex.availableToBack = [
                    { price: 0, size: 0 },
                  ];
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
                  "insert into marketodds(event_id,market_id,event_name,runner1,runner2,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?";
                values = [
                  market.eventid,
                  market.marketId,
                  event_name,
                  runner1,
                  runner2,
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
                  event_name,
                  runner1,
                  runner2,
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

              // console.log("query---->", query);
              // console.log("---------------------");
              // console.log("values---->", values);

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
      }
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      // console.log("Request canceled due to timeout", error.message);
      console.log("Request canceled due to timeout", eventId);
    } else {
      console.error("An error occurred in marketodds-->", eventId);
      // console.error("An error occurred-->", error);
    }
  }
}

storeNewBookOdds = async function () {
  const eventIds = await new Promise((resolve, reject) => {
    dbConn.query(
      "select event_id,event_name,market_id from book_markets",
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
    eventIds.map(({ eventId, marketId, eventName }) =>
      fetchAndInsertBookOdds(eventId, marketId, eventName)
    )
  );
  console.log("All Book odds fetched and inserted.");
};

async function fetchAndInsertBookOdds(eventId, marketId, eventName) {
  try {
    // console.log("odds-->", process.env.API_URL + "getOdds?eventId=" + eventId);
    // console.log(
    //   "odds-->",
    //   process.env.BOOK_API_URL + "listBookmakerMarketOdds?market_id=" + marketId
    // );

    const timeoutMilliseconds = 20000; // Adjust the timeout value as needed
    const bookmaker_odds = await axios.get(
      process.env.BOOK_API_URL +
        "listBookmakerMarketOdds?market_id=" +
        marketId,
      {
        timeout: timeoutMilliseconds,
      }
    );
    //
    if (bookmaker_odds.status == 200 && bookmaker_odds.statusText == "OK") {
      const bookmaker_odd = bookmaker_odds.data;
      // Process and insert data into the database (modify the following code based on your needs)
      const market_odds = bookmaker_odd[0];

      // Insert marketOdds into the database
      if (market_odds != null) {
        market = market_odds;
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
            "insert into bookmakerodds(event_id,market_id,event_name,runner1,runner2,status,status1,status2,inplay,back0_price,back0_size,lay0_price,lay0_size,min,max)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,status1=?,status2=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,min=?,max=?";
          values = [
            market.evid,
            market.marketId,
            eventName,
            market.runners[0].runnerName,
            null,
            market.status,
            market.runners[0].status,
            null,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.min,
            market.max,
            market.evid,
            market.marketId,
            eventName,
            market.runners[0].runnerName,
            null,
            market.status,
            market.runners[0].status,
            null,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.min,
            market.max,
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
            "insert into bookmakerodds(event_id,market_id,event_name,runner1,runner2,status,status1,status2,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,min,max)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)on duplicate key update event_id=?,market_id=?,event_name=?,runner1=?,runner2=?,status=?,status1=?,status2=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,min=?,max=?";
          values = [
            market.evid,
            market.marketId,
            eventName,
            market.runners[0].runnerName,
            market.runners[1].runnerName,
            market.status,
            market.runners[0].status,
            market.runners[1].status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
            market.min,
            market.max,
            market.evid,
            market.marketId,
            eventName,
            market.runners[0].runnerName,
            market.runners[1].runnerName,
            market.status,
            market.runners[0].status,
            market.runners[1].status,
            market.inplay,
            market.runners[0].ex.availableToBack[0].price,
            market.runners[0].ex.availableToBack[0].size,
            market.runners[0].ex.availableToLay[0].price,
            market.runners[0].ex.availableToLay[0].size,
            market.runners[1].ex.availableToBack[0].price,
            market.runners[1].ex.availableToBack[0].size,
            market.runners[1].ex.availableToLay[0].price,
            market.runners[1].ex.availableToLay[0].size,
            market.min,
            market.max,
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
        console.log("Bookmaker data null for " + eventId);
      }
    } else {
      console.log("No Data for bookmaker event", eventId);
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      // console.log("Request canceled due to timeout", error.message);
      console.log("Request canceled due to timeout", eventId);
    } else {
      console.error("An error occurred in bookmakerodds-->", eventId);
      // console.error("An error occurred-->", error);
    }
  }
}

storeBookMarkets = async function (events) {
  let bookMarketList = [];

  //truncate book_markets
  await dbConn.query("truncate table book_markets", (err, res) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      // console.log("truncated");
    }
  });

  try {
    // console.log("events--->", events);
    for (const event of events) {
      // console.log(
      //   "bokk api",
      //   process.env.BOOK_API_URL +
      //     "fetch_data?Action=listBookmakerMarket&EventID=" +
      //     event.event_id
      // );
      const response = await axios.get(
        process.env.BOOK_API_URL +
          "fetch_data?Action=listBookmakerMarket&EventID=" +
          event.event_id
      );
      const market = response.data;

      if (market.length > 0) {
        if (market[0].marketName == "Bookmaker") {
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
                "REPLACE INTO book_markets(event_id,market_id,event_name,market_name,start_time,runner1,runner2) values(?,?,?,?,?,?,?)",
                [
                  event.event_id,
                  market[0].marketId,
                  event.event_name,
                  market[0].marketName,
                  // moment(market[0].marketStartTime).format(
                  //   "YYYY-MM-DD HH:mm:ss"
                  // ),
                  new Date().toISOString().slice(0, 19).replace("T", " "),
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
            bookMarketList.push(result);
          } catch (err) {
            console.error(err);
            result(err, null);
          }
        }
      }
    }
    return bookMarketList;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  storeCompetitions,
  storeEvents,
  storeMarkets,
  storeSession,
  // storeMatchOdds,
  storeFancy,
  storeNewMatchOdds,
  storeNewBookOdds,
  storeBookMarkets,
};
