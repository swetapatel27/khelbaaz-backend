var dbConn = require("./../../config/db");
const Exposure = require("../models/exposure");
require("dotenv").config();
const moment = require("moment");

var SessionBetsMaster = function (sessionBet) {
  this.user_id = sessionBet.user_id;
  this.event_id = sessionBet.event_id;
  this.event_name = sessionBet.market_name;
  this.runner_name = sessionBet.runner_name;
  this.type = sessionBet.type;
  this.price = sessionBet.price;
  this.size = sessionBet.size;
  this.bet_amount = sessionBet.bet_amount;
  this.loss_amount = 0 - sessionBet.loss_amount;
  this.win_amount = sessionBet.win_amount;
  this.exp_amount1 = sessionBet.exp_amount1;
  this.exp_amount2 = sessionBet.exp_amount2;
};

SessionBetsMaster.addSessionBet = async function (sessionBet, main_type) {
  const connection = await getConnection(dbConn);
  try {
    let final_exp = await Math.min(
      sessionBet.exp_amount1,
      sessionBet.exp_amount2
    );
    // console.log("main exp-->", final_exp);
    await beginTransaction(connection);

    //insert into sessionbets
    const qry_insert = "INSERT INTO sessionbets set ?";
    let insert_values = sessionBet;
    await executeQuery(connection, qry_insert, insert_values);

    //insert into exposures
    const qry_exp =
      "INSERT INTO exposures (user_id, event_id,runner_name,main_type,type,price,size,deducted_amount,exp_amount)VALUES (?,?,?,?,?,?,?,?,?)ON DUPLICATE KEY UPDATE exp_amount = ?,deducted_amount=?,updated_at=?;";
    const exp_values = [
      sessionBet.user_id,
      sessionBet.event_id,
      sessionBet.runner_name,
      main_type,
      sessionBet.type,
      sessionBet.price,
      sessionBet.size,
      final_exp,
      final_exp,
      final_exp,
      final_exp,
      moment().format("YYYY-MM-DD HH:mm:ss"),
    ];

    await executeQuery(connection, qry_exp, exp_values);
    const msg = await commitTransaction(connection);
    if (msg.includes("committed")) {
      return "Session bet placed successfully";
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

SessionBetsMaster.getSessionBetByEventId = async function (event_id, user_id) {
  try {
    let sessiobets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from sessionbets where event_id = ? and user_id = ?",
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
    return sessiobets;
  } catch (error) {
    console.log(error);
  }
};

SessionBetsMaster.getSessionBetsByRunner = async function (
  user_id,
  runner_name
) {
  try {
    let sessionbet = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from sessionbets where user_id = ? and runner_name = ?",
        [user_id, runner_name],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            console.log(res);
            resolve(res);
          }
        }
      );
    });
    return sessionbet;
  } catch (error) {}
};

SessionBetsMaster.updateSessionBet = async function (sessionBet) {
  try {
    dbConn.getConnection((err, conn) => {
      if (err) {
        throw err;
      }
      //update into sessionbets
      conn.query(
        "UPDATE sessionbets set updated_at=?, type=?,price=?,size=?,loss_amount=?,win_amount=?, is_switched = ? where user_id=? and runner_name=?",
        [
          moment().format("YYYY-MM-DD HH:mm:ss"),
          sessionBet.type,
          sessionBet.price,
          sessionBet.size,
          sessionBet.loss_amount,
          sessionBet.win_amount,
          sessionBet.is_switched,
          sessionBet.user_id,
          sessionBet.runner_name,
        ],
        (err, res) => {
          if (err) {
            return conn.rollback(() => {
              conn.release();
              throw err;
            });
          }

          //update the user balance
          conn.query(
            "UPDATE users SET balance = balance - ? WHERE id = ? ",
            [sessionBet.exp_amount, sessionBet.user_id],
            (err, res) => {
              if (err) {
                return conn.rollback(() => {
                  conn.release();
                  throw err;
                });
              }

              //insert exposure
              let newExp = {
                user_id: sessionBet.user_id,
                event_id: sessionBet.event_id,
                runner_name: sessionBet.runner_name,
                main_type: sessionBet.main_type,
                type: sessionBet.type,
                price: sessionBet.price,
                size: sessionBet.size,
                deducted_amount: sessionBet.loss_amount,
                exp_amount: 0 - sessionBet.exp_amount,
              };

              conn.query(
                "UPDATE exposures set updated_at=?,type=?,price=?,size=?,exp_amount=? where user_id = ? and runner_name=?",
                [
                  moment().format("YYYY-MM-DD HH:mm:ss"),
                  newExp.type,
                  newExp.price,
                  newExp.size,
                  newExp.exp_amount,
                  newExp.user_id,
                  newExp.runner_name,
                ],
                (err, res) => {
                  if (err) {
                    return conn.rollback(() => {
                      conn.release();
                      throw err;
                    });
                  }

                  // commit the transaction if both queries were successful
                  conn.query("COMMIT", (err) => {
                    if (err) {
                      return conn.rollback(() => {
                        conn.release();
                        throw err;
                      });
                    }
                    console.log(
                      "Transaction updated and completed successfully."
                    );
                    conn.release();
                  });
                }
              );
            }
          );
        }
      );
    });
    return "Switched successfully";
  } catch (error) {
    console.log(error);
  }
};

SessionBetsMaster.betHistoryByEventId = async function (event_id) {
  try {
    let sessionbet = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT event_id,runner_name,type,sum(loss_amount) as 'total_loss_amount',sum(win_amount) as 'total_win_amount',updated_at,status, count(*) as bet_count FROM `sessionbets` group by runner_name, type HAVING event_id = ? and status=1 ",
        [event_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return sessionbet;
  } catch (error) {}
};

SessionBetsMaster.getSessionBetsByUserID = async function (user_id) {
  try {
    let sessionbet = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT * from sessionbets where user_id = ? order by updated_at desc",
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
    return sessionbet;
  } catch (error) {}
};

SessionBetsMaster.getBetHistoryByRunner = async function (
  runner_name,
  event_id
) {
  try {
    let sessionhistory_byrunner = await new Promise((resolve, reject) => {
      let qry =
        "select users.name,events.event_name,sessionbets.* from sessionbets join users on users.id = sessionbets.user_id join events on sessionbets.event_id = events.event_id where sessionbets.runner_name = '" +
        runner_name.trim() +
        "' and sessionbets.event_id=" +
        event_id.trim() +
        " order by sessionbets.updated_at";
      console.log(qry);
      dbConn.query(qry, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    return sessionhistory_byrunner;
  } catch (error) {}
};

SessionBetsMaster.getSessionBetsByDateFilter = async function (
  user_id,
  from,
  to
) {
  try {
    let sessionbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select events.event_id,events.event_name,sessionbets.user_id,sessionbets.runner_name,sessionbets.type,sum(loss_amount) as loss_amount,sum(win_amount) as win_amount,sessionbets.status,sessionbets.updated_at from sessionbets join events on sessionbets.event_id = events.event_id GROUP BY sessionbets.runner_name, sessionbets.type, sessionbets.event_id HAVING sessionbets.user_id = ? and DATE(updated_at) BETWEEN ? AND ?",
        [user_id, from, to],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return sessionbets;
  } catch (error) {}
};

SessionBetsMaster.getOpenSessionBets = async function (
  user_id,
  status = 0,
  days = 3
) {
  try {
    // "SELECT so.*,  e.event_name,sessionbets.* FROM sessionbets INNER JOIN( SELECT event_id,runner_name, max(updated_at) as max_updated_at from sessionbets where user_id = ? and status = 1 GROUP BY runner_name, event_id)latest_bets ON sessionbets.event_id = latest_bets.event_id AND sessionbets.updated_at = latest_bets.max_updated_at INNER JOIN events e ON sessionbets.event_id = e.event_id join sessions so on sessionbets.event_id = so.event_id where sessionbets.runner_name = so.runner_name",
    let sessionbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from sessionbets where user_id = ? AND status = ? AND updated_at >= DATE(NOW() - INTERVAL ? DAY) ORDER BY id DESC",
        [user_id, status, days],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return sessionbets;
  } catch (error) {}
};

SessionBetsMaster.getOpenSessionBetsInAdmin = async function (user_id) {
  try {
    let sessionbets = await new Promise((resolve, reject) => {
      dbConn.query(
        //"SELECT e.event_name, sb.* FROM sessionbets sb JOIN events e ON sb.event_id = e.event_id WHERE sb.user_id = ? AND (sb.updated_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) OR sb.status=0);",
        "SELECT sb.* FROM sessionbets sb WHERE sb.user_id = ? AND (sb.updated_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) OR sb.status=0);",
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
    return sessionbets;
  } catch (error) {}
};

//get bet history for each admin based on event id
SessionBetsMaster.getSessionBetsPlaced = async function (creator_id, event_id) {
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
        "SELECT u.username, s.* FROM `sessionbets` s join users as u on u.id = s.user_id WHERE s.event_id = ? order by s.updated_at desc ";
      values = [event_id];
    } else {
      qry =
        "SELECT u.username, s.* FROM `sessionbets` s join users as u on u.id = s.user_id WHERE FIND_IN_SET(?,creator_id) and s.event_id = ? order by s.updated_at desc ";
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

//get exposure for each admin
SessionBetsMaster.getSessionAdminExp = async function (admin_id, event_id) {
  try {
    let qry = "";
    values = [];
    // console.log("adminid-->", admin_id);
    if (admin_id == 1 || admin_id == 21) {
      qry =
        "SELECT event_id,runner_name,main_type,user_id,sum(exp_amount) as total_exposure, ((sum(exp_amount)*u.user_share)/100) as share FROM `exposures` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u where event_id = ? and main_type='session' and user_id in (SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role = 5) group by runner_name,event_id";
      values = [admin_id, event_id, admin_id];
    } else if (admin_id != 1 || admin_id != 21) {
      qry =
        "SELECT event_id,runner_name,main_type,sum(exp_amount) as total_exposure,sum(exp_amount) as share from exposures where event_id = ? and main_type='session' group by runner_name,event_id";
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

//get session by runner, event and user
SessionBetsMaster.getSessionByRunnerEvent = async function (
  user_id,
  event_id,
  runner_name
) {
  try {
    let user_total_exp = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from sessionbets where user_id=? and event_id=? and runner_name=? order by updated_at desc",
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

SessionBetsMaster.addAndDeleteSessionBets = async function (
  event_id,
  runner_name
) {
  try {
    let bets_added = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO deletedsessionbets (bet_id,user_id,event_id,event_name,main_type,runner_name,type,price,size,bet_amount,loss_amount,win_amount,exp_amount1,exp_amount2,profit_loss,status,is_won,is_switched,created_at,updated_at) SELECT * FROM sessionbets WHERE runner_name = ? AND event_id = ?",
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
        "DELETE FROM sessionbets WHERE runner_name = ? AND event_id = ?",
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
        "DELETE FROM exposures WHERE runner_name = ? AND event_id = ? AND main_type = 'session'",
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

SessionBetsMaster.deleteSessionbets = async function (ids) {
  try {
    let bets_added = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO deletedsessionbets (bet_id,user_id,event_id,event_name,main_type,runner_name,type,price,size,bet_amount,loss_amount,win_amount,exp_amount1,exp_amount2,profit_loss,status,is_won,is_switched,created_at,updated_at) SELECT * FROM sessionbets where id IN (?)",
        [ids],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    let deleted_bets = await new Promise((resolve, reject) => {
      dbConn.query(
        "delete from sessionbets where id IN (?)",
        [ids],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return deleted_bets;
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

module.exports = SessionBetsMaster;
