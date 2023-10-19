var dbConn  = require("./../../config/db");
const User = require("../models/user");
const Ladger = require("../models/ledger");
const Setting = require("../models/settings");
const Bonus = require("./bonus");

require("dotenv").config();


var ClientMaster = function(user){
    this.role = user.role;
    this.name = user.name;
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.contact = user.contact;
    this.creator_id = user.creator_id;
    this.referer_name = user.referer_name;
}

ClientMaster.register = function(newUser,result){
    
    if(newUser.referer_name == null)
        {
            newUser['creator_id']= 1;
            dbConn.query("INSERT INTO users set ?",newUser,
            (err, res)=>{
                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }else{  
                    result(null, res);
                    Bonus.addBonus(newUser.username);
                    //return false;
                }
            });
        }
    else{
        dbConn.query("select id,creator_id from users where username = ?",newUser.referer_name,(err,res)=>{
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }else{
                if(res[0].id.length==0)
                {
                    result("No such referer exists");
                }
                else{
                    newUser["creator_id"] = res[0].creator_id + "," + res[0].id;
                    newUser["added_by"] = res[0].id;
                    newUser["balance"] = 0;
                }
                dbConn.query("INSERT INTO users set ?", newUser,(err,res)   =>{
                    if(err) {
                        console.log("error: ", err);
                        result(err, null);
                    }else{
                        Bonus.addBonus(newUser.username);
                        Bonus.getReferralBonus(newUser.referer_name);
                        //joiningBonus(res.insertId);
                        result(null, res.insertId);
                    }
                });
            }
        });
    }
}

ClientMaster.testt = async function(user_id){
    try {
        let result = await new Promise((resolve, reject) => {
            const ft = joiningBonus(user_id);
            if (ft) {
                resolve(ft);
            } else {
                reject('Failed to join bonus');
            }
        });
        return result;
    } catch (err) {
        console.error(err);
    }
}

const joiningBonus = async (user_id) => {
    const bonus_amount = await Setting.getJoiningBonus();
    if(bonus_amount < 1) return false;
    let ledger_data = {
        user_id: user_id,
        event_name: `joining bonus`,
        type: "fund",
        subtype:'deposit',
        runner_name: 'joining bonus',
        profit_loss: bonus_amount
      };
    const res = await Ladger.savedata(ledger_data);
    await User.updateMainBalance(user_id,bonus_amount);
    return res;
}
module.exports= ClientMaster;