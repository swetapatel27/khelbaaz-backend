var dbConn = require("./../../config/db");
require("dotenv").config();

var SoccerOddMaster = function () {};

SoccerOddMaster.getSoccerOdds = async function () {
  try {
    const response = await new Promise((resolve, reject) => {
      dbConn.query(
        "select tod.*,tm.start_time from soccerodds as tod join soccermarkets as tm on tod.event_id=tm.event_id order by tm.start_time ",
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

SoccerOddMaster.getSoccertoddByMarketId = async function (market_id) {
  try {
    let market = await new Promise((resolve, reject) => {
      dbConn.query(
        "select tod.*,tm.start_time from soccerodds as tod join soccermarkets as tm on tod.event_id = tm.event_id WHERE tod.market_id = ?",
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

SoccerOddMaster.getSoccerOddByEvent = async function (event_id) {
  try {
    let market = await new Promise((resolve, reject) => {
      dbConn.query(
        //"SELECT tod.*, te.event_name, te.start_time as open_date FROM `soccerodds` tod join soccermarkets te on tod.event_id = te.event_id where tod.event_id = ?",
        "SELECT tod.* FROM `soccerodds` tod where tod.event_id = ?",
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

SoccerOddMaster.setSoccerOddActive = async function (
  market_id,
  is_active,
  col
) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update soccerodds set " + col + " = ? where market_id = ?",
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

SoccerOddMaster.setSoccerOddSuspend = async function (
  market_id,
  is_suspended,
  col
) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update soccerodds set " + col + " = ? where market_id = ?",
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

SoccerOddMaster.checkSoccerOddPriceChange = async function (
  market_id,
  runner_name,
  type,
  price
) {
  try {
    let change = false;
    let market_odd = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from soccerodds where market_id = ?",
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
      case market.runner3:
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

module.exports = SoccerOddMaster;
