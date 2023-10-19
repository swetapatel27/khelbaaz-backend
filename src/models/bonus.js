var dbConn = require("../../config/db");
const Ledger = require("./bonus_ledger")


var User = function (user) {
  this.user_id = user.user_id;
  this.bonus_amount = user.bonus_amount;
  this.username = user.username;
  this.balance = user.balance;
  this.setRegistrationBonus = user.setRegistrationBonus;
  this.setReferralBonus = user.setReferralBonus;
  this.setLossBonus = user.setLossBonus;
  this.setFirtDepositBonus = user.setFirstDepositBonus;
  this.setFirtDepositBonusPercent = user.setFirtDepositBonusPercent;
  this.setLossBonusPercent = user.setLossBonusPercent;
  this.setBonusCoversion = user.setBonusCoversion;
};

User.addBonus = async function (username) {

  try {
    let bonusAmount = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT registration_bonus from adminbonus",
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0].registration_bonus);
          }
        }
      )
    })

    //console.log('nnnk-->',bonusAmount);
    // console.log("userid>>>>>>",user_id)
 

    let bonus = await new Promise((resolve, reject) => {
      dbConn.query(
        "UPDATE users SET bonus = ? WHERE username=? ",
        [bonusAmount,
          username
        ],
        (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        }
      )
    })

    let userid = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT id from users where username=?",
        [username],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            console.log('nnk--->',[res,username]);
            resolve(res[0].id);
          }
        }
      )
    })

    const bonusHistory = await Ledger.bonusLadger(userid,bonusAmount,"registation bonus"); 

    return bonus;
  } catch (error) {
    console.log(error);
  }
}

User.addBonusToAccount = async function (user_id, bonus_amount) {
  
  try {
    if (bonus_amount < 100) {
      return {
        error:
          "Amount must be greater than 100"
      };
    }
    else {
      let bonusConversion = await new Promise((resolve, reject) => {
        dbConn.query(
          "SELECT bonus_conversion FROM adminbonus",
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res[0].bonus_conversion);
            }
          }
        );
      });

      let convertedAmount = bonus_amount * ( bonusConversion/100);
      // console.log("convertesAmount>>>>", convertedAmount)

      // let remainingBonus = bonus_amount-covertedAmount;
      let user_data = await new Promise((resolve, reject) => {
        dbConn.query(
          "UPDATE users SET bonus=bonus-? WHERE id=?",
          [bonus_amount, user_id],
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res[0]);
            }
          }
        );
      });


      let result = await new Promise((resolve, reject) => {

        dbConn.query(
          "UPDATE users SET balance=balance+ ? WHERE id=?",
          [
            convertedAmount,
            user_id
          ],
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });

      const bonusHistoryToMain = await Ledger.bonusLadger(user_id,-convertedAmount,"Bonus claimed");
      const bonusHistory = await Ledger.bonusLadger(user_id,convertedAmount,"Bonus claimed"); 

      return result;

    }

  } catch (error) {
    console.log(error);
  }
};


User.editBonusAmount = async function (setRegistrationBonus, setReferralBonus,setBonusConverson,setLossBonusPercent,setDepositBonusPercent,setEnableBonus) {
  try {
    let query = await new Promise((reject, resolve) => {
      dbConn.query(
        "UPDATE adminbonus SET registration_bonus= ?, referral_bonus=?, bonus_conversion=?, loss_bonus_percent=?, deposit_bonus_percent=?, enable_bonus=? WHERE id=1",
        [
          setRegistrationBonus,
          setReferralBonus,
          setBonusConverson,
          setLossBonusPercent,
          setDepositBonusPercent,
          setEnableBonus,
        ],
        (err,res)=> {
          if(err){
            reject(err);
          }
          else{
            resolve(res);
          }
        }
      )
    })
    return query;
  } catch (error) {
    console.log(error);
  }
}

User.getReferralBonus = async function (referer_name) {
  try {
    let refBonus = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT referral_bonus FROM adminbonus",
        (err, res) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(res[0].referral_bonus);
          }
        }
      )
    })

    let addRefferalBonus = await new Promise((resolve, reject) => {
      dbConn.query(
        "UPDATE users SET bonus=bonus+?  WHERE username=?",
        [
          refBonus,
          referer_name
        ],
        (err, res) => {
          if (err) {
            reject(err);

          }
          else {
            resolve(res);
          }
        }
      )
    })

    let userid = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT id from users where username=?",
        [referer_name],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0].id);
          }
        }
      )
    }) 

    const bonusHistory = await Ledger.bonusLadger(userid,refBonus,"referral bonus"); 

    return addRefferalBonus;
  } catch (error) {
    console.log(error)
  }
}


User.firstDepositBonus = async function (amount,user_id) {
  try {

    let getDepositPercentage = await new Promise((resolve, reject) => {
      dbConn.query(
        "SELECT deposit_bonus_percent FROM adminbonus",
        (err, res) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(res[0].deposit_bonus_percent);
          }
        }
      )
    })


    let depositBonusAmount = amount * (getDepositPercentage/100);

    let depositBonus = await new Promise((resolve, reject) => {
      dbConn.query(
        "UPDATE users SET bonus=bonus+? WHERE id=?",
        [
          depositBonusAmount,
          user_id
        ],
        (err, res) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(res);
          }
        }
      )
    })

    const bonusHistory = await Ledger.bonusLadger(user_id,depositBonusAmount,"first deposit bonus"); 

    return depositBonus;

  } catch (error) {
    console.log(error);
  }
}

//total Bonus details for admin for last 24 hours
User.getTotalBonusDetails = async function () {
  let totalBonus = await new Promise ((resolve,reject)=> {
    dbConn.query(
      "SELECT SUM(amount) as total_bonus FROM bonus_ledger WHERE event_name = 'bonus credited' AND created_at >= CURRENT_TIMESTAMP - INTERVAL 24 HOUR",
      (err,res)=> {
        if(err){
          reject(err);
        }
        else{
          resolve(res)
        }
      }
    )
  })
  // console.log(totalBonus);

  let totalBonusClaimed = await new Promise ((resolve,reject)=> {
    dbConn.query(
      "SELECT SUM(amount) as total_bonus_claimed FROM bonus_ledger WHERE event_name = 'bonus claimed' AND created_at >= CURRENT_TIMESTAMP - INTERVAL 24 HOUR ",
      (err,res)=> {
        if(err){
          reject(err);
        }
        else{
          resolve(res[0].total_bonus)
        }
      }
    )
  })
  const bonusClaimed = Math.abs(totalBonusClaimed[0].total_bonus_claimed);
  
  return {
    totalBonus,
    bonusClaimed,
  };
}

module.exports = User;

