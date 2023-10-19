var dbConn = require("./../../config/db");
// const axios = require('axios');

require("dotenv").config();

var SoccerEventMaster = function (event) {
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

SoccerEventMaster.getAllSoccerEvents = async function () {
  try {
    let event = await new Promise((resolve, reject) => {
      dbConn.query(
        // "select * from soccerevents where open_date >= DATE_SUB(CURDATE(), INTERVAL 4 DAY) ORDER BY open_date DESC;",
        //"select *,start_time as open_date from soccermarkets where open_date >= DATE_SUB(CURDATE(), INTERVAL 4 DAY) ORDER BY open_date DESC;",
       // "select *,start_time as open_date from soccermarkets where start_time >= DATE_SUB(CURDATE(), INTERVAL 4 DAY) ORDER BY open_date DESC;",
       "select * from soccermarkets ORDER BY start_time DESC;", 
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

module.exports = SoccerEventMaster;
