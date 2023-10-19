var dbConn = require("./../../config/db");
const Exposure = require("../models/exposure");
const moment = require("moment");
require("dotenv").config();

var SoccerBetsMaster = function (soccerBet) {
  this.user_id = soccerBet.user_id;
  this.event_id = soccerBet.event_id;
  this.event_name = soccerBet.market_name;
  this.market_id = soccerBet.market_id;
  this.runner_name = soccerBet.runner_name;
  this.type = soccerBet.type;
  this.price = soccerBet.price;
  this.size = soccerBet.size;
  this.bet_amount = soccerBet.bet_amount;
  this.loss_amount = soccerBet.loss_amount;
  this.win_amount = soccerBet.win_amount;
  this.exp_amount1 = soccerBet.exp_amount1;
  this.exp_amount2 = soccerBet.exp_amount2;
  this.exp_amount3 = soccerBet.exp_amount3;
};

SoccerBetsMaster.addSoccerBet = async function (
  soccerBet,
  main_type,
  market_name,
  enable_draw
) {
  const connection = await getConnection(dbConn);
  try {
    console.log("SM-->", soccerBet);
    let final_exp = 0;
    if (enable_draw) {
      final_exp = await Math.min(
        soccerBet.exp_amount1,
        soccerBet.exp_amount2,
        soccerBet.exp_amount3
      );
    } else if (enable_draw == false) {
      final_exp = await Math.min(soccerBet.exp_amount1, soccerBet.exp_amount2);
    }
    if (final_exp > 0) {
      final_exp = 0 - final_exp;
    }
    // console.log("main exp-->", final_exp);

    await beginTransaction(connection);
    //insert into matchbets
    const qry_insert = "INSERT INTO soccerbets set ?";
    let insert_values = soccerBet;
    await executeQuery(connection, qry_insert, insert_values);

    //insert into exposures
    const qry_exp =
      "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount,exp_amount1,exp_amount2,exp_amount3)VALUES (?,?,?,?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,exp_amount1=?,exp_amount2=?,exp_amount3=?,updated_at=?;";
    const exp_values = [
      soccerBet.user_id,
      soccerBet.event_id,
      soccerBet.runner_name,
      main_type,
      soccerBet.type,
      soccerBet.price,
      soccerBet.size,
      final_exp,
      final_exp,
      soccerBet.exp_amount1,
      soccerBet.exp_amount2,
      soccerBet.exp_amount3,
      final_exp,
      final_exp,
      soccerBet.exp_amount1,
      soccerBet.exp_amount2,
      soccerBet.exp_amount3,
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

SoccerBetsMaster.getSoccerBetByEventIdByUserID = async function (
  event_id,
  user_id
) {
  try {
    let soccerbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from soccerbets where user_id = ? and event_id = ? and status = 1 order by updated_at desc LIMIT 1",
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
    return soccerbets;
  } catch (error) {
    console.log(error);
  }
};

SoccerBetsMaster.getSoccerBetsByEventId = async function (event_id, user_id) {
  try {
    let soccerBets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from soccerbets where event_id = ? and user_id=? order by updated_at desc",
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
    return soccerBets;
  } catch (error) {
    console.log(error);
  }
};

//get bet history for each admin based on event id
SoccerBetsMaster.getSoccerBetsPlaced = async function (creator_id, event_id) {
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
        "SELECT u.username,e.event_name, m.* FROM `soccerbets` m join users as u on u.id = m.user_id join soccerevents e on e.event_id = m.event_id WHERE m.event_id = ? order by m.updated_at desc ";
      values = [event_id];
    } else {
      qry =
        "SELECT u.username,e.event_name, m.* FROM `soccerbets` m join users as u on u.id = m.user_id join soccerevents e on e.event_id = m.event_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
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
SoccerBetsMaster.getOpenSoccerBets = async function (user_id,status=0,days=3) {
  try {
    //"SELECT t.*, te.event_name, soccerbets.* FROM soccerbets INNER JOIN ( SELECT event_id, MAX(updated_at) AS max_updated_at FROM soccerbets where user_id = ? AND status = 1 GROUP BY event_id ) latest_bets ON soccerbets.event_id = latest_bets.event_id AND soccerbets.updated_at = latest_bets.max_updated_at INNER JOIN soccerevents te ON soccerbets.event_id = te.event_id join soccerodds t on soccerbets.event_id = t.event_id;",
    let soccerbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from soccerbets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC",
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
    return soccerbets;
  } catch (error) {
    console.log(error);
  }
};

//get all open bets for user in admin
SoccerBetsMaster.getOpenSoccerBetsInAdmin = async function (user_id) {
  try {
    let soccerbets = await new Promise((resolve, reject) => {
      dbConn.query(
        // "select te.event_name,tb.* from soccerbets tb join soccerevents te on tb.event_id = te.event_id where tb.user_id = ? AND (tb.updated_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) OR tb.status=0);",
        "select tb.* from soccerbets tb where tb.user_id = ? AND (tb.updated_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) OR tb.status=0);",
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
    return soccerbets;
  } catch (error) {
    console.log(error);
  }
};

//summation of exposures for specific event_id and respective admin/agents
SoccerBetsMaster.getSumExpBySoccerEvent = async function (
  creator_id,
  event_id
) {
  try {
    let sum_exp_event = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2, SUM(exp_amount3) AS sum_exp_amount3 FROM ( SELECT tb.event_id, tb.exp_amount1, tb.exp_amount2, tb.exp_amount3, ROW_NUMBER() OVER (PARTITION BY tb.event_id, tb.user_id ORDER BY tb.updated_at DESC) AS row_num FROM soccerbets tb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = tb.user_id ) subquery WHERE row_num = 1 AND event_id = ? GROUP BY event_id;",
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

//all eventwise summation of exposures for respective admin/agents but for inplay matches only

SoccerBetsMaster.getSumExpInPlaySoccerEvents = async function (creator_id) {
  try {
    // "SELECT m.is_declared,e.event_id, e.open_date, e.event_name,tod.runner1,tod.runner2, mt.sum_exp_amount1, mt.sum_exp_amount2, mt.sum_exp_amount3 FROM ( SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2, SUM(exp_amount3) AS sum_exp_amount3 FROM ( SELECT tb.event_id, tb.exp_amount1, tb.exp_amount2, tb.exp_amount3, ROW_NUMBER() OVER (PARTITION BY tb.event_id, tb.user_id ORDER BY tb.updated_at DESC) AS row_num FROM soccerbets tb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = tb.user_id ) subquery WHERE row_num = 1 GROUP BY event_id ) mt JOIN ( SELECT event_id FROM soccerodds WHERE is_declared = 0 GROUP BY event_id ) mo_declared ON mo_declared.event_id = mt.event_id JOIN soccerodds tod ON tod.event_id = mt.event_id JOIN soccerevents e ON e.event_id = mt.event_id WHERE tod.inplay = 1 or tod.is_declared=0;"
    let qry = "";
    if (creator_id == 1 || creator_id == 21) {
      qry =
        "SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN soccerodds m ON e.event_id = m.event_id JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = e.user_id where (e.status = 1 and e.main_type = 'match_odd') and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id ";
    } else if (creator_id != 1 || creator_id != 21) {
      qry =
        "SELECT m.is_declared,e.event_id, e.runner_name as 'event_name', m.runner1,m.runner2, SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN soccerodds m ON e.event_id = m.event_id JOIN users u ON u.id = e.user_id where (e.status = 1 and e.main_type = 'match_odd') and (m.inplay = 1 or m.is_declared=0) GROUP BY e.event_id ";
    }
    let sum_exp_inplayevents = await new Promise((resolve, reject) => {
      dbConn.query(
        qry,
        [creator_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return sum_exp_inplayevents;
  } catch (error) {
    console.log(error);
  }
};

//get exposure status of users for particular event for agents
SoccerBetsMaster.getUserExpStatus = async function (creator_id, event_id) {
  try {
    let user_exp = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT u.username, mb.*, e.runner1,e.runner2 FROM users u JOIN soccerbets mb ON u.id = mb.user_id JOIN soccerodds e ON mb.event_id = e.event_id JOIN ( SELECT user_id, MAX(created_at) AS latest_updated_at FROM soccerbets WHERE event_id = ? GROUP BY user_id ) latest ON mb.user_id = latest.user_id AND mb.created_at = latest.latest_updated_at WHERE FIND_IN_SET(?, u.creator_id) > 0;",
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

module.exports = SoccerBetsMaster;
