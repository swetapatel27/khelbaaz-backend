var dbConn = require("./../../config/db");
require("dotenv").config();

var WithdrawProofMaster = function (img_details) {
  this.withdraw_id = img_details.withdraw_id;
  this.image = img_details.image;
};

WithdrawProofMaster.uploadProof = async function (data) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO withdraw_proofs (withdraw_id,image) VALUES ?",
        [data.map((wp) => [wp.withdraw_id,wp.image])],
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

WithdrawProofMaster.getWithdrawProofs = async function (id) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from withdraw_proofs WHERE withdraw_id = ? order by id desc;",
        [id],
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

module.exports = WithdrawProofMaster;
