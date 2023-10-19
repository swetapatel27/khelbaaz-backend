const User = require("../models/user");
const Exposure = require("../models/exposure");
const ServerLog = require("../models/serverlog");
const CasinoBets = require("../models/casino_bets");
const CasinoResult = require("../models/casino_results");
const CasinoLadger = require("../models/casino_ladger");
const Ladger = require("../models/ledger");

// Helper function for generating responses
function generateResponse(error, message, data = {}) {
    return {
        code: 0,
        error: error ? true : false,
        message,
        data,
    };
}

exports.casinowebhook = async function (req, res) {
    try {
        const {
            username,
            bal,
            gameId,
            gameName,
            roundId,
            transactionId,
            sessionId,
            betId,
            action,
            finished:finishedRequest,
        } = req.body;

        const data = {
            url: "/casino-webhook",
            response: JSON.stringify(req.body),
        };
        await ServerLog.savelog(data);

        const user = await User.getCasinoBalance(username);
        let ress = generateResponse(true, "not found");

        if (user) {
            const usere = await Exposure.getExposureByUserId(user.id);
            ress = generateResponse(false, "Success",{
                username,
                userBalance:user.balance+usere[0].exp_amount
            });

            const casino_data = {
                user_id: user.id,
                amount: bal,
                gameid: gameId,
                game_name: gameName,
                roundid: roundId,
                txn_id: transactionId,
                session_id: sessionId,
                betid: betId,
            };
            const isFinished = await check_finished(casino_data);
            switch (action) {
                case "bet":
                    // save bet data
                    if (isFinished){
                        await CasinoBets.savedata(casino_data);
                        const balanceDeduct = -Math.abs(casino_data.amount);
                        await User.updateCasinoBalance(casino_data.user_id,balanceDeduct);
                        // await saveExposure(casino_data,balanceDeduct);
                    }
                    break;
                case "win":
                case "lose":
                    // save win lose data
                    casino_data.type = action;
                    const betTotal = await CasinoBets.calculateProfit(casino_data.user_id,casino_data.gameid,casino_data.roundid);
                    if (action === "lose"){
                        casino_data.profit = -Math.abs(betTotal);
                        casino_data.amount = -Math.abs(betTotal);
                    }else{
                        casino_data.profit = casino_data.amount-betTotal;
                    }
                    if (isFinished) await CasinoResult.savedata(casino_data);
                    if (isFinished && finishedRequest === 1) {
                        await markAsFinished(casino_data.amount,user.id,gameId,casino_data.game_name,roundId,action,casino_data.profit,casino_data.txn_id);
                    }
                    break;
                case "refund":
                    // Handle refund logic
                    break;
            }
        }

        return res.status(200).send(ress);
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({ error: 'something went wrong' });
    }
};

const check_finished = async (casino_data) => {
    const { user_id,gameid,roundid } = casino_data;
    const isFinished = await CasinoBets.checkFinished(user_id,gameid,roundid);
    return isFinished;
}

const markAsFinished = async (amount,user_id,gameid,game_name,roundid,type,profit,txn_id) => {
    // set as is_finished true in bet table and make ladger
    //const profit = await CasinoBets.calculateProfit(user_id,gameid,roundid);
    await CasinoResult.markAsFinished(user_id,gameid,roundid);
    await makeLadger(amount,user_id,gameid,game_name,roundid,type,profit,txn_id);
}

const saveExposure = async (casino_data,amount) => {
    let exposure_data = {
        user_id: casino_data.user_id,
        deducted_amount: amount,
        exp_amount: amount,
        event_id: casino_data.gameid,
        runner_name: casino_data.roundid,
        main_type: "casino",
        type: "casino",
        price: "0",
        size: "0",
        difference: "0"
    };
    return await Exposure.addExposure(exposure_data);
}

const makeLadger = async (amount,user_id,gameid,game_name,roundid,type,profit,txn_id="") => {
    const ledger_data = {};
    ledger_data.user_id = user_id;
    ledger_data.game_name = game_name;
    ledger_data.gameid = gameid;
    ledger_data.roundid = roundid;
    ledger_data.profit_loss = profit;
    ledger_data.description = `${type} Rs${profit} at Txn id: ${txn_id}`;
    ledger_data.type = 'game';
    ledger_data.subtype = (profit<1) ? "withdraw" : "deposit";
    // with update casino balance
    if(type=='win') await User.updateCasinoBalance(user_id,amount);
    // await Exposure.markAsCloseExposure(user_id,gameid,roundid);
    let ledger_data2 = {
        user_id: ledger_data.user_id,
        event_name: `game data ${ledger_data.game_name}/ ${ledger_data.gameid}/ ${ledger_data.roundid}`,
        type: "casino",
        subtype: ledger_data.subtype,
        runner_name: ledger_data.description,
        profit_loss: ledger_data.profit_loss
      };
    return await Ladger.savedata(ledger_data2);
    // return await CasinoLadger.savedata(ledger_data);
}

exports.casinobalwebhook = async function (req, res) {
    try {
        // save logs 
        const data = {
            url:"/casino-webhook-bal",
            response: JSON.stringify(req.body)
        }
        await ServerLog.savelog(data);

        if(req.body.action=="bal" || true){
            const username = req.body.username;
            const user = await User.getCasinoBalance(username);
            let ress = generateResponse(true, "not found");
            if(user){
                const usere = await Exposure.getExposureByUserId(user.id);
                ress = generateResponse(false, "Success",{
                    username,
                    userBalance:user.balance+usere[0].exp_amount
                });
            }
            return res.status(200).send(ress);
        }
    } catch (error) {
        console.log('Error', error.message);
        res.status(500).json({'error':'something went wrong'});
    }
};
