var dbConn = require("./../../config/db");
const axios = require("axios");

require("dotenv").config();

var ScoreMaster = function () {};

ScoreMaster.getScoreById = async function (event_id) {
  try {
    // console.log("event--->>", event_id);
    // console.log("event--->>", process.env.SCORE_URL + event_id);
    let response = await axios.get(process.env.SCORE_URL + event_id);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = ScoreMaster;
