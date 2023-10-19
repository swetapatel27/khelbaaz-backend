var dbConn = require("./../../config/db");
const Winner = require("../models/winner");
const Loser = require("../models/loser");
const moment = require("moment");

var TestMaster = function () {};

TestMaster.addTest = async function (result, manual_session) {
  const connection = await getConnection(dbConn);
  try {
    //check result declaration
    const is_declared = await this.isResultDeclared(result);
    if (is_declared > 0) {
      return "Please refresh. Result already declared..!!";
    }

    console.log(1);
    await beginTransaction(connection);
    if (result.main_type == "session") {
      //update session table
      let qry_session =
        "UPDATE sessions SET is_active = ?, is_suspended=?, is_declared=?, result=? WHERE event_id = ? and runner_name =?";
      let values_session = [
        0,
        1,
        1,
        result.type,
        result.event_id,
        result.runner_name,
      ];
      await executeQuery(connection, qry_session, values_session);
      console.log(3);
      //update sessionbets table
      let qry_winner =
        "update sessionbets set updated_at=?, is_won = 1,status=0, profit_loss = win_amount where event_id = ? and runner_name  = ? and ((type = 'Back' and price between 1 and ?) or (type= 'Lay' and price > ?))";
      let values_winner = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
        result.runner_name,
        manual_session.price,
        manual_session.price,
      ];
      await executeQuery(connection, qry_winner, values_winner);
      console.log(4);
      let qry_losers =
        "UPDATE sessionbets set updated_at=?, is_won = 0, status=0, profit_loss = loss_amount where event_id = ? and runner_name=? and ((type = 'Lay' and price between 1 and ?) or (type= 'Back' and price > ?))";
      let values_losers = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
        result.runner_name,
        manual_session.price,
        manual_session.price,
      ];
      await executeQuery(connection, qry_losers, values_losers);
      console.log(5);
      //get all players total p/l of runner
      let qry_players =
        "select user_id,sum(profit_loss)as total_pl,event_id,runner_name,status from sessionbets GROUP BY user_id,runner_name HAVING status=0 and event_id = ? and runner_name=?";
      let values_players = [result.event_id, result.runner_name];
      let all_players = await executeQuery(
        connection,
        qry_players,
        values_players
      );
      console.log(6);
      let i = 7;
      // Loop through the dataArray and insert each element into the database
      for (const data of all_players) {
        const { user_id, total_pl, event_id, runner_name } = data;

        //update main balance
        const query = "update users set balance = balance + ? where id = ?";
        const values = [total_pl, user_id];
        await executeQuery(connection, query, values);
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
      let qry_pl =
        "select user_id,profit_loss,event_id,runner_name,status from sessionbets HAVING status=0 and event_id = ? and runner_name=?";
      values_pl = [result.event_id, result.runner_name];
      let users_pl = await executeQuery(connection, qry_pl, values_pl);
      console.log(i++);
      // Loop through the dataArray and insert each element into the database
      for (const data of users_pl) {
        const { user_id, profit_loss, event_id, runner_name } = data;
        let ledger_data = {
          user_id: user_id,
          event_id: event_id,
          event_name: result.event_name,
          type: "cricket",
          subtype: "session",
          runner_name: runner_name,
          profit_loss: profit_loss,
        };
        //add into ledger
        const qry_ledger = `INSERT INTO ledger set ?`;
        await executeQuery(connection, qry_ledger, ledger_data);
        console.log(i++);
      }

      //update exposure
      let qry_exp =
        "update exposures set updated_at=?, exp_amount = 0, status=0 where event_id=? and runner_name = ?";
      let exp_values = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
        result.runner_name,
      ];
      await executeQuery(connection, qry_exp, exp_values);
      console.log(i++);
      //add to result table
      await executeQuery(connection, "INSERT INTO results set ?", result);
      console.log(2);
    } else if (result.main_type == "match_odd") {
      //update match table
      let qry_match =
        "UPDATE marketodds SET is_active0 = ?, is_suspended0=?,is_active1 = ?, is_suspended1=?,is_active2 = ?, is_suspended2=?, is_declared=?, result=?, result_type=? WHERE event_id = ?";
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
        "update matchbets set updated_at=?, is_won=1, profit_loss=win_amount, status = 0 where event_id = ? and ((runner_name = ? and type='Back')or(runner_name != ? and type='Lay'))";
      let values_winner = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
        result.runner_name,
        result.runner_name,
      ];
      await executeQuery(connection, qry_winner, values_winner);
      console.log(4);
      let qry_losers =
        "update matchbets set updated_at=?, is_won=0,profit_loss=loss_amount, status = 0 where event_id = ? and ((runner_name = ? and type='Lay') or (runner_name!=? and type='Back'))";
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
        "select user_id,sum(profit_loss)as total_pl,event_id,runner_name from matchbets where status=0 and event_id = ? GROUP BY user_id";
      let values_players = [result.event_id];
      let all_players = await executeQuery(
        connection,
        qry_players,
        values_players
      );
      console.log(6);
      let i = 7;
      // Loop through the dataArray and insert each element into the database
      for (const data of all_players) {
        const { user_id, total_pl, event_id } = data;

        //update main balance
        const query = "update users set balance = balance + ? where id = ?";
        const values = [total_pl, user_id];
        await executeQuery(connection, query, values);
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
      let qry_pl =
        "select user_id, profit_loss,event_id,runner_name from matchbets where status=0 and event_id = ?";
      values_pl = [result.event_id];
      let users_pl = await executeQuery(connection, qry_pl, values_pl);
      console.log(i++);
      // Loop through the dataArray and insert each element into the database
      for (const data of users_pl) {
        const { user_id, profit_loss, event_id, runner_name } = data;
        let ledger_data = {
          user_id: user_id,
          event_id: event_id,
          event_name: result.event_name,
          type: "cricket",
          subtype: "match_odd",
          runner_name: runner_name,
          profit_loss: profit_loss,
        };
        //add into ledger
        const qry_ledger = `INSERT INTO ledger set ?`;
        await executeQuery(connection, qry_ledger, ledger_data);
        console.log(i++);
      }

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

    // Perform your SQL queries within the transaction here using 'await'
    // const query1 = "INSERT INTO casino_games VALUES (?,?,?,?,?,?,?,?)";
    // const values1 = ["", "t1", "ty1", "v1", "vn1", "r1", "/ru1", 12];
    // const res1 = await executeQuery(connection, query1, values1);
    // console.log(res1);
    // const i = await this.test1();

    // const query2 = "Insert into receivers values (?,?,?,?,?)";
    // const values2 = ["", res1.affectedRows, 1111, i, ""];
    // await executeQuery(connection, query2, values2);

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

TestMaster.rollBackResult = async function (result) {
  const connection = await getConnection(dbConn);
  try {
    //check result declaration
    const is_declared = await this.isResultDeclared(result);
    if (is_declared != 1) {
      return "No result found. Please Refresh";
    }
    console.log(1);
    await beginTransaction(connection);

    if (result.main_type == "session") {
      //update user balance
      let qry_total_session_pl =
        "select user_id,sum(profit_loss)as total_pl,event_id,runner_name,status from sessionbets GROUP BY user_id,runner_name HAVING status=0 and event_id = ? and runner_name=?";
      let values_total_session_pl = [result.event_id, result.runner_name];
      let players_total_pl = await executeQuery(
        connection,
        qry_total_session_pl,
        values_total_session_pl
      );
      console.log(2);
      let i = 3;
      for (const data of players_total_pl) {
        const { user_id, total_pl } = data;
        let qry_balance = "update users set balance = balance - ? where id = ?";
        let values_balance = [total_pl, user_id];
        await executeQuery(connection, qry_balance, values_balance);
        console.log(i++);
      }

      //update the sessions
      let qry_session =
        "UPDATE sessions SET  is_active = ?, is_suspended=?, is_declared=?, result=? WHERE event_id = ? and runner_name =?";
      let values_session = [1, 0, 0, null, result.event_id, result.runner_name];
      await executeQuery(connection, qry_session, values_session);
      console.log(i++);
      //update session bets
      let qry_sessionbets =
        "UPDATE sessionbets set updated_at=?, is_won = ?,profit_loss=0, status=? where event_id = ? and runner_name=?";
      let values_sessionbets = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        null,
        1,
        result.event_id,
        result.runner_name,
      ];
      await executeQuery(connection, qry_sessionbets, values_sessionbets);
      console.log(i++);
      //delete from losers
      let qry_losers =
        "delete from losers where event_id=? and runner_name=? and main_type='session'";
      let values_losers = [result.event_id, result.runner_name];
      await executeQuery(connection, qry_losers, values_losers);
      console.log(i++);
      //delete winners
      let qry_winners =
        "delete from winners where event_id=? and runner_name=? and main_type='session'";
      let values_winners = [result.event_id, result.runner_name];
      await executeQuery(connection, qry_winners, values_winners);
      console.log(i++);
      //delete from ledger
      let qry_ledger =
        "delete from ledger where event_id=? and runner_name=? and subtype='session'";
      let values_ledger = [result.event_id, result.runner_name];
      await executeQuery(connection, qry_ledger, values_ledger);
      console.log(i++);

      //update exposures
      let qry_exp =
        "update exposures set updated_at=?, exp_amount = deducted_amount, status=1 where event_id=? and runner_name = ?";
      let values_exp = [
        moment().format("YYYY-MM-DD HH:mm:ss"),
        result.event_id,
        result.runner_name,
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
    } else if (result.main_type == "match_odd") {
      //update user balance
      let qry_total_match_pl =
        "select user_id,sum(profit_loss)as total_pl,event_id from matchbets where status=0 and event_id = ? GROUP BY user_id";
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
        "UPDATE marketodds SET is_active0 = ?, is_suspended0=?,is_active1 = ?, is_suspended1=?,is_active2 = ?, is_suspended2=?, is_declared=?, result=?, result_type=? WHERE event_id = ?";
      let values_match = [1, 0, 1, 0, 1, 0, 0, null, null, result.event_id];
      await executeQuery(connection, qry_match, values_match);
      console.log(i++);

      //update matchbets
      let qry_matchbets =
        "update matchbets set updated_at=?, is_won=?,profit_loss=0,is_switched=0, status = ? where event_id = ?";
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
        "update exposures set updated_at=?, exp_amount = deducted_amount, status=1 where event_id=? and main_type='match_odd' and difference = 0";
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

// TestMaster.updateUserBalance = async function (connection,all_players) {
//   all_players.forEach((row) => {
//     const { user_id, total_pl, event_id, runner_name } = row;
//          executeQuery
//   });
// };

TestMaster.test1 = async function () {
  let i;
  for (i = 0; i <= 100; i++) {
    console.log(i);
  }
  return i;
};

TestMaster.isResultDeclared = async function (result) {
  try {
    return await new Promise((resolve, reject) => {
      if (result.main_type == "match_odd") {
        sql_declare =
          "select * from results where event_id = ? and main_type = ?";
        value_sql = [result.event_id, result.main_type];
      } else if (result.main_type == "session") {
        sql_declare =
          "select * from results where event_id = ? and main_type = ? and runner_name = ?";
        value_sql = [result.event_id, result.main_type, result.runner_name];
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

module.exports = TestMaster;
