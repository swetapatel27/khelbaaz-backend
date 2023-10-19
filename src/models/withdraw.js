var dbConn = require("./../../config/db");
const Exposure = require("./exposure");
require("dotenv").config();

var WithdrawMaster = function (withdraw) {
  this.user_id = withdraw.user_id;
  this.amount = withdraw.amount;
  this.txn_type = withdraw.txn_type;
  this.upi = withdraw.upi;
  this.account_id = withdraw.account_id;
  this.ifsc_code = withdraw.ifsc_code;
  this.bank_name = withdraw.bank_name;
  this.branch = withdraw.branch;
  this.username = withdraw.username;
};

WithdrawMaster.checkLastRequest = async function (user_id) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT count(*) as total FROM withdrawrequests WHERE user_id = ? AND status = 0",
        [user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            if(res[0].total > 0) {
              resolve(false);
            }else {
              resolve(true);
            }
          }
        }
      );
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

WithdrawMaster.addWithdrawRequest = async function (withdraw) {
  try {
    let exposure = await Exposure.getExposureByUserId(withdraw.user_id);
    // console.log("exposure-->", exposure[0].exp_amount);
    // console.log("withdraw--->", withdraw);
    let user_data = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from users where id = ?",
        [withdraw.user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    if (user_data.balance + exposure[0].exp_amount > withdraw.amount) {
      withdraw['username']=user_data.username;
      let withdraw_data = {
        ...withdraw,

        // admin_id: user_data.creator_id.split(",").pop(),
        admin_id: 1,
      };
      let result = await new Promise((resolve, reject) => {
        dbConn.query(
          "INSERT INTO withdrawrequests set ?",
          [withdraw_data],
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });
      return result;
    } else {
      return {
        error:
          "Amount must be less than " +
          (user_data.balance + exposure[0].exp_amount),
      };
    }
  } catch (error) {
    console.log(error);
  }
};

WithdrawMaster.updateStatusWithdrawRequest = async function (
  status,
  user_id,
  // account_id,
  req_id
) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update withdrawrequests set status = ? where user_id = ? and id = ?",
        [status, user_id, req_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

WithdrawMaster.getUserWithdrawRequests = async function (user_id) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from withdrawrequests where user_id = ? ORDER BY CASE WHEN status = 0 THEN 0 ELSE 1 END, status, updated_at desc",
        user_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

WithdrawMaster.getAdminWithdrawRequests = async function (admin_id,status='all',days=-1) {
  try {
    let qry ;
    let qryData;
    let wr='';
    if(admin_id == 1 ){
      qryData=[];
      if(days && status){
          if(days>-1){
            wr='WHERE updated_at > CURRENT_DATE - INTERVAL ? DAY';
            qryData.push(days);
          }
          if(status!='all'){
            let searchStatus;
            switch(status){
              case 'pending':
                searchStatus = 0;
                break;
              case 'approved':
                searchStatus = 1;
                break;
              case 'declined':
                searchStatus = -1;
                break;
              default:
                searchStatus = status;
            }
            wr+=' AND status = ?';
            qryData.push(searchStatus);
          }
      }
      qry = `select * from withdrawrequests ${wr} ORDER BY CASE WHEN status = 0 THEN 0 ELSE 1 END, status, updated_at desc`;
      
    } else{
      qryData=[admin_id];
      if(days && status){
        if(days>-1){
          wr='WHERE updated_at > CURRENT_DATE - INTERVAL ? DAY';
          qryData.push(days);
        }
        if(status!='all'){
          let searchStatus;
          switch(status){
            case 'pending':
              searchStatus = 0;
              break;
            case 'approved':
              searchStatus = 1;
              break;
            case 'declined':
              searchStatus = -1;
              break;
            default:
              searchStatus = status;
          }
          wr+=' AND status = ?';
          qryData.push(searchStatus);
        }
      }
      qry =`select * from withdrawrequests where admin_id = ? ${wr} ORDER BY CASE WHEN status = 0 THEN 0 ELSE 1 END, status, updated_at desc`;
      
    }
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        qry,
        qryData,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = WithdrawMaster;
