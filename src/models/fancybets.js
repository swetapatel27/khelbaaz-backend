var dbConn = require("./../../config/db");
const Exposure = require("../models/exposure");
require("dotenv").config();
const moment = require("moment");

var FancyBetsMaster = function (fancyBet) {
  this.user_id = fancyBet.user_id;
  this.event_id = fancyBet.event_id;
  this.market_id = fancyBet.market_id;
  this.event_name = fancyBet.market_name;
  this.runner_name = fancyBet.runner_name;
  this.type = fancyBet.type;
  this.price = fancyBet.price;
  this.size = fancyBet.size;
  this.bet_amount = fancyBet.bet_amount;
  this.loss_amount = fancyBet.loss_amount;
  this.win_amount = fancyBet.win_amount;
  this.exp_amount1 = fancyBet.exp_amount1;
  this.exp_amount2 = fancyBet.exp_amount2;
};

FancyBetsMaster.addFancyBet = async function (
  fancyBet,
  main_type,
  market_name,
  enable_draw
) {
  const connection = await getConnection(dbConn);
  try {
    console.log("FB-->", fancyBet);
    let final_exp = 0;
    final_exp = await Math.min(fancyBet.exp_amount1, fancyBet.exp_amount2);

    await beginTransaction(connection);
    //insert into matchbets
    const qry_insert = "INSERT INTO fancybets set ?";
    let insert_values = fancyBet;
    await executeQuery(connection, qry_insert, insert_values);

    //insert into exposures
    const qry_exp =
      "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount,exp_amount1,exp_amount2)VALUES (?,?,?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,exp_amount1=?,exp_amount2=?,updated_at=?;";
    const exp_values = [
      fancyBet.user_id,
      fancyBet.event_id,
      fancyBet.runner_name,
      main_type,
      fancyBet.type,
      fancyBet.price,
      fancyBet.size,
      final_exp,
      final_exp,
      fancyBet.exp_amount1,
      fancyBet.exp_amount2,
      final_exp,
      final_exp,
      fancyBet.exp_amount1,
      fancyBet.exp_amount2,
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

FancyBetsMaster.getFancyBetByEventIdByUserID = async function (
  event_id,
  user_id
) {
  try {
    let fancybets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from fancybets where user_id = ? and event_id = ? and status = 1 order by updated_at desc LIMIT 1",
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
    return fancybets;
  } catch (error) {
    console.log(error);
  }
};

//get session by runner, event and user
FancyBetsMaster.getFancyByRunnerEvent = async function (
  user_id,
  event_id,
  runner_name
) {
  try {
    let user_total_exp = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from fancybets where user_id=? and event_id=? and runner_name=? order by updated_at desc limit 1",
        [user_id, event_id, runner_name],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return user_total_exp;
  } catch (error) {
    console.log(error);
  }
};

FancyBetsMaster.getFancyBetsByEventId = async function (event_id, user_id) {
  try {
    let fancyBets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from fancybets where event_id = ? and user_id=? order by updated_at desc",
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
    return fancyBets;
  } catch (error) {
    console.log(error);
  }
};

//get bet history for each admin based on event id
FancyBetsMaster.getFancyBetsPlaced = async function (creator_id, event_id) {
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
        "SELECT u.username, m.* FROM `fancybets` m join users as u on u.id = m.user_id WHERE m.event_id = ? order by m.updated_at desc ";
      values = [event_id];
    } else {
      qry =
        "SELECT u.username, m.* FROM `fancybets` m join users as u on u.id = m.user_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
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
FancyBetsMaster.getOpenFancyBets = async function (user_id,status=0,days=3) {
  try {
    // "SELECT t.*, te.event_name, fancybets.* FROM fancybets INNER JOIN ( SELECT event_id, MAX(updated_at) AS max_updated_at FROM fancybets where user_id = ? AND status = 1 GROUP BY event_id ) latest_bets ON fancybets.event_id = latest_bets.event_id AND fancybets.updated_at = latest_bets.max_updated_at INNER JOIN fancyevents te ON fancybets.event_id = te.event_id join fancyodds t on fancybets.event_id = t.event_id;",
    let fancybets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from fancybets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC",
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
    return fancybets;
  } catch (error) {
    console.log(error);
  }
};

//get all open bets for user in admin
FancyBetsMaster.getOpenFancyBetsInAdmin = async function (user_id) {
  try {
    let fancybets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select tb.* from fancybets tb where tb.user_id = ? AND (tb.updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) OR tb.status=0);",
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
    return fancybets;
  } catch (error) {
    console.log(error);
  }
};

//summation of exposures for specific event_id and respective admin/agents
FancyBetsMaster.getSumExpByFancyEvent = async function (creator_id, event_id) {
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

FancyBetsMaster.getSumExpInPlayFancyEvents = async function (creator_id) {
  try {
    let qry = "";
    if (creator_id == 1 || creator_id == 21) {
      qry =
        "SELECT e.event_id, e.open_date, e.event_name,tod.runner1,tod.runner2, mt.sum_exp_amount1, mt.sum_exp_amount2, mt.sum_exp_amount3 FROM ( SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2, SUM(exp_amount3) AS sum_exp_amount3 FROM ( SELECT tb.event_id, tb.exp_amount1, tb.exp_amount2, tb.exp_amount3, ROW_NUMBER() OVER (PARTITION BY tb.event_id, tb.user_id ORDER BY tb.updated_at DESC) AS row_num FROM fancybets tb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = tb.user_id ) subquery WHERE row_num = 1 GROUP BY event_id ) mt JOIN ( SELECT event_id FROM fancyodds WHERE is_declared = 0 GROUP BY event_id ) mo_declared ON mo_declared.event_id = mt.event_id JOIN fancyodds tod ON tod.event_id = mt.event_id JOIN fancyevents e ON e.event_id = mt.event_id WHERE tod.inplay = 1 or tod.is_declared = 0;";
    } else if (creator_id != 1 || creator_id != 21) {
      qry =
        "SELECT e.event_id, e.open_date, e.event_name,tod.runner1,tod.runner2, mt.sum_exp_amount1, mt.sum_exp_amount2, mt.sum_exp_amount3 FROM ( SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2, SUM(exp_amount3) AS sum_exp_amount3 FROM ( SELECT tb.event_id, tb.exp_amount1, tb.exp_amount2, tb.exp_amount3, ROW_NUMBER() OVER (PARTITION BY tb.event_id, tb.user_id ORDER BY tb.updated_at DESC) AS row_num FROM fancybets tb JOIN users u ON u.id = tb.user_id ) subquery WHERE row_num = 1 GROUP BY event_id ) mt JOIN ( SELECT event_id FROM fancyodds WHERE is_declared = 0 GROUP BY event_id ) mo_declared ON mo_declared.event_id = mt.event_id JOIN fancyodds tod ON tod.event_id = mt.event_id JOIN fancyevents e ON e.event_id = mt.event_id WHERE tod.inplay = 1 or tod.is_declared = 0;";
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
FancyBetsMaster.getUserExpStatus = async function (creator_id, event_id) {
  try {
    let user_exp = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT u.username, mb.*, e.runner1,e.runner2 FROM users u JOIN fancybets mb ON u.id = mb.user_id JOIN fancyodds e ON mb.event_id = e.event_id JOIN ( SELECT user_id, MAX(created_at) AS latest_updated_at FROM fancybets WHERE event_id = ? GROUP BY user_id ) latest ON mb.user_id = latest.user_id AND mb.created_at = latest.latest_updated_at WHERE FIND_IN_SET(?, u.creator_id) > 0;",
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

//get exposure for each admin
FancyBetsMaster.getFancyAdminExp = async function (admin_id, event_id) {
  try {
    let qry = "";
    values = [];
    // console.log("adminid-->", admin_id);
    if (admin_id == 1 || admin_id == 21) {
      qry =
        "SELECT event_id,runner_name,main_type,user_id,sum(exp_amount) as total_exposure, ((sum(exp_amount)*u.user_share)/100) as share FROM `exposures` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u where event_id = ? and main_type='fancy' and user_id in (SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role = 5) group by runner_name,event_id";
      values = [admin_id, event_id, admin_id];
    } else if (admin_id != 1 || admin_id != 21) {
      qry =
        "SELECT event_id,runner_name,main_type,sum(exp_amount) as total_exposure,sum(exp_amount) as share from exposures where event_id = ? and main_type='fancy' group by runner_name,event_id";
      values = [event_id];
    }

    // console.log("qry-->", qry);

    // let qry = "SELECT runner_name,event_id, sum(exp_amount1) as e1,sum(exp_amount2) as e2,sum(exp_amount3) as e3, ((sum(exp_amount1)*u.user_share)/100) as share1,((sum(exp_amount2)*u.user_share)/100) as share2,((sum(exp_amount3)*u.user_share)/100) as share3 FROM `matchbets` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u GROUP BY runner_name having matchbets.event_id = ? "
    let user_total_exp = await new Promise((resolve, reject) => {
      dbConn.query(qry, values, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    return user_total_exp;
  } catch (error) {
    console.log(error);
  }
};

FancyBetsMaster.addAndDeleteFancyBets = async function (
  event_id,
  runner_name
) {
  try {
    let bets_added = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO deletedfancybets (`bet_id`, `user_id`, `event_id`, `market_id`, `event_name`, `main_type`, `runner_name`, `type`, `price`, `size`, `bet_amount`, `loss_amount`, `win_amount`, `exp_amount1`, `exp_amount2`, `profit_loss`, `status`, `is_won`, `is_switched`, `created_at`, `updated_at`) SELECT * FROM fancybets WHERE runner_name = ? AND event_id = ?",
        [runner_name, event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    let delete_bets = await new Promise((resolve, reject) => {
      dbConn.query(
        "DELETE FROM fancybets WHERE runner_name = ? AND event_id = ?",
        [runner_name, event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    let delete_exposure = await new Promise((resolve, reject) => {
      dbConn.query(
        "DELETE FROM exposures WHERE runner_name = ? AND event_id = ? AND main_type = 'fancy'",
        [runner_name, event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return delete_exposure;
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

module.exports = FancyBetsMaster;
