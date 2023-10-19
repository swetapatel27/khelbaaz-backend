var dbConn = require("./../../config/db");
const axios = require("axios");

require("dotenv").config();

var MarketoddMaster = function (market) {
  this.event_id = market.event_id;
  this.market_id = market.market_id;
  this.market_name = market.market_name;
  this.start_time = market.start_time;
  this.runner1 = market.runner1;
  this.runner2 = market.runner2;
  this.draw = market.draw;
};

MarketoddMaster.getMarketodds = async function () {
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

// MarketoddMaster.getMarketodd = async function(market_id){
//     try{
//         const response = await axios.get(process.env.API_URL+'listMarketBookOdds?market_id='+market_id);
//         const res = response.data;
//         return res;
//     }catch(error){
//         console.error(error);
//     }
// }

MarketoddMaster.getMarketodd = async function (event_id) {
  try {
    let market = await new Promise((resolve, reject) => {
      dbConn.query(
        //"select * from marketodds where event_id = ?",
        "select m.*,mo.start_time from marketodds as m JOIN markets mo ON mo.event_id = m.event_id where m.event_id = ?",
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

//get live match odds
MarketoddMaster.getLiveMarketodd = async function (event_id) {
  try {
    let existing_market = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from marketodds where event_id = ?",
        event_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    let market_odds = await axios.get(
      process.env.API_URL + "getOdds?eventId=" + event_id
    );
    if (market_odds.status == 200) {
      if (market_odds.data != null) {
        if (
          market_odds.data.success &&
          market_odds.data.data.hasOwnProperty("t1")
        ) {
          console.log(market_odds.data.data.t1);
        }
      }
    }

    console.log(existing_market);
    return market;
  } catch (error) {
    console.error(error);
  }
};

MarketoddMaster.getMarketOddByEvent = async function (event_id) {
  try {
    let market = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from marketodds where event_id = ?",
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

MarketoddMaster.setMarketOddActive = async function (
  market_id,
  is_active,
  col
) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update marketodds set " + col + " = ? where market_id = ?",
        [is_active, market_id],
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

MarketoddMaster.setMarketOddSuspend = async function (
  market_id,
  is_suspended,
  col
) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update marketodds set " + col + " = ? where market_id = ?",
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

MarketoddMaster.addMarketTVLink = async function (event_id, link) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update marketodds set link = ? where event_id = ?",
        [link, event_id],
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

MarketoddMaster.checkMatchOddPriceChange = async function (
  market_id,
  runner_name,
  type,
  price
) {
  try {
    let change = false;
    let market_odd = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from marketodds where market_id = ?",
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
          console.log("price-->", price);
          console.log("market price-->", market.back0_price);
          console.log(
            "market price change-->",
            Number(Math.abs(price - market.back0_price)).toFixed(2)
          );
          if (Number(Math.abs(price - market.back0_price)).toFixed(2) > 0.02) {
            change = true;
          }
        } else if (type == "Lay") {
          console.log("price-->", price);
          console.log("market price-->", market.lay0_price);
          console.log(
            "market price change-->",
            Number(Math.abs(price - market.lay0_price)).toFixed(2)
          );
          if (Number(Math.abs(price - market.lay0_price)).toFixed(2) > 0.02) {
            change = true;
          }
        }
        break;
      case market.runner2:
        if (type == "Back") {
          if (Number(Math.abs(price - market.back1_price)).toFixed(2) > 0.02) {
            change = true;
          }
        } else if (type == "Lay") {
          if (Number(Math.abs(price - market.lay1_price)).toFixed(2) > 0.02) {
            change = true;
          }
        }
        break;
      case "Draw":
        if (type == "Back") {
          if (Number(Math.abs(price - market.back2_price)).toFixed(2) > 0.02) {
            change = true;
          }
        } else if (type == "Lay") {
          if (Number(Math.abs(price - market.lay2_price)).toFixed(2) > 0.02) {
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

module.exports = MarketoddMaster;
