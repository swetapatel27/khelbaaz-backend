var dbConn = require("./../../config/db");
const axios = require("axios");

require("dotenv").config();
var BookmakeroddsMaster = function (market) {};

BookmakeroddsMaster.getBookmakerodds = async function (event_id) {
  try {
    let bookmaker_odds = await new Promise((resolve, reject) => {
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
    return bookmaker_odds;
  } catch (error) {
    console.error(error);
  }
};

BookmakeroddsMaster.checkBookmakerPriceChange = async function (
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
          if (price != market.back0_price) {
            change = true;
          }
        } else if (type == "Lay") {
          if (price != market.lay0_price) {
            change = true;
          }
        }
        break;
      case market.runner2:
        if (type == "Back") {
          if (price != market.back1_price) {
            change = true;
          }
        } else if (type == "Lay") {
          if (price != market.lay1_price) {
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

BookmakeroddsMaster.setBookmakerOddSuspend = async function (
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
module.exports = BookmakeroddsMaster;
