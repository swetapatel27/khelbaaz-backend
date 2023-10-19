var dbConn = require("./../../config/db");
const Exposure = require("./exposure");
require("dotenv").config();
const Bonus = require("./bonus");

var DepositMaster = function (deposit) {
  this.user_id = deposit.user_id;
  this.method = deposit.method;
  this.amount = deposit.amount;
  // this.paytm = withdraw.paytm;
  // this.gpay = withdraw.gpay;
  // this.account_id = withdraw.account_id;
  // this.ifsc_code = withdraw.ifsc_code;
  // this.bank_name = withdraw.bank_name;
  // this.branch = withdraw.branch;
  this.transaction_id = deposit.transaction_id;
  this.username = deposit.username;
};

DepositMaster.checkLastRequest = async function (user_id) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT count(*) as total FROM depositrequests WHERE user_id = ? AND status = 0",
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
DepositMaster.checkRefNo = async function (user_id,txn_no) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT count(*) as total FROM depositrequests WHERE user_id = ? AND transaction_id = ?",
        [user_id,txn_no],
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

DepositMaster.addDepositRequest = async function (deposit, fileUrl) {
  try {
    let exposure = await Exposure.getExposureByUserId(deposit.user_id);
    console.log("exposure-->", exposure[0].exp_amount);
    let user_data = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from users where id = ?",
        [deposit.user_id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        }
      );
    });
    // if (user_data.balance + exposure[0].exp_amount > deposit.amount) {
    let deposit_data = {
      ...deposit,
      depo_proof: fileUrl,
      // admin_id: user_data.creator_id.split(",").pop(),
      admin_id: 1,
    };
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "INSERT INTO depositrequests set ?",
        [deposit_data],
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
    // }
    // else {
    //   return {
    //     error:
    //       "Amount must be less than " +
    //       (user_data.balance + exposure[0].exp_amount),
    //   };
    // }
  } catch (error) {
    console.log(error);
  }
};

DepositMaster.updateStatusDepositRequest = async function (
  status,
  user_id,
  req_id
) {
  try {
    console.log("status-->", status, user_id, req_id);
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "update depositrequests set status = ? where user_id = ? and id = ?",
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

    let result1 = await new Promise((resolve, reject) => {
      dbConn.query(
        "select count(*) as total_requests from depositrequests where user_id = ? AND status=1",
        user_id,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0].total_requests);
          }
        }
      );
    })

    //console.log('res>',result1);
    
    if(result1==1){
      let amount = await new Promise((resolve, reject) => {
        dbConn.query(
          "select amount from depositrequests where user_id = ? AND status=1",
          user_id,
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res[0].amount);
            }
          }
        );
      })
      console.log(amount,user_id)
      await Bonus.firstDepositBonus(amount,user_id);
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

DepositMaster.getUserDepositRequests = async function (user_id) {
  try {
    let result = await new Promise((resolve, reject) => {
      dbConn.query(
        "select * from depositrequests where user_id = ? ORDER BY CASE WHEN status = 0 THEN 0 ELSE 1 END, status",
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

DepositMaster.getAdminDepositRequests = async function (admin_id,status='all',days=-1) {
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
      qry = `select * from depositrequests ${wr} ORDER BY CASE WHEN status = 0 THEN 0 ELSE 1 END, status, updated_at desc`;
      
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
      qry =`select * from depositrequests where admin_id = ? ${wr} ORDER BY CASE WHEN status = 0 THEN 0 ELSE 1 END, status, updated_at desc`;
      
    }
    // console.log({qry,qryData});
    // return;
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

module.exports = DepositMaster;
