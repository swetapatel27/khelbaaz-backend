var dbConn = require("./../../config/db");
var Winner = require("../models/winner");
require("dotenv").config();

var CashoutMaster = function () {};

CashoutMaster.addCashout = async function (cashout_details) {
  try {
    console.log(cashout_details);
    if (cashout_details.status == "loss") {
      let new_type = "";
      let new_win = "";
      let new_loss = "";
      insert_matchbets =
        "INSERT INTO matchbets(user_id,event_id,market_id,runner_name, main_type,type,price,size,loss_amount,win_amount,exp_amount1,exp_amount2,exp_amount3,status,is_switched)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      if (cashout_details.type == "Back") {
        new_type = "Lay";
        new_win = cashout_details.amount;
        new_loss =
          0 -
          (cashout_details.amount * cashout_details.price -
            cashout_details.amount);
      } else if (cashout_details.type == "Lay") {
        new_type = "Back";
        new_win =
          cashout_details.amount * cashout_details.price -
          cashout_details.amount;
        new_loss = cashout_details.amount;
      }
      console.log("win---->", new_win);
      console.log("loss---->", new_loss);
      values_matchbets = [
        cashout_details.user_id,
        cashout_details.event_id,
        cashout_details.market_id,
        cashout_details.runner_name,
        "match_odd",
        new_type,
        cashout_details.new_price,
        0,
        0,
        0,
        cashout_details.cashout_pl,
        cashout_details.cashout_pl,
        cashout_details.cashout_pl,
        1,
        1,
      ];

      update_matchbets =
        "update matchbets set is_switched=1 where user_id = ? and event_id=? and runner_name=? and type=? and price = ? ";
      update_values_matchbets = [
        cashout_details.user_id,
        cashout_details.event_id,
        cashout_details.runner_name,
        cashout_details.type,
        cashout_details.price,
      ];
      const promises = [
        new Promise((resolve, reject) => {
          dbConn.query(
            update_matchbets,
            update_values_matchbets,
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }),
        new Promise((resolve, reject) => {
          dbConn.query(
            "update exposures set deducted_amount = ?, exp_amount = exp_amount + ?, difference = 1 where user_id = ? and event_id=? and runner_name=? and type=? and price = ? ",
            [
              cashout_details.cashout_pl,
              cashout_details.amount,
              cashout_details.user_id,
              cashout_details.event_id,
              cashout_details.runner_name,
              cashout_details.type,
              cashout_details.price,
            ],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }),
        new Promise((resolve, reject) => {
          dbConn.query(insert_matchbets, values_matchbets, (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        }),
        new Promise((resolve, reject) => {
          dbConn.query(
            "update users set balance = balance + ? where id = ?",
            [cashout_details.amount, cashout_details.user_id],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }),
      ];
      // execute the promises in parallel using Promise.all()
      let result = await Promise.all(promises)
        .then(() => {
          // console.log(results);
        })
        .catch((err) => {
          console.log(err);
        });
      return result;
    } else if ((cashout_details.status = "profit")) {
      let new_type = "";
      let new_win = "";
      let new_loss = "";
      insert_matchbets =
        "INSERT INTO matchbets(user_id,event_id,market_id,runner_name, main_type,type,price,size,loss_amount,win_amount,exp_amount1,exp_amount2,exp_amount3,status,is_switched)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      if (cashout_details.type == "Back") {
        new_type = "Lay";
        new_win = cashout_details.amount;
        new_loss =
          0 -
          (cashout_details.amount * cashout_details.price -
            cashout_details.amount);
      } else if (cashout_details.type == "Lay") {
        new_type = "Back";
        new_win =
          cashout_details.amount * cashout_details.price -
          cashout_details.amount;
        new_loss = cashout_details.amount;
      }
      console.log("win---->", new_win);
      console.log("loss---->", new_loss);
      values_matchbets = [
        cashout_details.user_id,
        cashout_details.event_id,
        cashout_details.market_id,
        cashout_details.runner_name,
        "match_odd",
        new_type,
        cashout_details.new_price,
        0,
        0,
        cashout_details.cashout_pl,
        cashout_details.cashout_pl,
        cashout_details.cashout_pl,
        cashout_details.cashout_pl,
        1,
        1,
      ];

      update_matchbets =
        "update matchbets set is_switched=1 where user_id = ? and event_id=? and runner_name=? and type=? and price = ? ";
      update_values_matchbets = [
        cashout_details.user_id,
        cashout_details.event_id,
        cashout_details.runner_name,
        cashout_details.type,
        cashout_details.price,
      ];
      const promises = [
        new Promise((resolve, reject) => {
          dbConn.query(
            update_matchbets,
            update_values_matchbets,
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }),
        new Promise((resolve, reject) => {
          dbConn.query(
            "update exposures set deducted_amount = ?, exp_amount = exp_amount + ?, difference = 1 where user_id = ? and event_id=? and runner_name=? and type=? and price = ? ",
            [
              cashout_details.cashout_pl,
              cashout_details.amount,
              cashout_details.user_id,
              cashout_details.event_id,
              cashout_details.runner_name,
              cashout_details.type,
              cashout_details.price,
            ],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }),
        new Promise((resolve, reject) => {
          dbConn.query(insert_matchbets, values_matchbets, (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        }),
        new Promise((resolve, reject) => {
          dbConn.query(
            "update users set balance = balance + ? where id = ?",
            [Math.abs(cashout_details.loss_amount), cashout_details.user_id],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }),
      ];
      // execute the promises in parallel using Promise.all()
      let result = await Promise.all(promises)
        .then(() => {
          // console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = CashoutMaster;
