const User = require("../models/user");
const Exposure = require("../models/exposure");
const CasinoTxn = require("../models/casino_txn");
const CasinoLadger = require("../models/casino_ladger");
const axios = require("axios");

exports.accountActivation = async function (req, res) {
    try {
        const user = await User.casinoAccountActivation(req.userData.user.id);
        // return res.send(process.env.CASINO_API + "addUser?liveMode=true&username="+user.username);
        const response = await axios.post(process.env.CASINO_API + "addUser?liveMode=true&username="+user.username,
        {},
        {
            headers: {
                'Content-Type': 'application/json',
                'authtoken': process.env.CASINO_API_TOKEN
            }
        });
        const api_response = response.data;
        return res.status(200).json(api_response);
    } catch (error) {
        console.log('Error', error.message);
    }
}
exports.getvenderlist = async function (req, res) {
    try {
        const response = await axios.get(process.env.CASINO_API + "vendorList",{
            headers: {
                'Content-Type': 'application/json',
                'authtoken': process.env.CASINO_API_TOKEN
            }
        });
        const vendorList = response.data;
        // return res.json(vendorList);
        if(!vendorList.error){
            res.json(vendorList.data);
        }else{
            res.status(403).json({error: 'not found'});
        }
    } catch (error) {
        console.log('Error', error.message);
    }
};
exports.getGamelistByprovider = async function (req, res) {
    const provider_code  = req.params.provider;
    try {
        const response = await axios.get(process.env.CASINO_API + "gameList?provider="+provider_code,{
            headers: {
                'Content-Type': 'application/json',
                'authtoken': process.env.CASINO_API_TOKEN
            }
        });
        const gameList = response.data;
        if(!gameList.error){
            res.json(gameList.data.gameList);
        }else{
            res.status(403).json({error: 'not found'});
        }
    } catch (error) {
        console.log('Error', error.message);
    }
}
exports.getGameUrlByid = async function (req, res) {
    const gameid  = req.params.gameid;
    try {
        const response = await axios.get(process.env.CASINO_API + `getGameUrl?livemode=true&username=${req.userData.user.username}&gameId=${gameid}`,{
            headers: {
                'Content-Type': 'application/json',
                'authtoken': process.env.CASINO_API_TOKEN
            }
        });
        const gameData = response.data;
        if(!gameData.error){
            res.json({"url":gameData.data.url});
        }else{
            res.status(403).json({error: 'not active'});
        }
    } catch (error) {
        console.log('Error', error.message);
    }
}
exports.depositRequest = async function (req, res) {
    try {
        const user_id = req.userData.user.id;
        const amount = req.body.amount;
        const user = await User.getBalById(user_id);
        const balance = user.balance;
        const usere = await Exposure.getExposureByUserId(user_id);
        const exposure = usere[0].exp_amount;
        if(balance+exposure < amount) return res.json({error: 'Low balance'});

        const percent = 50; // in %
        const txn_id = (Math.random() + 1).toString(36).substring(2);

        // calculate casino points
        const casino_points = (percent/ 100) * amount;
        await CasinoTxn.saveData({user_id,amount,casino_points,txn_id,type:'deposit'});
        await CasinoTxn.saveFundLadger(user_id,amount,casino_points,'deposit');
        await makeCasinoLadger(user_id,casino_points,'deposit');
        await User.updateCasinoAndMainBalance(user_id,amount,casino_points,'deposit');
        res.json({'success': true});
    } catch (error) {
        console.log(error);
        res.status(500).send("Error getting data");
    }
}

exports.getCasinoDepositRequest = async function (req, res) {
    try {
      let user_id = req.params.user_id;
      let user_requests = await CasinoTxn.getCasinoTxnRequests(user_id,'deposit');
      res.status(200).send(user_requests);
    } catch (error) {
      console.log(err);
      res.status(500).send("Error getting data");
    }
};


exports.withdrawRequest = async function (req, res) {
    try {
        const user_id = req.userData.user.id;
        let amount = req.body.amount;
        const user = await User.getBalById(user_id);
        const balance = user.casino_balance;
        if(balance < amount) return res.json({error: 'Low balance'});

        const percent = 50; // in %
        const txn_id = (Math.random() + 1).toString(36).substring(2);

        // convert casino points to amount
        const casino_points = amount;
        amount = (amount * 100) / (100 - percent);
        await CasinoTxn.saveData({user_id,amount,casino_points,txn_id,type:'withdraw'});
        await CasinoTxn.saveFundLadger(user_id,amount,casino_points,'withdraw');
        await makeCasinoLadger(user_id,casino_points,'withdraw');
        await User.updateCasinoAndMainBalance(user_id,amount,casino_points,'withdraw');
        res.json({'success': true});
    } catch (error) {
        console.log(error);
        res.status(500).send("Error getting data");
    }
}

const makeCasinoLadger = async (user_id,points,type) => {
    const ledger_data = {};
    ledger_data.user_id = user_id;
    if(type=='deposit'){
        ledger_data.profit_loss = points;
        ledger_data.description = `${points}p diposit into wallet`
    }else{
        ledger_data.profit_loss = -Math.abs(points);
        ledger_data.description = `${points}p withdraw from the wallet`
    }
    ledger_data.type = 'fund';
    ledger_data.subtype = type;
    return await CasinoLadger.savedata(ledger_data);
}

exports.getCasinoWithdrawRequest = async function (req, res) {
    try {
      let user_id = req.params.user_id;
      let user_requests = await CasinoTxn.getCasinoTxnRequests(user_id,'withdraw');
      res.status(200).send(user_requests);
    } catch (error) {
      console.log(err);
      res.status(500).send("Error getting data");
    }
};

exports.getClientLedgerByDays = async function (req, res) {
    try {
      let user_id = req.params.user_id;
      let days = req.params.days;
      const data = await CasinoLadger.getClientLedgerByDays(user_id, days);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error getting data");
    }
  };
