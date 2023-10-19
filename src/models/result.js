var dbConn = require("./../../config/db");
// const winController = require("./../controllers/winner.controller");
// const lossController = require("../controllers/loser.controller");
const Winner = require("../models/winner");
const Loser = require("../models/loser");
const ClientLedger = require("../models/clientledger");
const { Result } = require("express-validator");
const moment = require("moment");

require("dotenv").config();

var ResultMaster = function (result) {
  this.event_id = result.event_id;
  this.runner_name = result.runner_name;
  this.main_type = result.main_type;
  this.type = result.type;
  this.event_name = result.event_name;
};

ResultMaster.addResult = async function (result, manual_session) {
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
        manual_session.price,
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
        "SELECT user_id, SUM(profit_loss) AS total_pl, event_id, runner_name, status, ( SELECT MAX(created_at) FROM sessionbets AS sub WHERE sub.user_id = sb.user_id AND sub.event_id = sb.event_id AND sub.runner_name = sb.runner_name ) AS latest_created_at FROM sessionbets AS sb WHERE event_id = ? AND runner_name = ? GROUP BY user_id, event_id, runner_name, status HAVING status = 0";
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
          subtype: "session",
          runner_name: runner_name,
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
          shareProfit("session", user_id, total_pl, event_id, runner_name);
        }
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
        "SELECT user_id, SUM(profit_loss) AS total_pl, event_id, runner_name, ( SELECT MAX(created_at) FROM matchbets AS sub WHERE sub.status = 0 AND sub.event_id = ? AND sub.user_id = mb.user_id ) AS latest_created_at FROM matchbets AS mb WHERE status = 0 AND event_id = ? GROUP BY user_id, event_id";
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
          shareProfit("match_odd", user_id, total_pl, event_id, runner_name);
        }
      }

      //get all players p/l
      // let qry_pl =
      //   "select user_id, profit_loss,event_id,runner_name,created_at from matchbets where status=0 and event_id = ?";
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
      //     type: "cricket",
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

const shareProfit = async (subtype, user_id, profit, event_id, runner_name) => {
  const connection = await getConnection(dbConn);
  // find applicant
  let qry_puser = "select added_by from users where id = ?";
  let puser = await executeQuery(connection, qry_puser, [user_id]);

  let qry_auser = "select id,profit_share from users where id = ?";
  let applicant = await executeQuery(connection, qry_auser, [
    puser[0].added_by,
  ]);

  // console.log({"profit":profit,"puser":puser,"applicant":applicant});

  if (
    applicant[0] &&
    applicant[0].profit_share !== null &&
    applicant[0].profit_share !== undefined &&
    applicant[0].profit_share > 0
  ) {
    const applicantProfit = clcPerAmount(profit, applicant[0].profit_share);

    // update in applicant balance
    const query = "update users set balance = balance + ? where id = ?";
    const values = [applicantProfit, applicant[0].id];
    await executeQuery(connection, query, values);

    let ledger_data = {
      user_id: applicant[0].id,
      event_id: event_id,
      type: "cricket",
      subtype: subtype,
      runner_name: runner_name,
      profit_loss: applicantProfit,
    };
    //add into ledger
    const qry_ledger = `INSERT INTO ledger set ?`;
    await executeQuery(connection, qry_ledger, ledger_data);
  }
  return true;
};

const RoleBackshareProfit = async (
  subtype,
  user_id,
  profit,
  event_id,
  runner_name
) => {
  const connection = await getConnection(dbConn);
  // find applicant
  let qry_puser = "select added_by from users where id = ?";
  let puser = await executeQuery(connection, qry_puser, [user_id]);

  let qry_auser = "select id,profit_share from users where id = ?";
  let applicant = await executeQuery(connection, qry_auser, [
    puser[0].added_by,
  ]);

  //console.log({"profit":profit,"puser":puser,"applicant":applicant});

  if (
    applicant[0] &&
    applicant[0].profit_share !== null &&
    applicant[0].profit_share !== undefined &&
    applicant[0].profit_share > 0
  ) {
    let applicantProfit = clcPerAmount(profit, applicant[0].profit_share);
    applicantProfit = -1 * applicantProfit;
    // update in applicant balance
    let qry_balance = "update users set balance = balance - ? where id = ?";
    let values_balance = [applicantProfit, applicant[0].id_id];
    await executeQuery(connection, qry_balance, values_balance);

    let ledger_data = {
      user_id: applicant[0].id,
      event_id: event_id,
      type: "cricket",
      subtype: subtype,
      runner_name: runner_name,
      profit_loss: applicantProfit,
    };
    //add into ledger
    const qry_ledger = `INSERT INTO ledger set ?`;
    await executeQuery(connection, qry_ledger, ledger_data);
  }
  return true;
};

function clcPerAmount(amount, percentage) {
  const pamount = Math.abs(amount);
  return (percentage / 100) * pamount;
}

//rollback result
ResultMaster.rollBackResult = async function (result) {
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
        "select user_id,sum(profit_loss)as total_pl,event_id,runner_name,status from sessionbets GROUP BY user_id,event_id,runner_name HAVING status=0 and event_id = ? and runner_name=?";
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
        RoleBackshareProfit(
          "session",
          user_id,
          total_pl,
          result.event_id,
          result.runner_name
        );
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
        RoleBackshareProfit(
          "match_odd",
          user_id,
          total_pl,
          result.event_id,
          result.runner_name
        );
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

ResultMaster.declareDraw = async function (result) {
  const connection = await getConnection(dbConn);
  try {
    //check result declaration
    const is_declared = await this.isResultDeclared(result);
    if (is_declared > 0) {
      return "Please refresh. Result already declared..!!";
    }

    await beginTransaction(connection);
    //clear exposure for match_odd and event_id
    let qry_exp =
      "UPDATE exposures e set exp_amount = 0, status = 0 where event_id = ? and main_type = 'match_odd'";
    let values_exp = [result.event_id];
    await executeQuery(connection, qry_exp, values_exp);

    //update ledger
    let qry_player =
      "SELECT *, sum(profit_loss) 'total_pl' FROM matchbets where event_id = ? and status = 1 group by user_id;";
    let values_players = [result.event_id];
    let all_players = await executeQuery(
      connection,
      qry_player,
      values_players
    );

    for (const data of all_players) {
      const { user_id, total_pl, event_id } = data;
      let ledger_data = {
        user_id: user_id,
        event_id: event_id,
        event_name: result.event_name,
        type: "cricket",
        subtype: "match_odd",
        runner_name: "Match Drawn",
        profit_loss: total_pl,
      };
      //add into ledger
      const qry_ledger = `INSERT INTO ledger set ?`;
      await executeQuery(connection, qry_ledger, ledger_data);
    }

    //update matchbets with event_id
    let qry_matchbets =
      "update matchbets set status=0, is_won = 2, updated_at=? where event_id = ? and status = 1";
    let values_matchbets = [
      moment().format("YYYY-MM-DD HH:mm:ss"),
      result.event_id,
    ];
    await executeQuery(connection, qry_matchbets, values_matchbets);

    //is_declared in matchodds
    let qry_update_matchodds =
      "update marketodds set is_active0=0, is_suspended0=1,is_active1=0, is_suspended1=1, is_active2 =0, is_suspended2 =1, is_declared = 1, result = 'Draw', result_type ='Back', updated_at=? where event_id = ?";
    let values_update_matchodds = [
      moment().format("YYYY-MM-DD HH:mm:ss"),
      result.event_id,
    ];
    await executeQuery(
      connection,
      qry_update_matchodds,
      values_update_matchodds
    );
    //add to result table
    await executeQuery(connection, "INSERT INTO results set ?", result);

    //add drawn bets into deletedbets table
    const qry_insert_deletebets =
      "INSERT INTO deletedmatchbets(bet_id,user_id,event_id,event_name,market_id,main_type,runner_name,type,price,size,bet_amount,loss_amount,win_amount,exp_amount1,exp_amount2,exp_amount3,profit_loss,status,is_won,is_switched,created_at,updated_at) SELECT * FROM matchbets where event_id = ?";
    const delete_values = [result.event_id];
    await executeQuery(connection, qry_insert_deletebets, delete_values);

    //delete bets
    const qry_deletebets = "delete from matchbets where event_id = ?";
    const deletebet_values = [result.event_id];
    await executeQuery(connection, qry_deletebets, deletebet_values);

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

ResultMaster.clearBookmaker = async function (result) {
  const connection = await getConnection(dbConn);
  try {
    //check result declaration
    const is_declared = await this.isResultDeclared(result);
    if (is_declared > 0) {
      return "Please refresh. Result already declared..!!";
    }

    await beginTransaction(connection);
    //clear exposure for bookmaker and event_id
    let qry_exp =
      "UPDATE exposures e set exp_amount = 0, status = 0 where event_id = ? and main_type = 'bookmaker'";
    let values_exp = [result.event_id];
    await executeQuery(connection, qry_exp, values_exp);

    //update ledger
    let qry_player =
      "SELECT *, sum(profit_loss) 'total_pl' FROM bookmakerbets where event_id = ? and status = 1 group by user_id;";
    let values_players = [result.event_id];
    let all_players = await executeQuery(
      connection,
      qry_player,
      values_players
    );

    for (const data of all_players) {
      const { user_id, total_pl, event_id } = data;
      let ledger_data = {
        user_id: user_id,
        event_id: event_id,
        event_name: result.event_name,
        type: "cricket",
        subtype: "bookmaker",
        runner_name: "Match Drawn",
        profit_loss: total_pl,
      };
      //add into ledger
      const qry_ledger = `INSERT INTO ledger set ?`;
      await executeQuery(connection, qry_ledger, ledger_data);
    }

    //update matchbets with event_id
    let qry_matchbets =
      "update bookmakerbets set status=0, is_won = 2, updated_at=? where event_id = ? and status = 1";
    let values_matchbets = [
      moment().format("YYYY-MM-DD HH:mm:ss"),
      result.event_id,
    ];
    await executeQuery(connection, qry_matchbets, values_matchbets);

    //is_declared in matchodds
    let qry_update_matchodds =
      "update bookmakerodds set is_suspended0=1, is_suspended1=1, is_suspended2 =1, is_declared = 1, result = 'Draw', result_type ='Back', updated_at=? where event_id = ?";
    let values_update_matchodds = [
      moment().format("YYYY-MM-DD HH:mm:ss"),
      result.event_id,
    ];
    await executeQuery(
      connection,
      qry_update_matchodds,
      values_update_matchodds
    );
    //add to result table
    await executeQuery(connection, "INSERT INTO results set ?", result);

    //add drawn bets into deletedbets table
    const qry_insert_deletebets =
      "INSERT INTO deletedbookmakerbets(`bet_id`, `user_id`, `event_id`, `market_id`, `event_name`, `main_type`, `runner_name`, `type`, `price`, `size`, `bet_amount`, `loss_amount`, `win_amount`, `exp_amount1`, `exp_amount2`, `exp_amount3`, `profit_loss`, `status`, `is_won`, `is_switched`, `updated_at`, `created_at`) SELECT * FROM bookmakerbets where event_id = ?";
    const delete_values = [result.event_id];
    await executeQuery(connection, qry_insert_deletebets, delete_values);

    //delete bets
    const qry_deletebets = "delete from bookmakerbets where event_id = ?";
    const deletebet_values = [result.event_id];
    await executeQuery(connection, qry_deletebets, deletebet_values);

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

//get all p/l after result
ResultMaster.getAllBetsPL = async function (user_id) {
  try {
    const all_bets_pl = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT  sb.user_id, sb.event_id,sb.event_name, sb.main_type, sb.runner_name, sb.type, sb.price, sb.size, sb.loss_amount, sb.win_amount,sb.bet_amount, sb.profit_loss, sb.status, sb.is_won, sb.updated_at FROM (SELECT user_id, event_id,event_name, main_type, runner_name, type, price, size, loss_amount, win_amount, bet_amount, profit_loss, status, is_won, updated_at FROM sessionbets WHERE user_id = ? AND status = 0 AND updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) UNION ALL SELECT user_id, event_id,event_name, main_type, runner_name, type, price, size, loss_amount, win_amount, bet_amount, profit_loss, status, is_won, updated_at FROM matchbets WHERE user_id = ? AND status = 0 AND updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) UNION ALL SELECT user_id, event_id, event_name, main_type, runner_name, type, price, size, loss_amount, win_amount, bet_amount, profit_loss, status, is_won, updated_at FROM bookmakerbets WHERE user_id = ? AND status = 0 AND updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY) UNION ALL SELECT user_id, event_id, event_name, main_type, runner_name, type, price, size, loss_amount, win_amount, bet_amount, profit_loss, status, is_won, updated_at FROM fancybets WHERE user_id = ? AND status = 0 AND updated_at >= DATE_SUB(NOW(), INTERVAL 5 DAY)) AS sb ORDER BY sb.updated_at DESC,sb.event_id",
        [user_id, user_id, user_id, user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return all_bets_pl;
  } catch (error) {
    console.log(error);
  }
};

//get all bets detail(m+s+t) after result declared by grouping event for specific user in admin
ResultMaster.getAllBetsPLOverview = async function (user_id) {
  try {
    const all_bets_pl = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT event_id,event_name, total_profit_loss, runner_name FROM ( SELECT matchbets.event_id, event_name, SUM(profit_loss) AS total_profit_loss, 'Match Odds' AS runner_name FROM matchbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY)  GROUP BY event_id UNION SELECT sessionbets.event_id, event_name, SUM(profit_loss) AS total_profit_loss, runner_name FROM sessionbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id, runner_name UNION SELECT bookmakerbets.event_id, event_name, SUM(profit_loss) AS total_profit_loss, runner_name FROM bookmakerbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id, runner_name UNION SELECT fancybets.event_id, event_name, SUM(profit_loss) AS total_profit_loss, runner_name FROM fancybets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id, runner_name UNION SELECT tennisbets.event_id,event_name, SUM(profit_loss) AS total_profit_loss, 'Match Odds' AS runner_name FROM tennisbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id UNION SELECT soccerbets.event_id,event_name, SUM(profit_loss) AS total_profit_loss, 'Match Odds' AS runner_name FROM soccerbets WHERE user_id = ? AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) GROUP BY event_id )As Combined_Result",
        [user_id, user_id, user_id, user_id, user_id, user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            let queryResult = res;
            const eventsObj = {};

            // Iterate over the query result
            for (let i = 0; i < queryResult.length; i++) {
              const { event_id, event_name, total_profit_loss, runner_name } =
                queryResult[i];

              // Check if the event already exists in the eventsObj
              if (eventsObj[event_name]) {
                // If the event exists, push a new object to its array
                eventsObj[event_name].push({
                  event_id,
                  event_name,
                  total_profit_loss,
                  runner_name,
                });
              } else {
                // If the event doesn't exist, create a new array with the event object
                eventsObj[event_name] = [
                  { event_id, event_name, total_profit_loss, runner_name },
                ];
              }
            }

            // Convert the eventsObj into the desired array format
            const eventsArray = Object.entries(eventsObj).map(
              ([event_name, eventArr]) => ({
                [event_name]: eventArr,
              })
            );

            // Print the resulting array of objects
            console.log(eventsArray);
            resolve(eventsArray);
          }
        }
      );
    });
    return all_bets_pl;
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

ResultMaster.isResultDeclared = async function (result) {
  try {
    return await new Promise((resolve, reject) => {
      if (result.main_type == "match_odd" || result.main_type == "bookmaker") {
        sql_declare =
          "select * from results where event_id = ? and main_type = ?";
        value_sql = [result.event_id, result.main_type];
      } else if (result.main_type == "session") {
        sql_declare =
          "select * from results where event_id = ? and main_type = ? and runner_name = ?";
        value_sql = [result.event_id, result.main_type, result.runner_name];
      } else if (result.main_type == "fancy") {
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

module.exports = ResultMaster;
