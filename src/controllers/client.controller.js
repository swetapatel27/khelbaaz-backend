const Client = require("./../models/client");



exports.testt = async function(req,res){
    return res.json({res:'testing'});
    const gg = await Client.testt(2);
    return res.json(gg);
}
exports.register = function(req,res){

    const new_user = new Client(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }
    else{
        Client.register(new_user,(err,user)=>{
            if(err){
                res.send(err);
            }
            else{
                res.json({error:false, message:"Client added successfully!", data:user});
            }
        })
    }
}