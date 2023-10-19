const Transaction = require("./../models/transaction");


exports.create = function(req,res){
    const new_transaction = new Transaction(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }
    else{
        Transaction.create(new_transaction,(err,transaction)=>{
            if(err){
                res.send(err);
            }
            else{
                res.json({error:false, message:"transaction details added successfully!", data:transaction});
            }
        })
    }
}

exports.getTransactionDetailsByID = function(req,res){
    Transaction.transactionDetailsByID(req.params.user_id,(err,transactions)=>{
        if(err){
            res.send(err);   
        }
        else{
            console.log('res',transactions);
            res.send(transactions);
        }
    })
}