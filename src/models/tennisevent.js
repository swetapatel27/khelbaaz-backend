var dbConn = require("./../../config/db");
// const axios = require('axios');

require("dotenv").config();

var TennisEventMaster = function (event) {
  this.market_id = event.marketId;
  this.market_name = event.marketName;
  this.start_time = event.marketStartTime;
  this.total_matched = event.totalMatched;
  this.runners = event.runners;
};

// EventMaster.getEventById = async function(event_id){
//     try{
//         let event = await axios.get(process.env.API_URL+'fetch_data?Action=listMarketTypes&EventID='+event_id);
//         event = event.data;
//         return event;
//     }catch(error){
//         console.error(error);
//     }
// }

TennisEventMaster.getAllTennisEvents = async function () {
  try {
    let event = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from tennismarkets ORDER BY start_time DESC;",
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

module.exports = TennisEventMaster;
