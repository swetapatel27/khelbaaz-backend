var dbConn = require("./../../config/db");
const Giver = require("./../controllers/giver.controller");
require("dotenv").config();

var fundMaster = function (fund_details) {
  this.transfer_from_id = fund_details.transfer_from_id;
  this.transfer_to_id = fund_details.transfer_to_id;
  this.amount = fund_details.amount;
  this.transfer_by = fund_details.transfer_by;
  this.transfer_from_balance = fund_details.transfer_from_balance;
  this.transfer_to_balance = fund_details.transfer_to_balance;
};

fundMaster.create = async function (new_fund_details, result) {
  let ledger_data = await new Promise((resolve, reject) => {
    dbConn.query(
      "select role from users where id = ?",
      new_fund_details.transfer_from_id,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          let role_id = res[0].role;
          // console.log("role id-->", role_id);
          // let ledger_details = {};
          if (role_id == 5) {
            let ledger_details = {
              user_id: new_fund_details.transfer_from_id,
              type: "fund",
              subtype: "withdraw",
              runner_name: "withdraw",
              profit_loss: 0 - new_fund_details.amount,
            };
            resolve(ledger_details);
          } else if (role_id < 5) {
            let ledger_details = {
              user_id: new_fund_details.transfer_to_id,
              type: "fund",
              subtype: "deposit",
              runner_name: "deposit",
              profit_loss: new_fund_details.amount,
            };
            resolve(ledger_details);
          }
          // resolve(ledger_details);
        }
      }
    );
    // console.log(ledger_details);
    // return ledger_details;
  });

  let add_ledger = await new Promise((resolve, reject) => {
    // console.log("ledger data-->", ledger_data);
    const sql = `INSERT INTO ledger set ?`;
    dbConn.query(sql, ledger_data, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  let data = await new Promise((resolve, reject) => {
    dbConn.query(
      "select id,balance from users where id = ? or id=?",
      [new_fund_details.transfer_from_id, new_fund_details.transfer_to_id],
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const transferFromObj = res.find(
            (obj) => obj.id == new_fund_details.transfer_from_id
          );
          const transferToObj = res.find(
            (obj) => obj.id == new_fund_details.transfer_to_id
          );

          if (transferFromObj) {
            console.log("fro bacl", transferFromObj.balance);
            new_fund_details.transfer_from_balance = transferFromObj.balance;
          }

          if (transferToObj) {
            new_fund_details.transfer_to_balance = transferToObj.balance;
          }
          resolve(new_fund_details);
        }
      }
    );
    return new_fund_details;
  });

  dbConn.query("INSERT INTO funds set ?", data, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      Giver.addGiver(new_fund_details, (err, data) => {
        if (err) {
          result(err, null);
        } else {
          res.giver_id = data;

          result(null, { fund_id: res.insertId, ledger_id: res.giver_id });
        }
      });
      // Receiver.addReceiver(new_fund_details,(err,data)=>{
      //     if(err){
      //         result(err,null);
      //     }
      //     else{
      //         res.receiver_id = data;
      //         result(null, {fund_id:res.insertId,giver_id:res.giver_id,receiver_id:res.receiver_id});
      //     }
      // });
    }
  });
};

fundMaster.findAll = async function (user_id) {
  try {
    console.log(user_id);
    let fund_details = await new Promise((resolve, reject) => {
      dbConn.query(
        "select f.id, t.name as t_name,t.role as t_role, r.name as r_name, r.role as r_role, f.amount from users as t INNER join funds as f on f.transfer_from_id = t.id inner join users as r on r.id = f.transfer_to_id where f.transfer_by = ? order by f.created_at desc",
        user_id,
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
    return fund_details;
  } catch (error) {
    console.log(error);
  }
};

fundMaster.fundTransactionDetails = async function (user_id) {
  try {
    console.log(user_id);
    let fund_details = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT u1.name AS debit_user, u2.name AS credit_user, t.transfer_from_id AS debit_account, t.transfer_to_id AS credit_account, t.amount, t.created_at FROM funds t JOIN users u1 ON t.transfer_from_id = u1.id JOIN users u2 ON t.transfer_to_id = u2.id WHERE t.transfer_from_id = ? OR t.transfer_to_id = ? order by t.created_at desc",
        [user_id, user_id],
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
    return fund_details;
  } catch (error) {
    console.log(error);
  }
};

//arjun agent ledger for today
fundMaster.agentLedgerToday = async function (user_id,role_id) {
  try {
    let qry = "";
    let qrydata = "";
    if (role_id == 1) {
      qry = "SELECT f.`created_at`,f.transfer_from_balance,f.transfer_to_balance, CASE WHEN f.transfer_from_id = ? THEN -f.amount WHEN f.transfer_to_id = ? THEN f.amount ELSE 0 END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE DATE(f.created_at) = CURDATE() order by f.created_at desc";
      qrydata = [user_id, user_id];
    } else if (role_id == 4) {
      qry = "SELECT f.`created_at`,f.transfer_from_balance,f.transfer_to_balance, CASE WHEN f.transfer_from_id = 1 THEN -f.amount ELSE f.amount END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE (FIND_IN_SET(?, u_to.creator_id) OR FIND_IN_SET(?, u_from.creator_id)) AND DATE(f.created_at) = CURDATE() order by f.created_at desc";
      qrydata = [user_id, user_id, user_id, user_id];
    } else {
      qry = "SELECT f.`created_at`,f.transfer_from_balance,f.transfer_to_balance, CASE WHEN f.transfer_from_id = ? THEN -f.amount WHEN f.transfer_to_id = ? THEN f.amount ELSE 0 END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE (f.transfer_from_id = ? OR f.transfer_to_id = ?) AND DATE(f.created_at) = CURDATE() order by f.created_at desc";
      qrydata = [user_id, user_id, user_id, user_id];
    }
    let agent_ledger = await new Promise((resolve, reject) => {
      dbConn.query(
        qry,
        qrydata,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return agent_ledger;
  } catch (error) {
    console.log(error);
  }
};

//arjun agent ledger with filter
fundMaster.agentLedgerFilter = async function (user_id, role_id, from_date, to_date) {
  try {
    let qry = "";
    let qrydata = "";
    if (role_id == 1) {
      qry = "SELECT f.`created_at`, f.transfer_from_balance, f.transfer_to_balance, CASE WHEN f.transfer_from_id = ? THEN -f.amount WHEN f.transfer_to_id = ? THEN f.amount ELSE 0 END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE DATE( f.`created_at`) BETWEEN ? AND ? order by f.created_at desc ";
      qrydata = [user_id, user_id, from_date, to_date];
    } else if (role_id == 4) {
      qry = "SELECT f.`created_at`, f.transfer_from_balance, f.transfer_to_balance, CASE WHEN f.transfer_from_id = 1 THEN -f.amount ELSE f.amount END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE FIND_IN_SET(?, u_to.creator_id) AND DATE( f.`created_at`) BETWEEN ? AND ? order by f.created_at desc ";
      qrydata = [user_id, from_date, to_date];
    } else {
      qry = "SELECT f.`created_at`, f.transfer_from_balance, f.transfer_to_balance, CASE WHEN f.transfer_from_id = ? THEN -f.amount WHEN f.transfer_to_id = ? THEN f.amount ELSE 0 END AS amount, u_from.username AS transfer_from_name, u_to.username AS transfer_to_name FROM funds f JOIN users u_from ON f.transfer_from_id = u_from.id JOIN users u_to ON f.transfer_to_id = u_to.id WHERE (f.transfer_from_id = ? OR f.transfer_to_id = ?) AND DATE( f.`created_at`) BETWEEN ? AND ? order by f.created_at desc ";
      qrydata = [user_id, user_id, user_id, user_id, from_date, to_date];
    }
    let agent_ledger = await new Promise((resolve, reject) => {
      dbConn.query(
        qry,
        qrydata,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
    return agent_ledger;
  } catch (error) {
    console.log(error);
  }
};

module.exports = fundMaster;
