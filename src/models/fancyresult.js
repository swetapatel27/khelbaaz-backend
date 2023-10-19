var dbConn = require("./../../config/db");
const Winner = require("../models/winner");
const Loser = require("../models/loser");
const moment = require("moment");

require("dotenv").config();

var FancyResultMaster = function (fancyResult) {
  this.event_id = fancyResult.event_id;
  this.runner_name = fancyResult.runner_name;
  this.main_type = fancyResult.main_type;
  this.type = fancyResult.type;
  this.event_name = fancyResult.event_name;
};

//declare fancy result
FancyResultMaster.addFancyResult = async function (result, manual_session) {
  const connection = await getConnection(dbConn);
  try {
    //check result declaration
    const is_declared = await this.isResultDeclared(result);
    if (is_declared > 0) {
      return "Please refresh. Result already declared..!!";
    }

    console.log(1);
    await beginTransaction(connection);
    if (result.main_type == "fancy") {
      //update match table
      let qry_match =
        "UPDATE fancies SET is_active = ?, is_suspended=?, is_declared=?, result=? WHERE event_id = ?";
      let values_match = [0, 1, 1, result.runner_name, result.event_id];
      await executeQuery(connection, qry_match, values_match);
      console.log(3);
      //update matchbets table
      let qry_winner =
        "update fancybets set updated_at=?, is_won=1, profit_loss=win_amount, status = 0 where event_id = ? and ((runner_name = ? and type='Back'))";
      let values_winner = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
        result.runner_name,
      ];
      await executeQuery(connection, qry_winner, values_winner);
      console.log(4);
      let qry_losers =
        "update fancybets set updated_at=?, is_won=0,profit_loss=loss_amount, status = 0 where event_id = ? and ((runner_name!=? and type='Back'))";
      let values_losers = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
        result.runner_name,
      ];
      await executeQuery(connection, qry_losers, values_losers);
      console.log(5);
      //get all players total p/l of runner
      let qry_players =
        "SELECT user_id, SUM(profit_loss) AS total_pl, event_id, runner_name, ( SELECT MAX(created_at) FROM fancybets AS sub WHERE sub.status = 0 AND sub.event_id = ? AND sub.user_id = tb.user_id ) AS latest_created_at FROM fancybets AS tb WHERE status = 0 AND event_id = ? GROUP BY user_id, event_id";
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
          type: "cricket",
          subtype: "fancy",
          runner_name: result.runner_name,
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

      //update exposure
      let qry_exp =
        "update exposures set updated_at=?, exp_amount = 0, status=0 where event_id=? and main_type='fancy'";
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

FancyResultMaster.rollBackFancyResult = async function (result) {
  const connection = await getConnection(dbConn);
  try {
    //check result declaration
    const is_declared = await this.isResultDeclared(result);
    if (is_declared != 1) {
      return "No result found. Please Refresh";
    }
    console.log(1);
    await beginTransaction(connection);

    if (result.main_type == "fancy") {
      //update user balance
      let qry_total_match_pl =
        "select user_id,sum(profit_loss)as total_pl,event_id from fancybets where status=0 and event_id = ? GROUP BY user_id";
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
        "UPDATE fancies SET is_active = ?, is_suspended=?, is_declared=?, result=? WHERE event_id = ?";
      let values_match = [1, 0, 0, null, result.event_id];
      await executeQuery(connection, qry_match, values_match);
      console.log(i++);

      //update matchbets
      let qry_matchbets =
        "update fancybets set updated_at=?, is_won=?,profit_loss=0,is_switched=0, status = ? where event_id = ?";
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
        "delete from losers where event_id=? and main_type='fancy'";
      let values_losers = [result.event_id, result.runner_name];
      await executeQuery(connection, qry_losers, values_losers);
      console.log(i++);

      //delete winners
      let qry_winners =
        "delete from winners where event_id=? and main_type='fancy'";
      let values_winners = [result.event_id, result.runner_name];
      await executeQuery(connection, qry_winners, values_winners);
      console.log(i++);

      //delete from ledger
      let qry_ledger =
        "delete from ledger where event_id=? and subtype='fancy'";
      let values_ledger = [result.event_id];
      await executeQuery(connection, qry_ledger, values_ledger);
      console.log(i++);

      //update exposures
      let qry_exp =
        "update exposures set updated_at=?, exp_amount = deducted_amount, status=1 where event_id=? and main_type='fancy'";
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

//get all fancy pl
FancyResultMaster.getFancyAllBetsPL = async function (user_id) {
  try {
    const fancy_all_bets_pl = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT  user_id, fancybets.event_id,e.event_name, main_type, runner_name, type, price, size, loss_amount, win_amount, profit_loss, status, is_won, updated_at FROM fancybets join fancyevents e on fancybets.event_id = e.event_id WHERE fancybets.user_id = ? AND fancybets.status = 0 ORDER BY fancybets.event_id, fancybets.updated_at DESC;",
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
    return fancy_all_bets_pl;
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

FancyResultMaster.isResultDeclared = async function (result) {
  try {
    return await new Promise((resolve, reject) => {
      if (result.main_type == "fancy") {
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

module.exports = FancyResultMaster;
