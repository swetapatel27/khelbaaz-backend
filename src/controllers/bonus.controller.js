const User = require('../models/user');
const Bonus = require('../models/bonus');
const Ledger = require('../models/bonus_ledger');
// const bonusCron = require('../cron/weeklyBonus');\

exports.bonus = async function (username,req, res) {
      try {
        const bonus = await Bonus.addBonus(username);
        console.log('bonus',bonus);
        //return ;
        // const getTotalBonusIssued = await Ledger.bonusLadger(); 
      } catch (error) {
        console.log(error)
        res.status(500).send("Error getting data");
      }
  
};

exports.convertBonus = async function(req, res) {

  const user_id= req.body.user_id;
  const bonus_amount = req.body.bonus_amount;
  // console.log("bonus>>>>>>",bonus)
  try {
    const bonusCoverted = await Bonus.addBonusToAccount(user_id, bonus_amount);
    // await Ledger.bonusDepositLedger(bonusCoverted);
    res.send(bonusCoverted)
  } catch (error) {
    console.log(error)
    res.status(500).send("Error getting data");
  }

}

exports.editBonusAmount = async function(req, res) {
  const setRegistrationBonus= req.body.registration_bonus;
  const setReferralBonus= req.body.referral_bonus;
  const setBonusConverson = req.body.bonus_conversion;
  const setLossBonusPercent = req.body.loss_bonus_percent;
  const setDepositBonusPercent = req.body.deposit_bonus_percent;
  const setEnableBonus = req.body.enable_bonus
  try {
     const editedBonus= await Bonus.editBonusAmount(setRegistrationBonus,setReferralBonus,setBonusConverson,setLossBonusPercent,setDepositBonusPercent,setEnableBonus);
     res.send(editedBonus);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error While Changing Bonus");
  }
}

exports.referralBonus= async function(user_id,req, res) {

  try {
    const result = await Bonus.getReferralBonus(user_id);

  } catch (error) {
    console.log(err);
    res.status(500).send("Error Adding Bonus");
  }
}

exports.lossBonus = async function(req, res) {
  const user_id = req.body.user_id;
  try {
    const bonusOnLoss = await Bonus.getLossBonus(user_id)
    res.send(bonusOnLoss);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting Bonus");
  }
}

exports.firstDepositBonus = async function(amount,user_id,req, res) {

  try {
    const depositBonus= await Bonus.firstDepositBonus(amount,user_id);
    // const createTransaction = await transacation.create();
    // res.send(depositBonus)
  } catch (error) {
    console.log(error)
    res.status(500).send("Error getting Bonus");
  }
}

exports.getTotalBonus = async function (req, res) {

  try {
    const getTotalBonusIssued = await Bonus.getTotalBonusDetails(); 
    res.send(getTotalBonusIssued);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting total Bonus");
  }
} 

// exports.addToLedger = async function (req,res) {
//   const user_id = req.body.user_id;
//   const event_name = req.body.event_name;
//   const subtype = req.body.subtype;
//   const runner_name = req.body.runner_name;
//   const profit_loss = req.body.profit_loss;
//   try {
//     const getTotalBonusIssued = await Ledger.bonusLadger(2,200); 
//     res.send(getTotalBonusIssued);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error getting total Bonus");
//   }
// } 

