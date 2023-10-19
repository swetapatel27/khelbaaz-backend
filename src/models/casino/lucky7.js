var dbConn = require("../../../config/db");
const axios = require("axios");

var Lucky7Master = function () {};

Lucky7Master.getLucky7 = async function () {
  try {
    console.log("called");
    let result = await axios.get(process.env.CASINO_URL + "3005/lucky7/a");
    // console.log("res-->", result.data);
    return result.data;
  } catch (error) {
    console.error(error);
  }
};

Lucky7Master.getResultHistory = async function () {
  try {
    let result = await axios.get(
      process.env.CASINO_URL + "3005/lucky7/a/result"
    );
    // console.log("res-->", result.data);
    return result.data;
  } catch (error) {
    console.error(error);
  }
};

Lucky7Master.Lucky7PlacedBets = async function (mid, user_id, game_name) {
  try {
    let casinobets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from casinobets where game_name=? and mid = ? and user_id=? order by updated_at desc",
        [game_name, mid, user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return casinobets;
  } catch (error) {
    console.error(error);
  }
};

module.exports = Lucky7Master;
