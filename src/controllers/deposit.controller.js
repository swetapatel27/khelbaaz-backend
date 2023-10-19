const Deposit = require("../models/deposit");

exports.addDepositRequest = async function (req, res) {
  try {
    const is_valid = await Deposit.checkLastRequest(req.body.user_id);
    if(!is_valid){
      return res.status(200).json({'error':'One request is already pending.'});
    }
    const is_refvalid = await Deposit.checkRefNo(req.body.user_id,req.body.transaction_id);
    if(!is_refvalid){
      return res.status(200).json({'error':"You cann't use same utr twice."});
    }
    let new_deposit_request = new Deposit(req.body);
    const fileUrl = "/" + req.file.filename;
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      let deposit_request = await Deposit.addDepositRequest(
        new_deposit_request,
        fileUrl
      );
      res.status(200).send(deposit_request);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getUserDepositRequest = async function (req, res) {
  try {
    let user_id = req.params.user_id;
    let user_requests = await Deposit.getUserDepositRequests(user_id);
    res.status(200).send(user_requests);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAdminDepositRequest = async function (req, res) {
  try {
    let status = req.params.status;
    let days = req.params.days;
    let admin_id = req.params.admin_id;
    let user_requests = await Deposit.getAdminDepositRequests(admin_id,status,days);
    res.status(200).send(user_requests);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.updateStatusDepositRequest = async function (req, res) {
  try {
    let status = req.body.status;
    let user_id = req.body.user_id;
    let req_id = req.body.req_id;
    let user_requests = await Deposit.updateStatusDepositRequest(
      status,
      user_id,
      req_id
    );
    res.status(200).send(user_requests);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
