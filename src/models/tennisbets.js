var dbConn = require("./../../config/db");
const Exposure = require("../models/exposure");
require("dotenv").config();
const moment = require("moment");

var TennisBetsMaster = function (tennisBet) {
  this.user_id = tennisBet.user_id;
  this.event_id = tennisBet.event_id;
  this.market_id = tennisBet.market_id;
  this.event_name = tennisBet.market_name;
  this.runner_name = tennisBet.runner_name;
  this.type = tennisBet.type;
  this.price = tennisBet.price;
  this.size = tennisBet.size;
  this.bet_amount = tennisBet.bet_amount;
  this.loss_amount = tennisBet.loss_amount;
  this.win_amount = tennisBet.win_amount;
  this.exp_amount1 = tennisBet.exp_amount1;
  this.exp_amount2 = tennisBet.exp_amount2;
  this.exp_amount3 = tennisBet.exp_amount3;
};

TennisBetsMaster.addTennisBet = async function (
  tennisBet,
  main_type,
  market_name,
  enable_draw
) {
  const connection = await getConnection(dbConn);
  try {
    console.log("TM-->", tennisBet);
    let final_exp = 0;
    if (enable_draw) {
      final_exp = await Math.min(
        tennisBet.exp_amount1,
        tennisBet.exp_amount2,
        tennisBet.exp_amount3
      );
    } else if (enable_draw == false) {
      final_exp = await Math.min(tennisBet.exp_amount1, tennisBet.exp_amount2);
    }
    if (final_exp > 0) {
      final_exp = 0 - final_exp;
    }
    // console.log("main exp-->", final_exp);
    await beginTransaction(connection);
    //insert into matchbets
    const qry_insert = "INSERT INTO tennisbets set ?";
    let insert_values = tennisBet;
    await executeQuery(connection, qry_insert, insert_values);

    //insert into exposures
    const qry_exp =
      "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount,exp_amount1,exp_amount2,exp_amount3)VALUES (?,?,?,?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,exp_amount1=?,exp_amount2=?,exp_amount3=?,updated_at=?;";
    const exp_values = [
      tennisBet.user_id,
      tennisBet.event_id,
      tennisBet.runner_name,
      main_type,
      tennisBet.type,
      tennisBet.price,
      tennisBet.size,
      final_exp,
      final_exp,
      tennisBet.exp_amount1,
      tennisBet.exp_amount2,
      tennisBet.exp_amount3,
      final_exp,
      final_exp,
      tennisBet.exp_amount1,
      tennisBet.exp_amount2,
      tennisBet.exp_amount3,
      moment().format("YYYY-MM-DD HH:mm:ss"),
    ];

    await executeQuery(connection, qry_exp, exp_values);
    const msg = await commitTransaction(connection);
    if (msg.includes("committed")) {
      return "bet placed successfully";
    }
  } catch (error) {
    console.error("Error in transaction:", error);
    // Rollback the transaction if any query encounters an error
    const msg = await rollbackTransaction(connection);
    return msg;
  } finally {
    // Release the connection back to the pool
    connection.release();
    console.log("Connection released.");
  }
};

TennisBetsMaster.getTennisBetByEventIdByUserID = async function (
  event_id,
  user_id
) {
  try {
    let tennisbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from tennisbets where user_id = ? and event_id = ? and status = 1 order by updated_at desc LIMIT 1",
        [user_id, event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return tennisbets;
  } catch (error) {
    console.log(error);
  }
};

TennisBetsMaster.getTennisBetsByEventId = async function (event_id, user_id) {
  try {
    let tennisBets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from tennisbets where event_id = ? and user_id=? order by updated_at desc",
        [event_id, user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return tennisBets;
  } catch (error) {
    console.log(error);
  }
};

//get bet history for each admin based on event id
TennisBetsMaster.getTennisBetsPlaced = async function (creator_id, event_id) {
  try {
    let role_id = await new Promise((resolve, reject) => {
      dbConn.query(
        "select role from users where id = ?",
        creator_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0].role);
          }
        }
      );
    });
    if (role_id == 0) {
      qry =
        "SELECT u.username, m.* FROM `tennisbets` m join users as u on u.id = m.user_id WHERE m.event_id = ? order by m.updated_at desc ";
      values = [event_id];
    } else {
      qry =
        "SELECT u.username, m.* FROM `tennisbets` m join users as u on u.id = m.user_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc";
      values = [creator_id, event_id];
    }
    let betplaced = await new Promise((resolve, reject) => {
      dbConn.query(qry, values, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    return betplaced;
  } catch (error) {
    console.log(error);
  }
};

//get all open bets for user
TennisBetsMaster.getOpenTennisBets = async function (user_id,status=0,days=3) {
  try {
    // "SELECT t.*, te.event_name, tennisbets.* FROM tennisbets INNER JOIN ( SELECT event_id, MAX(updated_at) AS max_updated_at FROM tennisbets where user_id = ? AND status = 1 GROUP BY event_id ) latest_bets ON tennisbets.event_id = latest_bets.event_id AND tennisbets.updated_at = latest_bets.max_updated_at INNER JOIN tennisevents te ON tennisbets.event_id = te.event_id join tennisodds t on tennisbets.event_id = t.event_id;",
    let tennisbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from tennisbets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC",
        [user_id,status,days],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return tennisbets;
  } catch (error) {
    console.log(error);
  }
};

//get all open bets for user in admin
TennisBetsMaster.getOpenTennisBetsInAdmin = async function (user_id) {
  try {
    let tennisbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select tb.* from tennisbets tb where tb.user_id = ? AND (tb.updated_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) OR tb.status=0);",
        [user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return tennisbets;
  } catch (error) {
    console.log(error);
  }
};

//summation of exposures for specific event_id and respective admin/agents
TennisBetsMaster.getSumExpByTennisEvent = async function (
  creator_id,
  event_id
) {
  try {
    let sum_exp_event = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN users u ON e.user_id = u.id WHERE FIND_IN_SET(?, u.creator_id) > 0 and e.event_id = ?",
        [creator_id, event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return sum_exp_event;
  } catch (error) {
    console.log(error);
  }
};

//all eventwise summation of exposures for respective admin/agents but for inplay matches only and is not declared(changed recently)

TennisBetsMaster.getSumExpInPlayTennisEvents = async function (creator_id) {
  try {
    let qry = "";
    if (creator_id == 1 || creator_id == 21) {
      qry =
        "SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN tennisodds m ON e.event_id = m.event_id JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = e.user_id where (e.status = 1 and e.main_type = 'match_odd') and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id ";
    } else if (creator_id != 1 || creator_id != 21) {
      qry =
        "SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN tennisodds m ON e.event_id = m.event_id JOIN users u ON u.id = e.user_id where (e.status = 1 and e.main_type = 'match_odd') and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id ";
    }
    let sum_exp_inplayevents = await new Promise((resolve, reject) => {
      dbConn.query(qry, [creator_id], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    return sum_exp_inplayevents;
  } catch (error) {
    console.log(error);
  }
};

//get exposure status of users for particular event for agents
TennisBetsMaster.getUserExpStatus = async function (creator_id, event_id) {
  try {
    let user_exp = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT u.username, mb.*, e.runner1,e.runner2 FROM users u JOIN tennisbets mb ON u.id = mb.user_id JOIN tennisodds e ON mb.event_id = e.event_id JOIN ( SELECT user_id, MAX(created_at) AS latest_updated_at FROM tennisbets WHERE event_id = ? GROUP BY user_id ) latest ON mb.user_id = latest.user_id AND mb.created_at = latest.latest_updated_at WHERE FIND_IN_SET(?, u.creator_id) > 0;",
        [event_id, creator_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return user_exp;
  } catch (error) {
    console.log(error);
  }
};

// Function to get a connection from the pool
function getConnection(pool) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      resolve(connection);
    });
  });
}

// Function to begin a transaction
function beginTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) reject(err);
      console.log("Transaction started!");
      resolve();
    });
  });
}

// Function to execute a query
function executeQuery(connection, query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, result) => {
      if (err) reject(err);
      console.log("Query executed successfully!");
      resolve(result);
    });
  });
}

// Function to commit a transaction
function commitTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) reject(err);
      console.log("Transaction committed successfully!");
      resolve("Transaction committed successfully!");
    });
  });
}

// Function to rollback a transaction
function rollbackTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.rollback(() => {
      console.log("Transaction rolled back!");
      resolve("Transaction rolled back!");
    });
  });
}

module.exports = TennisBetsMaster;
