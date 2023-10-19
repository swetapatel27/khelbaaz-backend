const User = require("./../models/user");
const Fund = require("./../models/fund");

//update balance
exports.fundTransfer = function (req, res) {
  data = req.body;
  const new_fund = new Fund(req.body);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res
      .status(400)
      .send({ error: true, message: "Please provide all required field" });
  } else {
    User.fundTransfer(data, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        Fund.create(new_fund, (err, data) => {
          if (err) {
            res.send(err);
          } else {
            res.json({
              error: false,
              message: "funds added into fundmaster successfully!",
              data: data,
            });
          }
        });
      }
    });
  }
};

//get fund details
exports.fundTransferDetails = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    console.log("called");
    console.log("id", user_id);
    const transfer_details = await Fund.findAll(user_id);
    res.send(transfer_details);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};
//get fund details
exports.fundTransactionDetails = async function (req, res) {
  try {
    const user_id = req.params.user_id;
    const transfer_details = await Fund.fundTransactionDetails(user_id);
    res.send(transfer_details);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};
//get fund agent ledger
exports.agentLedgerToday = async function (req, res) {
  try {
    const role_id = req.userData.user.role;
    const user_id = req.params.user_id;
    const agent_ledger = await Fund.agentLedgerToday(user_id,role_id);
    res.send(agent_ledger);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};
//get fund agent ledger with filter
exports.agentLedgerFilter = async function (req, res) {
  try {
    const role_id = req.userData.user.role;
    const user_id = req.params.user_id;
    const from_date = req.params.from_date;
    const to_date = req.params.to_date;
    const agent_ledger = await Fund.agentLedgerFilter(
      user_id,
      role_id,
      from_date,
      to_date
    );
    res.send(agent_ledger);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
};
