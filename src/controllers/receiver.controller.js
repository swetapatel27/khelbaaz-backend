const Receiver = require('../models/receiver');

exports.addReceiver = function(data,result){
    receiver = {receiver_id:data.transfer_from_id,giver_id:data.transfer_to_id,amount:data.amount} 
    const new_receiver = new Receiver(receiver);
        Receiver.create(new_receiver,(err,receiver)=>{
            if(err){
                res.send(err);
            }
            else{
                result(null,receiver);
            }
        });
}

exports.getReceiversByRole = function(req,res){

    Receiver.findReceiverByRole(req.params.creator_id,req.params.role,req.params.type,(err,users)=>{
        
        if(err){
            res.send(err);
        }
        else{
            console.log('res',users);
            res.send(users);
        }
    })
}