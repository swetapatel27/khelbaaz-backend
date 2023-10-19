var dbConn = require("../../config/db");
require("dotenv").config();

var LadgersMaster = function () {};

LadgersMaster.savedata = async function (data) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO ledger SET ?",
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

LadgersMaster.bonusLedger = async function (data) {
  console.log("data>>>",data)
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO bonus_ledger SET ?",
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



module.exports = LadgersMaster;
