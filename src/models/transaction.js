var dbConn  = require("./../../config/db");
require("dotenv").config();

var TransactionMaster = function(transaction){
    this.user_id = transaction.user_id;
    this.amount = transaction.amount;
    this.transaction_id = transaction.transaction_id
    this.status = transaction.status
}

TransactionMaster.create = function(newTransaction,result){
    dbConn.query("INSERT INTO transactions set ?",newTransaction,
            (err, res)=>{
                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }else{  
                    if(newTransaction.status=="COMPLETED")
                    {
                        dbConn.query("UPDATE users SET balance = balance + ? WHERE id = ? ",[newTransaction.amount,newTransaction.user_id],(err,newRes)=>{
                          if(err){
                            console.log("error:",err);
                          }      
                          else{
                            res["balance"]=newRes;
                          }
                        });
                    }
                    console.log(res);
                    result(null, res);
                }
            });
}

TransactionMaster.transactionDetailsByID = function(user_id,result){
    dbConn.query("select * from transactions where user_id = ?",user_id,function(err,res){     
        if(err){
            // console.log("error: ", err);
            result(null, err);
        }
        else{
            // console.log('users : ', res);
            result(null, res);
        }
    });
}

module.exports= TransactionMaster;