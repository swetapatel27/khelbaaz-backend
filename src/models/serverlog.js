var dbConn = require("../../config/db");
require("dotenv").config();

var ServerLogMaster = function () {};

ServerLogMaster.savelog = async function (data) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO serverlog SET ?",
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


module.exports = ServerLogMaster;
