var dbConn = require("./../../config/db");
const Winner = require("../models/winner");
const Loser = require("../models/loser");
const moment = require("moment");

require("dotenv").config();

var TennisResultMaster = function (tennisResult) {
  this.event_id = tennisResult.event_id;
  this.runner_name = tennisResult.runner_name;
  this.main_type = tennisResult.main_type;
  this.type = tennisResult.type;
  this.event_name = tennisResult.event_name;
};

//declare tennis result
TennisResultMaster.addTennisResult = async function (result, manual_session) {
  const connection = await getConnection(dbConn);
  try {
    //check result declaration
    const is_declared = await this.isResultDeclared(result);
    if (is_declared > 0) {
      return "Please refresh. Result already declared..!!";
    }

    console.log(1);
    await beginTransaction(connection);
    if (result.main_type == "match_odd") {
      //update match table
      let qry_match =
        "UPDATE tennisodds SET is_active0 = ?, is_suspended0=?,is_active1 = ?, is_suspended1=?,is_active2 = ?, is_suspended2=?, is_declared=?, result=?, result_type=? WHERE event_id = ?";
      let values_match = [
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        result.runner_name,
        result.type,
        result.event_id,
      ];
      await executeQuery(connection, qry_match, values_match);
      console.log(3);
      //update matchbets table
      let qry_winner =
        "update tennisbets set updated_at=?, is_won=1, profit_loss=win_amount, status = 0 where event_id = ? and ((runner_name = ? and type='Back')or(runner_name != ? and type='Lay'))";
      let values_winner = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
        result.runner_name,
        result.runner_name,
      ];
      await executeQuery(connection, qry_winner, values_winner);
      console.log(4);
      let qry_losers =
        "update tennisbets set updated_at=?, is_won=0,profit_loss=loss_amount, status = 0 where event_id = ? and ((runner_name = ? and type='Lay') or (runner_name!=? and type='Back'))";
      let values_losers = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
        result.runner_name,
        result.runner_name,
      ];
      await executeQuery(connection, qry_losers, values_losers);
      console.log(5);
      //get all players total p/l of runner
      let qry_players =
        "SELECT user_id, SUM(profit_loss) AS total_pl, event_id, runner_name, ( SELECT MAX(created_at) FROM tennisbets AS sub WHERE sub.status = 0 AND sub.event_id = ? AND sub.user_id = tb.user_id ) AS latest_created_at FROM tennisbets AS tb WHERE status = 0 AND event_id = ? GROUP BY user_id, event_id";
      let values_players = [result.event_id, result.event_id];
      let all_players = await executeQuery(
        connection,
        qry_players,
        values_players
      );
      console.log(6);
      let i = 7;
      // Loop through the dataArray and insert each element into the database
      for (const data of all_players) {
        const { user_id, total_pl, event_id, runner_name, latest_created_at } =
          data;

        //update main balance
        const query = "update users set balance = balance + ? where id = ?";
        const values = [total_pl, user_id];
        await executeQuery(connection, query, values);
        console.log(i++);

        let ledger_data = {
          user_id: user_id,
          event_id: event_id,
          event_name: result.event_name,
          type: "tennis",
          subtype: "match_odd",
          runner_name: result.event_name,
          profit_loss: total_pl,
          created_at: latest_created_at,
        };
        //add into ledger
        const qry_ledger = `INSERT INTO ledger set ?`;
        await executeQuery(connection, qry_ledger, ledger_data);
        console.log(i++);

        if (total_pl > 0) {
          //add winner
          let win_data = {
            user_id: user_id,
            win_amount: total_pl,
            event_id: event_id,
            main_type: result.main_type,
            runner_name: result.runner_name,
          };
          const new_winner = new Winner(win_data);
          //add to winners table
          let qry_win = "INSERT INTO winners set ?";
          await executeQuery(connection, qry_win, new_winner);
          console.log(i++);
        } else if (total_pl < 0) {
          let loss_data = {
            user_id: user_id,
            loss_amount: total_pl,
            event_id: event_id,
            main_type: result.main_type,
            runner_name: result.runner_name,
          };
          const new_loser = new Loser(loss_data);
          //add to losers table
          let qry_loss = "INSERT INTO losers set ?";
          await executeQuery(connection, qry_loss, new_loser);
          console.log(i++);
        }
      }

      //get all players p/l
      // let qry_pl =
      //   "select user_id, profit_loss,event_id,runner_name,created_at from tennisbets where status=0 and event_id = ?";
      // values_pl = [result.event_id];
      // let users_pl = await executeQuery(connection, qry_pl, values_pl);
      // console.log(i++);
      // // Loop through the dataArray and insert each element into the database
      // for (const data of users_pl) {
      //   const { user_id, profit_loss, event_id, runner_name, created_at } =
      //     data;
      //   let ledger_data = {
      //     user_id: user_id,
      //     event_id: event_id,
      //     event_name: result.event_name,
      //     type: "tennis",
      //     subtype: "match_odd",
      //     runner_name: runner_name,
      //     profit_loss: profit_loss,
      //     created_at: created_at,
      //   };
      //   //add into ledger
      //   const qry_ledger = `INSERT INTO ledger set ?`;
      //   await executeQuery(connection, qry_ledger, ledger_data);
      //   console.log(i++);
      // }

      //update exposure
      let qry_exp =
        "update exposures set updated_at=?, exp_amount = 0, status=0 where event_id=? and main_type='match_odd'";
      let exp_values = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
      ];
      await executeQuery(connection, qry_exp, exp_values);
      console.log(i++);

      //add to result table
      await executeQuery(connection, "INSERT INTO results set ?", result);
      console.log(2);
    }

    // Commit the transaction if all queries succeed
    const msg = await commitTransaction(connection);
    return msg;
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

TennisResultMaster.rollBackTennisResult = async function (result) {
  const connection = await getConnection(dbConn);
  try {
    //check result declaration
    const is_declared = await this.isResultDeclared(result);
    if (is_declared != 1) {
      return "No result found. Please Refresh";
    }
    console.log(1);
    await beginTransaction(connection);

    if (result.main_type == "match_odd") {
      //update user balance
      let qry_total_match_pl =
        "select user_id,sum(profit_loss)as total_pl,event_id from tennisbets where status=0 and event_id = ? GROUP BY user_id";
      let values_total_match_pl = [result.event_id];
      let players_total_pl = await executeQuery(
        connection,
        qry_total_match_pl,
        values_total_match_pl
      );
      console.log(2);
      let i = 3;
      for (const data of players_total_pl) {
        const { user_id, total_pl } = data;
        let qry_balance = "update users set balance = balance - ? where id = ?";
        let values_balance = [total_pl, user_id];
        await executeQuery(connection, qry_balance, values_balance);
      }

      //update the matchodds
      let qry_match =
        "UPDATE tennisodds SET is_active0 = ?, is_suspended0=?,is_active1 = ?, is_suspended1=?,is_active2 = ?, is_suspended2=?, is_declared=?, result=?, result_type=? WHERE event_id = ?";
      let values_match = [1, 0, 1, 0, 1, 0, 0, null, null, result.event_id];
      await executeQuery(connection, qry_match, values_match);
      console.log(i++);

      //update matchbets
      let qry_matchbets =
        "update tennisbets set updated_at=?, is_won=?,profit_loss=0,is_switched=0, status = ? where event_id = ?";
      let values_matchbets = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        null,
        1,
        result.event_id,
      ];
      await executeQuery(connection, qry_matchbets, values_matchbets);
      console.log(i++);

      //delete losers
      let qry_losers =
        "delete from losers where event_id=? and main_type='match_odd'";
      let values_losers = [result.event_id, result.runner_name];
      await executeQuery(connection, qry_losers, values_losers);
      console.log(i++);

      //delete winners
      let qry_winners =
        "delete from winners where event_id=? and main_type='match_odd'";
      let values_winners = [result.event_id, result.runner_name];
      await executeQuery(connection, qry_winners, values_winners);
      console.log(i++);

      //delete from ledger
      let qry_ledger =
        "delete from ledger where event_id=? and subtype='match_odd'";
      let values_ledger = [result.event_id];
      await executeQuery(connection, qry_ledger, values_ledger);
      console.log(i++);

      //update exposures
      let qry_exp =
        "update exposures set updated_at=?, exp_amount = deducted_amount, status=1 where event_id=? and main_type='match_odd'";
      let values_exp = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
      ];
      await executeQuery(connection, qry_exp, values_exp);
      console.log(i++);

      //delete from results
      let qry_delete_result =
        "Delete from results where event_id=? and runner_name= ? and  main_type=?";
      let values_result = [
        result.event_id,
        result.runner_name,
        result.main_type,
      ];
      await executeQuery(connection, qry_delete_result, values_result);
      console.log(i++);
    }
    const msg = await commitTransaction(connection);
    return msg;
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

// //rollback tennis result
// TennisResultMaster.rollBackTennisResult = async function (result) {
//   try {
//     let qry_str = "";
//     dbConn.getConnection((err, conn) => {
//       if (err) {
//         throw err;
//       }
//       //delete from results
//       conn.query(
//         "Delete from tennisresults where event_id=? and runner_name= ? and  main_type=? and type=?",
//         [result.event_id, result.runner_name, result.main_type, result.type],
//         (err, res) => {
//           if (err) {
//             return conn.rollback(() => {
//               conn.release();
//               throw err;
//             });
//           }

//           if (result.main_type == "match_odd") {
//             qry_str =
//               "UPDATE tennisodds SET is_active0 = ?, is_suspended0=?,is_active1 = ?, is_suspended1=?,is_active2 = ?, is_suspended2=?, is_declared=?, result=?, result_type=? WHERE event_id = ?";
//             values = [1, 0, 1, 0, 1, 0, 0, null, null, result.event_id];
//           }
//           console.log("update s/m-->", qry_str);
//           conn.query(qry_str, values, (err, res) => {
//             if (err) {
//               return conn.rollback(() => {
//                 conn.release();
//                 throw err;
//               });
//             }

//             if ((result.main_type = "match_odd")) {
//               qry_bal =
//                 "select user_id,sum(profit_loss)as total_pl,event_id from tennisbets where status=0 and event_id = ? GROUP BY user_id";
//               val_bal = [result.event_id];
//             }
//             conn.query(qry_bal, val_bal, (err, res) => {
//               if (err) {
//                 return conn.rollback(() => {
//                   conn.release();
//                   throw err;
//                 });
//               } else {
//                 const all_users = [];
//                 res.forEach((row) => {
//                   const { user_id, total_pl, event_id } = row;
//                   all_users.push({ user_id, total_pl, event_id });
//                 });
//                 for (user of all_users) {
//                   console.log("each user-->", user);
//                   console.log("each user pl amt-->", user.total_pl);
//                   //update user balance
//                   conn.query(
//                     "update users set balance = balance - ? where id = ?",
//                     [user.total_pl, user.user_id],
//                     (err, res) => {
//                       if (err) {
//                         return conn.rollback(() => {
//                           conn.release();
//                           throw err;
//                         });
//                       }
//                     }
//                   );
//                 }
//               }
//             });

//             //update tennis bets
//             if (result.main_type == "match_odd") {
//               qry_str1 =
//                 "update tennisbets set updated_at=?, is_won=?,profit_loss=0,is_switched=0, status = ? where event_id = ?";
//               values1 = [
//                 moment().format("YYYY-MM-DD HH:mm:ss"),
//                 null,
//                 1,
//                 result.event_id,
//               ];
//               qry_str2 =
//                 "delete from losers where event_id=? and main_type='match_odd'";
//               values2 = [result.event_id, result.runner_name];
//               qry_str3 =
//                 "delete from winners where event_id=? and main_type='match_odd'";
//               values3 = [result.event_id, result.runner_name];
//               qry_str4 =
//                 "delete from givers where event_id=? and main_type='match_odd'";
//               values4 = [result.event_id, result.runner_name];
//               qry_str5 =
//                 "delete from ledger where event_id=? and subtype='match_odd'";
//               values5 = [result.event_id];
//             }
//             console.log("correct bets-->", qry_str1);
//             console.log("winners query-->", qry_str2);

//             // create an array of promises for each query
//             const promises = [
//               new Promise((resolve, reject) => {
//                 conn.query(qry_str1, values1, (error, results) => {
//                   if (error) {
//                     reject(error);
//                   } else {
//                     resolve(results);
//                   }
//                 });
//               }),
//               new Promise((resolve, reject) => {
//                 conn.query(qry_str2, values2, (error, results) => {
//                   if (error) {
//                     reject(error);
//                   } else {
//                     resolve(results);
//                   }
//                 });
//               }),
//               new Promise((resolve, reject) => {
//                 conn.query(qry_str3, values3, (error, results) => {
//                   if (error) {
//                     reject(error);
//                   } else {
//                     resolve(results);
//                   }
//                 });
//               }),
//               new Promise((resolve, reject) => {
//                 conn.query(qry_str4, values4, (error, results) => {
//                   if (error) {
//                     reject(error);
//                   } else {
//                     resolve(results);
//                   }
//                 });
//               }),
//               new Promise((resolve, reject) => {
//                 conn.query(qry_str5, values5, (error, results) => {
//                   if (error) {
//                     reject(error);
//                   } else {
//                     resolve(results);
//                   }
//                 });
//               }),
//             ];

//             // execute the promises in parallel using Promise.all()
//             Promise.all(promises)
//               .then((results) => {
//                 //update exposures
//                 if (result.main_type == "match_odd") {
//                   exp_qry =
//                     "update exposures set updated_at=?, exp_amount = deducted_amount, status=1 where event_id=? and main_type='match_odd' and difference = 0";
//                   exp_values = [
//                     moment().format("YYYY-MM-DD HH:mm:ss"),
//                     result.event_id,
//                   ];
//                 }
//                 conn.query(exp_qry, exp_values, (err, res) => {
//                   if (err) {
//                     return conn.rollback(() => {
//                       console.log(err);
//                       // conn.release();
//                       throw err;
//                     });
//                   }
//                   // commit the transaction if both queries were successful
//                   conn.query("COMMIT", (err) => {
//                     if (err) {
//                       return conn.rollback(() => {
//                         conn.release();
//                         throw err;
//                       });
//                     }
//                     console.log("Transaction completed successfully.");
//                   });
//                 });

//                 conn.release();
//               })
//               .catch((error) => {
//                 return conn.rollback(() => {
//                   conn.release();
//                   throw error;
//                 });
//               });
//           });
//         }
//       );
//     });
//     return "Tennis Rolled Back successfully";
//   } catch (error) {
//     console.log(error);
//   }
// };

//get all tennis pl
TennisResultMaster.getTennisAllBetsPL = async function (user_id) {
  try {
    const tennis_all_bets_pl = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT  user_id, event_id,event_name, main_type, runner_name, type, price, size, loss_amount, win_amount,bet_amount, profit_loss, status, is_won, updated_at FROM tennisbets WHERE tennisbets.user_id = ? AND tennisbets.status = 0 AND updated_at >= DATE_SUB(NOW(), INTERVAL 3 DAY)ORDER BY tennisbets.updated_at DESC, tennisbets.event_id ",
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
    return tennis_all_bets_pl;
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

TennisResultMaster.isResultDeclared = async function (result) {
  try {
    return await new Promise((resolve, reject) => {
      if (result.main_type == "match_odd") {
        sql_declare =
          "select * from results where event_id = ? and main_type = ?";
        value_sql = [result.event_id, result.main_type];
      }
      dbConn.query(sql_declare, value_sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.length);
        }
      });
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = TennisResultMaster;
