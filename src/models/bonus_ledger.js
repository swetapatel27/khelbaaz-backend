const Ladger = require("./ledger")

exports.bonusLadgerToMain = async (user_id,profit,description) => {

    const ledger_data = {};
    ledger_data.user_id = user_id;
    ledger_data.profit_loss = profit;
    ledger_data.description = description;
    ledger_data.subtype = (profit<1) ? "withdraw" : "deposit";

    let ledger_data2 = {
        user_id: ledger_data.user_id,
        event_name: (description=="Bonus claimed") ? "bonus claimed" : "bonus credited",
        type: "Bonus",
        subtype: ledger_data.subtype,
        runner_name: ledger_data.description,
        profit_loss: ledger_data.profit_loss
      };
      console.log("ledgerdata",ledger_data2)
    return await Ladger.savedata(ledger_data2);

}


exports.bonusLadger = async (user_id,profit,description) => {

  const ledger_data = {};
  ledger_data.user_id = user_id;
  ledger_data.profit_loss = profit;
  ledger_data.description = description;
  ledger_data.subtype = (profit<1) ? "withdraw" : "deposit";

  let ledger_data1 = {
      user_id: ledger_data.user_id,
      event_name: (description=="Bonus claimed") ? "bonus claimed" : "bonus credited",
      type: "Bonus",
      subtype: ledger_data.subtype,
      description: ledger_data.description,
      amount: ledger_data.profit_loss
    };
    console.log("ledgerdata",ledger_data1)
  return await Ladger.bonusLedger(ledger_data1);
}

