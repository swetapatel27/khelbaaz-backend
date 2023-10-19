"use strict";

var dbConn = require("../../config/db");

require("dotenv").config();

var SoccerMarketMaster = function SoccerMarketMaster() {};

SoccerMarketMaster.saveData = function (eventid, marketId, marketName, market_time, runner0, runner1, runner2) {
  dbConn.query("REPLACE INTO soccermarkets(event_id,market_id,market_name,start_time,runner1,runner2,runner3) values(?,?,?,?,?,?,?)", [eventid, marketId, marketName, market_time, runner0, runner1, runner2], function (err, res) {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      var insertedId = res.insertId;
      resolve(market[0].marketId);
    }
  });
};

module.exports = SoccerMarketMaster;