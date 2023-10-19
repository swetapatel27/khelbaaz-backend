var dbConn = require("./../../config/db");
const axios = require("axios");

require("dotenv").config();

var EventMaster = function (event) {
  this.market_id = event.marketId;
  this.market_name = event.marketName;
  this.start_time = event.marketStartTime;
  this.total_matched = event.totalMatched;
  this.runners = event.runners;
};

EventMaster.getEventById = async function (event_id) {
  try {
    let event = await axios.get(
      process.env.API_URL +
        "fetch_data?Action=listMarketTypes&EventID=" +
        event_id
    );
    event = event.data;
    return event;
  } catch (error) {
    console.error(error);
  }
};

EventMaster.getAllEvents = async function () {
  try {
    let event = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT * FROM events WHERE open_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) ORDER BY open_date DESC;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return event;
  } catch (error) {
    console.error(error);
  }
};

module.exports = EventMaster;
