"use strict";

var dbConn = require("./../../config/db");

require("dotenv").config();

var SoccerMarketMaster = function SoccerMarketMaster() {};

SoccerMarketMaster.create = function (data) {
  dbConn.query("REPLACE INTO soccermarkets(event_id,market_id,market_name,start_time,runner1,runner2,runner3) values(?,?,?,?,?,?,?)", [event, market[0].marketId, market[0].marketName, moment(market[0].marketStartTime).format("YYYY-MM-DD HH:mm:ss"), runnerlist[0], runnerlist[1], runnerlist[2]], function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      if (newTransaction.status == "COMPLETED") {
        dbConn.query("UPDATE users SET balance = balance + ? WHERE id = ? ", [newTransaction.amount, newTransaction.user_id], function (err, newRes) {
          if (err) {
            console.log("error:", err);
          } else {
            res["balance"] = newRes;
          }
        });
      }

      console.log(res);
      result(null, res);
    }
  });
};

module.exports = SoccerMarketMaster;