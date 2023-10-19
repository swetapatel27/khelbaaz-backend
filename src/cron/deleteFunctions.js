var dbConn = require("./../../config/db");
require("dotenv").config();

//delete cricket events
deleteCricketEvent = async function () {
  console.log("Matches deletion started..!!");
  try {
    let deletedMatches = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from events where open_date < CURRENT_DATE - INTERVAL 15 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    let delete_cricketCompetitions = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from competitions where open_date < CURRENT_DATE - INTERVAL 15 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    console.log("Matches deleted..!!");
    return deletedMatches;
  } catch (error) {
    return error;
  }
};

//delete tennis events and competitions
deleteTennisEvent = async function () {
  console.log("Tennis events deletion started..!!");
  try {
    let deletedMatches = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from tennisevents where open_date < CURRENT_DATE - INTERVAL 15 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    let delete_tennisCompetitions = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from tenniscompetitions where open_date < CURRENT_DATE - INTERVAL 15 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    console.log("Tennis events deleted..!!");
    return deletedMatches;
  } catch (error) {
    return error;
  }
};

//delete soccer events
deleteSoccerEvent = async function () {
  console.log("soccer events deletion started..!!");
  try {
    let deletedMatches = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from soccerevents where open_date < CURRENT_DATE - INTERVAL 15 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    let delete_soccerCompetitions = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from soccercompetitions where open_date < CURRENT_DATE - INTERVAL 15 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    console.log("soccer events deleted..!!");
    return deletedMatches;
  } catch (error) {
    return error;
  }
};

deleteCricketOdds = async function () {
  try {
    let delete_odds = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from marketodds where updated_at  < CURRENT_DATE - INTERVAL 30 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  } catch (error) {
    return error;
  }
};

deleteCricketSessions = async function () {
  try {
    let delete_odds = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from sessions where updated_at  < CURRENT_DATE - INTERVAL 30 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  } catch (error) {
    return error;
  }
};

deleteTennisOdds = async function () {
  try {
    let delete_odds = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from tennisodds where updated_at  < CURRENT_DATE - INTERVAL 30 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  } catch (error) {
    return error;
  }
};

deleteSoccerOdds = async function () {
  try {
    let delete_odds = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from soccerodds where updated_at  < CURRENT_DATE - INTERVAL 30 DAY;",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  } catch (error) {
    return error;
  }
};

module.exports = {
  deleteCricketEvent,
  deleteTennisEvent,
  deleteSoccerEvent,
  deleteCricketOdds,
  deleteCricketSessions,
  deleteTennisOdds,
  deleteSoccerOdds,
};
