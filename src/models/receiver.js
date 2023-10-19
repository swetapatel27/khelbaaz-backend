var dbConn  = require("./../../config/db");
const jwt = require("jsonwebtoken");
const db = require("./../../config/db");
require("dotenv").config();


var ReceiverMaster = function(receiver){
    this.receiver_id = receiver.receiver_id;
    this.giver_id = receiver.giver_id;
    this.amount = receiver.amount;
}

ReceiverMaster.create = function (new_receiver,result){
    dbConn.query("INSERT INTO receivers set ?", new_receiver,(err,res)=>{
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
}


ReceiverMaster.findReceiverByRole = function(creator_id,role,type="other",result){
    
    if(type=="self"){
        dbConn.query("select amount, r.name, g.name as giver_name from receivers inner join users as r on receiver_id = r.id INNER join users as g on giver_id = g.id where receiver_id = r.id and receiver_id = ?",creator_id,(err,res)=>{
            if(err){
                
                result(null, err);
            }
            else{
                result(null, res);
            }
        });
    }else{
        
        dbConn.query("select r.role, amount, r.name, g.name as giver_name from receivers inner join users as r on receiver_id = r.id INNER join users as g on giver_id = g.id where receiver_id = r.id and r.role = ? and FIND_IN_SET(?,r.creator_id)",[role, creator_id],(err,res)=>{
            if(err){
                
                result(null, err);
            }
            else{
                result(null, res);
            }
        });
    }

  
}

module.exports= ReceiverMaster;