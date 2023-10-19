var dbConn = require("../../config/db");
require("dotenv").config();

var CasinoLadgersMaster = function () {};

CasinoLadgersMaster.savedata = async function (data) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO casino_ledger SET ?",
        data,
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

CasinoLadgersMaster.getClientLedgerByDays = async function (user_id, days) {
  try {
    let qry =
      "SELECT * FROM `casino_ledger` where user_id = ? and created_at >= CURDATE() - INTERVAL ? DAY ORDER BY created_at desc";
    values = [user_id, days];
    let ledger = await new Promise((resolve, reject) => {
      dbConn.query(qry, values, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    return ledger;
  } catch (error) {
    console.error(error);
  }
};

module.exports = CasinoLadgersMaster;
