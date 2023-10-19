var dbConn = require("../../config/db");
const Exposure = require("./exposure");
require("dotenv").config();

var CasinoTxnMaster = function (request) {
  this.txn_id = request.txn_id;
  this.user_id = request.user_id;
  this.amount = request.amount;
  this.casino_amount = request.casino_amount;
  this.type = request.type;
};

CasinoTxnMaster.saveData = async function (request_data) {
  const { user_id,amount,casino_points,type } = request_data;
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO casino_txn set ?",
        [request_data],
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

CasinoTxnMaster.saveFundLadger = async function (user_id,amount,casino_points,type) {
  try {
    const ledger_data = {};
    ledger_data.user_id = user_id;
    ledger_data.event_id = null;
    ledger_data.type = "fund";
    if(type=='deposit'){
      ledger_data.event_name = `Deposit ${casino_points}p to casino wallet`;
      ledger_data.subtype = "widthdraw";
      ledger_data.runner_name = "widthdraw";
      ledger_data.profit_loss = -Math.abs(amount)
    }else{
      ledger_data.event_name = `Widthdraw ${casino_points}p from casino wallet`;
      ledger_data.subtype = "deposit";
      ledger_data.runner_name = "deposit";
      ledger_data.profit_loss = amount
    }
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO ledger set ?",
        [ledger_data],
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
}
CasinoTxnMaster.getCasinoTxnRequests = async function (user_id,type) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from casino_txn where user_id = ? AND type = ? ORDER BY id DESC",
        [user_id,type],
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

module.exports = CasinoTxnMaster;