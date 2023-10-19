var dbConn = require("./../../config/db");
const axios = require("axios");

require("dotenv").config();

var BookMakerMaster = function (market) {
  this.event_id = market.event_id;
  this.market_id = market.market_id;
  this.market_name = market.market_name;
  this.start_time = market.start_time;
  this.runner1 = market.runner1;
  this.runner2 = market.runner2;
  this.draw = market.draw;
};

BookMakerMaster.BookmakerList = async function () {
  // const ress = await axios.get(
  //   //process.env.BOOK2_API_URL + "getOdds?eventId=" + event_id
  //   "http://localhost:5004/test.json"
  // );
  // const responseData =  ress.data;
  // if(responseData != null) {
  //   // dbConn.query("truncate table markets", (err, res) => {
  //   //   if (err) {
  //   //     console.log(err);
  //   //     //reject(err);
  //   //   } else {
  //   //     console.log("truncated");
  //   //   }
  //   // });

  //   for (const eventId in responseData) {
  //     if (responseData.hasOwnProperty(eventId)) {
  //       const eventBookmakerData = responseData[eventId];
    
  //       // Check if the data for the event is not null or undefined
  //       if (eventBookmakerData !== null) {
  //           // console.log(`Event ID: ${eventId}`);
  //           // console.log("Bookmaker Data:", eventBookmakerData);
  
  //           await saveTodb(eventId,"True",eventBookmakerData);
  //       } else {
  //         console.log(`Event ID: ${eventId} has no bookmaker data.`);
  //       }
  //     }
  //   }
  // }

  // return responseData;

  // testing end here

  const res = await axios.get(
    process.env.BOOK2_API_URL + "cricket"
  );
  const result2 = {};

  const response = res.data;
  if (response.success) {
    const result = response.data.filter(function (game) {
      return game.m1 == "True";
    });

    // Use Promise.all to handle multiple async calls concurrently
    const promises = result.map(async function (event) {
      const tdata = await geteventsData(event.gameId);
      if(tdata !== null) await saveTodb(event.gameId,event.inPlay,tdata);
      result2[event.gameId] = tdata;
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
    return result2;
  }
  return { 'status': "something went wrong" };
}

const saveTodb = async (event_id, inplay, data) => {
  try {
    const sData = {};
    sData['event_id'] = event_id;
    sData['inplay'] = inplay;

    sData['market_id'] = data[0].mid;
    sData['remark'] = data[0].remark;
    sData['runner1'] = data[0].nat;
    sData['runner2'] = data[1].nat;

    sData['min'] = data[0].min;
    sData['max'] = data[0].max;

    // confusional data
    sData['book_market_id'] = data[0].mid;
    sData['status'] = data[0].s;
    // end here

    // data of player 1
    sData['p1back0_price'] = data[0].b1;
    sData['p1back0_size'] = data[0].bs1;
    sData['p1lay0_price'] = data[0].l1;
    sData['p1lay0_size'] = data[0].ls1;
    
    sData['p1back1_price'] = data[0].b2;
    sData['p1back1_size'] = data[0].bs2;
    sData['p1lay1_price'] = data[0].l2;
    sData['p1lay1_size'] = data[0].ls2;

    sData['p1back2_price'] = data[0].b3;
    sData['p1back2_size'] = data[0].bs3;
    sData['p1lay2_price'] = data[0].l3;
    sData['p1lay2_size'] = data[0].ls3;

    sData['is_active0'] = data[0].s=='active'?1:0;
    // confusional data
    sData['is_suspended0'] = data[0].s=='SUSPENDED'?1:0;

    // data of player 2
    sData['p2back0_price'] = data[1].b1;
    sData['p2back0_size'] = data[1].bs1;
    sData['p2lay0_price'] = data[1].l1;
    sData['p2lay0_size'] = data[1].ls1;
    
    sData['p2back1_price'] = data[1].b2;
    sData['p2back1_size'] = data[1].bs2;
    sData['p2lay1_price'] = data[1].l2;
    sData['p2lay1_size'] = data[1].ls2;

    sData['p2back2_price'] = data[1].b3;
    sData['p2back2_size'] = data[1].bs3;
    sData['p2lay2_price'] = data[1].l3;
    sData['p2lay2_size'] = data[1].ls3;

    sData['is_active1'] = data[1].s=='active'?1:0;
    // confusional data
    sData['is_suspended1'] = data[1].s=='SUSPENDED'?1:0;
    
    // data of draw match
    if (data[2]) {
      // sData['back2_price'] = data[1].b1;
      // sData['back2_size'] = data[1].bs1;
      // sData['lay2_price'] = data[1].l1;
      // sData['lay2_size'] = data[1].ls1;
      sData['is_active2'] = data[2].s=='active'?1:0;
      // confusional data
      sData['is_suspended2'] = data[1].smarket-odd=='SUSPENDED'?1:0;
    }

    // return sData;
      let result = await new Promise((resolve, reject) => {
        dbConn.query(
          "REPLACE INTO bookmakerodds SET ?",
          sData,
          (err, res) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(true);
            }
          }
        );
      });
  } catch (err) {
    console.error(err);
    // Handle any errors here
  }
}

const geteventsData = async (event_id) => {
  try {
    const res = await axios.get(
      process.env.BOOK2_API_URL + "getOdds?eventId=" + event_id
    );

    if (!res || !res.data || typeof res.data !== 'object') {
      console.warn("Invalid response from the API for event_id: " + event_id);
      return null; // Return null or an appropriate default value
    }

    const response = res.data;
    if (response.success) {
      const { t2 } = response.data;

      if (t2 && Array.isArray(t2) && t2.length > 0) {
        // Assuming t2 is an array of objects, and each object contains bm1 and bm2 properties
        const bm1Data = t2[0].bm1;
        if (Array.isArray(bm1Data)) {
          return bm1Data; // Return the bm1 data if it exists
        } else {
          console.warn("No bm1 data found for event_id: " + event_id);
          return null; // Return null or an appropriate default value
        }
      } else {
        console.warn("No t2 data found for event_id: " + event_id);
        return null; // Return null or an appropriate default value
      }
    } else {
      throw new Error("API request was not successful for event_id: " + event_id);
    }
  } catch (error) {
    console.error("Error in geteventsData:", error);
    throw error; // Re-throw the error so it can be caught in the calling function
  }
}
BookMakerMaster.getBookmakers = async function (event_id) {
  try {
    let market = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from bookmakerodds where event_id = ?",
        event_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return market;
  } catch (error) {
    console.error(error);
  }
};

BookMakerMaster.checkBookmakerPriceChange = async function (
  market_id,
  runner_name,
  type,
  price
) {
  try {
    let change = false;
    let market_odd = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from bookmakerodds where market_id = ?",
        [market_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    let market = market_odd[0];
    switch (runner_name) {
      case market.runner1:
        if (type == "Back") {
          if (price != market.p1back0_price) {
            change = true;
          }
        } else if (type == "Lay") {
          if (price != market.p1lay0_price) {
            change = true;
          }
        }
        break;
      case market.runner2:
        if (type == "Back") {
          if (price != market.p2back0_price) {
            change = true;
          }
        } else if (type == "Lay") {
          if (price != market.p2lay0_price) {
            change = true;
          }
        }
        break;
      case "Draw":
        if (type == "Back") {
          if (price != market.back2_price) {
            change = true;
          }
        } else if (type == "Lay") {
          if (price != market.lay2_price) {
            change = true;
          }
        }
        break;
      default:
        break;
    }
    return change;
  } catch (error) {
    console.log(error);
  }
};

BookMakerMaster.getBookmakerslist = async function () {
  try {
    const response = await new Promise((resolve, reject) => {
      dbConn.query("select * from markets", (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    const market_ids = response.map((obj) => obj.market_id).join(",");
    const res = await axios.get(
      process.env.API_URL + "listMarketBookOdds?market_id=" + market_ids
    );
    const markets = res.data;
    const result = response.reduce((acc, item) => {
      const market = markets.find((m) => m.marketId == item.market_id);
      if (market) {
        acc.push({ ...item, ...market });
      }
      return acc;
    }, []);

    if (result.length == 0) {
      return response;
    }

    return result;
  } catch (error) {
    console.error(error);
  }
};

BookMakerMaster.getBookMakerByEvent = async function (event_id) {
  try {
    let market = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from bookmakerodds where event_id = ?",
        event_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return market;
  } catch (error) {
    console.error(error);
  }
};

BookMakerMaster.setBookMakerSuspend = async function (
  market_id,
  is_suspended,
  col
) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update bookmakerodds set " + col + " = ? where market_id = ?",
        [is_suspended, market_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = BookMakerMaster;
