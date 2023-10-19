var dbConn = require("../../config/db");
const Exposure = require("./exposure");
const moment = require("moment");
require("dotenv").config();

var BookmakebetMaster = function (matchBet) {
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

BookmakebetMaster.addBookMaketBet = async function (
  matchBet,
  main_type,
  market_name,
  enable_draw
) {
  const connection = await getConnection(dbConn);
  try {
    //console.log("BM2-->", matchBet);
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
    if (final_exp > 0) {
      final_exp = 0 - final_exp;
    }
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

BookmakebetMaster.getBookmakerBetByEventId = async function (event_id, user_id) {
  try {
    let sessiobets = await new Promise((resolve, reject) => {
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
    return sessiobets;
  } catch (error) {
    console.log(error);
  }
};

BookmakebetMaster.getMatchBetsByUserID = async function (user_id) {
  try {
    let matchbets_byuserid = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from matchbets where user_id= ? order by updated_at desc",
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
    return matchbets_byuserid;
  } catch (error) {
    console.log(error);
  }
};

BookmakebetMaster.getMatchBetHistoryByEventId = async function (event_id) {
  try {
    let matchbets_byeventid = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT event_id,runner_name,type,sum(loss_amount) as 'total_loss_amount',sum(win_amount) as 'total_win_amount',updated_at,status, count(*) as bet_count FROM `matchbets` group by runner_name, type HAVING event_id = ? and status=1 ",
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
    return matchbets_byeventid;
  } catch (error) {
    console.log(error);
  }
};

BookmakebetMaster.getBookBetByEventIdByUserID = async function (
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

BookmakebetMaster.getMatchBetByFilter = async function (user_id, from, to) {
  try {
    let matchbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT user_id,matchbets.market_id,m.runner1,m.runner2,runner_name,sum(loss_amount) as loss_amount,sum(win_amount) as win_amount,win_amount+loss_amount as total, matchbets.status, matchbets.updated_at FROM `matchbets` join marketodds as m on m.market_id = matchbets.market_id GROUP BY runner_name, market_id HAVING user_id = ? and DATE(matchbets.updated_at) BETWEEN ? AND ?;",
        [user_id, from, to],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            // Use reduce to merge objects with same ID
            const createNewArray = (res) => {
              const result = [];
              const marketIds = [];

              // Loop through each object in the original array
              res.forEach((obj) => {
                // If the market_id of the current object is not in the marketIds array
                // create a new object with an array of objects having the same market_id
                // and push it to the result array, otherwise push the current object to
                // the corresponding array in the result array
                const index = marketIds.indexOf(obj.market_id);
                if (index === -1) {
                  marketIds.push(obj.market_id);
                  result.push({ market_id: obj.market_id, runners: [obj] });
                } else {
                  result[index].runners.push(obj);
                }
              });

              return result;
            };

            // Call the function with the original array to create the new array of objects
            const newArray = createNewArray(res);

            resolve(newArray);
          }
        }
      );
    });
    return matchbets;
  } catch (error) {
    console.log(error);
  }
};

BookmakebetMaster.getOpenMatchBetsInadmin = async function (user_id) {
  try {
    let matchbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "select e.event_name,mb.* from matchbets mb join events e on mb.event_id = e.event_id where mb.user_id = ? AND (mb.updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) OR mb.status=0 ) ;",
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
    return matchbets;
  } catch (error) {
    console.log(error);
  }
};

BookmakebetMaster.getOpenMatchBets = async function (user_id) {
  try {
    let matchbets = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT mo.*, e.event_name, matchbets.* FROM matchbets INNER JOIN ( SELECT event_id, MAX(updated_at) AS max_updated_at FROM matchbets where user_id = ? AND status = 1 GROUP BY event_id ) latest_bets ON matchbets.event_id = latest_bets.event_id AND matchbets.updated_at = latest_bets.max_updated_at INNER JOIN events e ON matchbets.event_id = e.event_id join marketodds mo on matchbets.event_id = mo.event_id;",
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
    return matchbets;
  } catch (error) {
    console.log(error);
  }
};

//get matches with bets placed
BookmakebetMaster.getBetPlacedMatches = async function () {
  try {
    let betplaced_matches = await new Promise((resolve, reject) => {
      dbConn.query(
        "select event_id,event_name, open_date from events where event_id in (select DISTINCT event_id from matchbets UNION all select DISTINCT event_id from sessionbets) order by open_date desc  ",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return betplaced_matches;
  } catch (error) {
    console.log(error);
  }
};

//get all matches bets by event id
BookmakebetMaster.getAllBetsByEventId = async function (event_id) {
  try {
    let betplaced_matches = await new Promise((resolve, reject) => {
      dbConn.query(
        "select users.username, matchbets.* from matchbets join users on users.id = matchbets.user_id where event_id = ? order by updated_at",
        event_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return betplaced_matches;
  } catch (error) {
    console.log(error);
  }
};

//get bet history for each admin based on event id
BookmakebetMaster.getMatchBetsPlaced = async function (creator_id, event_id) {
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
        "SELECT u.username,e.event_name, m.* FROM `matchbets` m join users as u on u.id = m.user_id join events e on e.event_id = m.event_id WHERE m.event_id = ? order by m.updated_at desc ";
      values = [event_id];
    } else {
      qry =
        "SELECT u.username,e.event_name, m.* FROM `matchbets` m join users as u on u.id = m.user_id join events e on e.event_id = m.event_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
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
BookmakebetMaster.getAdminExp = async function (admin_id, event_id) {
  try {
    // let qry = "SELECT runner_name,event_id, sum(exp_amount1) as e1,sum(exp_amount2) as e2,sum(exp_amount3) as e3, ((sum(exp_amount1)*u.user_share)/100) as share1,((sum(exp_amount2)*u.user_share)/100) as share2,((sum(exp_amount3)*u.user_share)/100) as share3 FROM `matchbets` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u and user_id in (SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role = 5) GROUP BY runner_name having matchbets.event_id = ? "
    let user_total_exp = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT event_id,runner_name,main_type,user_id,sum(exp_amount) as total_exposure, ((sum(exp_amount)*u.user_share)/100) as share FROM `exposures` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u where event_id = ? and main_type='match_odd' and user_id in (SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role = 5) group by runner_name,event_id;",
        [admin_id, event_id, admin_id],
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

//get latest bet for each user by event_id
BookmakebetMaster.getLatestMatchBet = async function (creator_id, event_id) {
  try {
    // let qry = "SELECT runner_name,event_id, sum(exp_amount1) as e1,sum(exp_amount2) as e2,sum(exp_amount3) as e3, ((sum(exp_amount1)*u.user_share)/100) as share1,((sum(exp_amount2)*u.user_share)/100) as share2,((sum(exp_amount3)*u.user_share)/100) as share3 FROM `matchbets` CROSS JOIN (SELECT user_share FROM users where id = ?) AS u GROUP BY runner_name having matchbets.event_id = ? "
    let latestbetsplaced = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT users.username,mb.* FROM matchbets mb INNER JOIN ( SELECT user_id, MAX(updated_at) AS max_bet_timestamp FROM matchbets where event_id = ? GROUP BY user_id ) latest_bets ON mb.user_id = latest_bets.user_id AND mb.updated_at = latest_bets.max_bet_timestamp inner join users on latest_bets.user_id = users.id where mb.user_id in (SELECT id FROM users WHERE FIND_IN_SET(?, creator_id) and role = 5)",
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

    return latestbetsplaced;
  } catch (error) {
    console.log(error);
  }
};

//summation of exposures for specific event_id and respective admin/agents
BookmakebetMaster.getSumExpByEvent = async function (creator_id, event_id) {
  try {
    const sum_exp_event = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2,SUM(exp_amount3) AS sum_exp_amount3 FROM (SELECT mb.event_id, mb.exp_amount1, mb.exp_amount2, mb.exp_amount3,ROW_NUMBER() OVER (PARTITION BY mb.event_id, mb.user_id ORDER BY mb.updated_at DESC) AS row_num FROM bookmakerbets mb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = mb.user_id) subquery WHERE row_num = 1 AND event_id = ? GROUP BY event_id;",
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

//all eventwise summation of exposures for respective admin/agents but for inplay matches only and whose result is not declared(changed recently)
BookmakebetMaster.getSumExpInPlayEvents = async function (creator_id) {
  try {
    let sum_exp_inplayevents = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT e.event_id, e.open_date, e.event_name,mo.runner1, mo.runner2, mt.sum_exp_amount1, mt.sum_exp_amount2, mt.sum_exp_amount3 FROM ( SELECT event_id, SUM(exp_amount1) AS sum_exp_amount1, SUM(exp_amount2) AS sum_exp_amount2, SUM(exp_amount3) AS sum_exp_amount3 FROM ( SELECT mb.event_id, mb.exp_amount1, mb.exp_amount2, mb.exp_amount3, ROW_NUMBER() OVER (PARTITION BY mb.event_id, mb.user_id ORDER BY mb.updated_at DESC) AS row_num FROM bookmakerbets mb JOIN users u ON FIND_IN_SET(?, u.creator_id) AND u.id = mb.user_id ) subquery WHERE row_num = 1 GROUP BY event_id ) mt JOIN ( SELECT event_id FROM bookmakerodds WHERE is_declared = 0 GROUP BY event_id ) mo_declared ON mo_declared.event_id = mt.event_id JOIN marketodds mo ON mo.event_id = mt.event_id JOIN events e ON e.event_id = mt.event_id WHERE mo.inplay = 1 or mo.is_declared = 0",
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
BookmakebetMaster.getUserExpStatus = async function (creator_id, event_id) {
  try {
    let user_exp = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT u.username, mb.*, e.runner1,e.runner2 FROM users u JOIN matchbets mb ON u.id = mb.user_id JOIN marketodds e ON mb.event_id = e.event_id JOIN ( SELECT user_id, MAX(created_at) AS latest_updated_at FROM matchbets WHERE event_id = ? GROUP BY user_id ) latest ON mb.user_id = latest.user_id AND mb.created_at = latest.latest_updated_at WHERE FIND_IN_SET(?, u.creator_id) > 0;",
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

BookmakebetMaster.deleteMatchbets = async function (ids) {
  try {
    let bets_added = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO deletedmatchbets(bet_id,user_id,event_id,market_id,main_type,runner_name,type,price,size,bet_amount,loss_amount,win_amount,exp_amount1,exp_amount2,exp_amount3,profit_loss,status,is_won,is_switched,created_at,updated_at) SELECT * FROM matchbets where id IN (?)",
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
        "delete from matchbets where id IN (?)",
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

//get bet history for each admin based on event id
BookmakebetMaster.getBookBetsPlaced = async function (creator_id, event_id) {
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
        "SELECT u.username,e.event_name, m.* FROM `bookmakerbets` m join users as u on u.id = m.user_id join events e on e.event_id = m.event_id WHERE m.event_id = ? order by m.updated_at desc ";
      values = [event_id];
    } else {
      qry =
        "SELECT u.username,e.event_name, m.* FROM `bookmakerbets` m join users as u on u.id = m.user_id join events e on e.event_id = m.event_id WHERE FIND_IN_SET(?,creator_id) and m.event_id = ? order by m.updated_at desc ";
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

module.exports = BookmakebetMaster;
