var dbConn = require("./../../config/db");
require("dotenv").config();

var TennisOddMaster = function () {};

TennisOddMaster.getTennisOdds = async function () {
  try {
    const response = await new Promise((resolve, reject) => {
      dbConn.query(
        "select tod.*,tm.start_time from tennisodds as tod join tennismarkets as tm on tod.event_id=tm.event_id order by tm.start_time ",
        (err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

TennisOddMaster.getTennistoddByMarketId = async function (market_id) {
  try {
    let market = await new Promise((resolve, reject) => {
      dbConn.query(
        "select tod.*,tm.start_time from tennisodds as tod join tennismarkets as tm on tod.event_id = tm.event_id WHERE tod.market_id = ?",
        market_id,
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

TennisOddMaster.getTennisOddByEvent = async function (event_id) {
  try {
    let market = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT tod.* FROM `tennisodds` tod where tod.event_id = ?",
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

TennisOddMaster.setTennisOddActive = async function (
  market_id,
  is_active,
  col
) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update tennisodds set " + col + " = ? where market_id = ?",
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

TennisOddMaster.setTennisOddSuspend = async function (
  market_id,
  is_suspended,
  col
) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update tennisodds set " + col + " = ? where market_id = ?",
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

TennisOddMaster.checkTennisOddPriceChange = async function (
  market_id,
  runner_name,
  type,
  price
) {
  try {
    let change = false;
    let market_odd = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from tennisodds where market_id = ?",
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
          if (Number(Math.abs(price - market.back0_price)).toFixed(2) > 0.02) {
            change = true;
          }
        } else if (type == "Lay") {
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

module.exports = TennisOddMaster;
