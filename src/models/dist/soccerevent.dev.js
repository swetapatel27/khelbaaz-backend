"use strict";

var dbConn = require("./../../config/db"); // const axios = require('axios');


require("dotenv").config();

var SoccerEventMaster = function SoccerEventMaster(event) {
  this.market_id = event.marketId;
  this.market_name = event.marketName;
  this.start_time = event.marketStartTime;
  this.total_matched = event.totalMatched;
  this.runners = event.runners;
}; // EventMaster.getEventById = async function(event_id){
//     try{
//         let event = await axios.get(process.env.API_URL+'fetch_data?Action=listMarketTypes&EventID='+event_id);
//         event = event.data;
//         return event;
//     }catch(error){
//         console.error(error);
//     }
// }


SoccerEventMaster.getAllSoccerEvents = function _callee() {
  var event;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            dbConn.query( // "select * from soccerevents where open_date >= DATE_SUB(CURDATE(), INTERVAL 4 DAY) ORDER BY open_date DESC;",
            //"select *,start_time as open_date from soccermarkets where open_date >= DATE_SUB(CURDATE(), INTERVAL 4 DAY) ORDER BY open_date DESC;",
            // "select *,start_time as open_date from soccermarkets where start_time >= DATE_SUB(CURDATE(), INTERVAL 4 DAY) ORDER BY open_date DESC;",
            "select * from soccermarkets ORDER BY start_time DESC;", function (err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            });
          }));

        case 3:
          event = _context.sent;
          return _context.abrupt("return", event);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = SoccerEventMaster;