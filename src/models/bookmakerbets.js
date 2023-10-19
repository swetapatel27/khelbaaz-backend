var dbConn = require("../../config/db");
const Exposure = require("./exposure");
const moment = require("moment");
require("dotenv").config();

var BookmakerbetMaster = function (matchBet) {
  this.user_id = matchBet.user_id;
  this.event_id = matchBet.event_id;
  this.market_id = matchBet.market_id;
  this.event_name = matchBet.market_name;
  this.runner_name = matchBet.runner_name;
  this.type = matchBet.type;
  this.price = matchBet.price;
  this.size = matchBet.size;
  this.bet_amount = matchBet.bet_amount;
  this.loss_amount = matchBet.loss_amount;
  this.win_amount = matchBet.win_amount;
  this.exp_amount1 = matchBet.exp_amount1;
  this.exp_amount2 = matchBet.exp_amount2;
  this.exp_amount3 = matchBet.exp_amount3;
};

BookmakerbetMaster.addBookMakerBet = async function (
  matchBet,
  main_type,
  market_name,
  enable_draw
) {
  const connection = await getConnection(dbConn);
  try {
    console.log("BM-->", matchBet);
    let final_exp = 0;
    if (enable_draw) {
      final_exp = await Math.min(
        matchBet.exp_amount1,
        matchBet.exp_amount2,
        matchBet.exp_amount3
      );
    } else if (enable_draw == false) {
      final_exp = await Math.min(matchBet.exp_amount1, matchBet.exp_amount2);
    }
    // if (final_exp > 0) {
    //   final_exp = 0 - final_exp;
    // }
    // console.log("main exp-->", final_exp);

    await beginTransaction(connection);
    //insert into matchbets
    const qry_insert = "INSERT INTO bookmakerbets set ?";
    let insert_values = matchBet;
    await executeQuery(connection, qry_insert, insert_values);

    //insert into exposures
    const qry_exp =
      "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount,exp_amount1,exp_amount2,exp_amount3)VALUES (?,?,?,?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,exp_amount1=?,exp_amount2=?,exp_amount3=?,updated_at=?;";
    const exp_values = [
      matchBet.user_id,
      matchBet.event_id,
      market_name,
      main_type,
      matchBet.type,
      matchBet.price,
      matchBet.size,
      final_exp,
      final_exp,
      matchBet.exp_amount1,
      matchBet.exp_amount2,
      matchBet.exp_amount3,
      final_exp,
      final_exp,
      matchBet.exp_amount1,
      matchBet.exp_amount2,
      matchBet.exp_amount3,
      moment().format("YYYY-MM-DD HH:mm:ss"),
    ];

    await executeQuery(connection, qry_exp, exp_values);
    const msg = await commitTransaction(connection);
    if (msg.includes("committed")) {
      return "Bookmaker bet placed successfully";
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

BookmakerbetMaster.getBookBetByEventIdByUserID = async function (
  event_id,
  user_id
) {
  try {
    let matchbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from bookmakerbets where user_id = ? and event_id = ? and status = 1 order by updated_at desc LIMIT 1",
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
    return matchbets;
  } catch (error) {
    console.log(error);
  }
};

BookmakerbetMaster.getAllMatchBetsByEventId = async function (
  event_id,
  user_id
) {
  try {
    let bookmakerbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from bookmakerbets where event_id = ? and user_id=? order by updated_at desc",
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
    return bookmakerbets;
  } catch (error) {
    console.log(error);
  }
};

//get bet history for each admin based on event id
BookmakerbetMaster.getBookmakerBetsPlaced = async function (
  creator_id,
  event_id
) {
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
        "SELECT u.username, m.* FROM `bookmakerbets` m join users as u on u.id = m.user_id WHERE m.event_id = ? order by m.updated_at desc ";
      values = [event_id];
    } else {
      qry =
        "SELECT u.username, m.* FROM `bookmakerbets` m join users as u on u.id = m.user_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
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

//summation of exposures for specific event_id and respective admin/agents
BookmakerbetMaster.getBookmakerSumExpByEvent = async function (
  creator_id,
  event_id
) {
  try {
    const sum_exp_event = await new Promise((resolve, reject) => {
      // old_query = "SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2,SUM(exp_amount3) AS sum_exp_amount3 FROM (SELECT mb.event_id, mb.exp_amount1, mb.exp_amount2, mb.exp_amount3,ROW_NUMBER() OVER (PARTITION BY mb.event_id, mb.user_id ORDER BY mb.updated_at DESC) AS row_num FROM matchbets mb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = mb.user_id) subquery WHERE row_num = 1 AND event_id = ? GROUP BY event_id;"
      dbConn.query(
        "SELECT SUM(e.exp_amount1) AS sum_exp_amount1, SUM(e.exp_amount2) AS sum_exp_amount2, SUM(e.exp_amount3) AS sum_exp_amount3 FROM exposures e JOIN users u ON e.user_id = u.id WHERE FIND_IN_SET(?, u.creator_id) > 0 and e.event_id = ? and e.main_type='bookmaker'",
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

//get all open bets for user in admin
BookmakerbetMaster.getOpenBookmakerBetsInAdmin = async function (user_id) {
  try {
    let bookmakerbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select tb.* from bookmakerbets tb where tb.user_id = ? AND (tb.updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) OR tb.status=0);",
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
    return bookmakerbets;
  } catch (error) {
    console.log(error);
  }
};

BookmakerbetMaster.getOpenMatchBets = async function (user_id,status=0,days=3) {
  try {
    // "SELECT mo.*, e.event_name, bookmakerbets.* FROM bookmakerbets INNER JOIN ( SELECT event_id, MAX(updated_at) AS max_updated_at FROM bookmakerbets where user_id = ? AND status = 1 GROUP BY event_id ) latest_bets ON bookmakerbets.event_id = latest_bets.event_id AND bookmakerbets.updated_at = latest_bets.max_updated_at INNER JOIN events e ON bookmakerbets.event_id = e.event_id join marketodds mo on bookmakerbets.event_id = mo.event_id;"
    let matchbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from bookmakerbets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC",
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
    //console.log(matchbets);
    return matchbets;
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
module.exports = BookmakerbetMaster;
