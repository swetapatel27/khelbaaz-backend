const Withdraw = require("../models/withdraw");
const WithdrawProof = require("../models/withdraw_proof");

exports.getWithdrawProofs = async function (req, res) {
  try {
    let withdraw_id = req.params.withdraw_id;
    let proof_requests = await WithdrawProof.getWithdrawProofs(withdraw_id);
    res.status(200).send(proof_requests);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
}
exports.addWithdrawProofs = async function (req, res) {
  try {
    const withdraw_id = req.body.id
    if (!req.files || req.files.length === 0) {
      console.log("No file upload");
    } else {
      const fileNames = req.files.map((file) => {
        return "/" + file.filename;
      });
      const imageObjects = fileNames.map(
        (fileName) => new WithdrawProof({ withdraw_id, image: fileName })
      );
      // return res.json(imageObjects);
      const data = await WithdrawProof.uploadProof(imageObjects);
      res.send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
}
exports.addWithdrawRequest = async function (req, res) {
  try {
    const is_valid = await Withdraw.checkLastRequest(req.body.user_id);
    if(!is_valid){
      return res.status(200).json({'error':'One request is already pending.'});
    }
    let new_withdraw_request = new Withdraw(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      let withdraw_request = await Withdraw.addWithdrawRequest(
        new_withdraw_request
      );
      res.status(200).send(withdraw_request);
    }
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getUserWithdrawRequest = async function (req, res) {
  try {
    let user_id = req.params.user_id;
    let user_requests = await Withdraw.getUserWithdrawRequests(user_id);
    res.status(200).send(user_requests);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAdminWithdrawRequest = async function (req, res) {
  try {
    let status = req.params.status;
    let days = req.params.days;
    let admin_id = req.params.admin_id;
    let user_requests = await Withdraw.getAdminWithdrawRequests(admin_id,status,days);
    res.status(200).send(user_requests);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.updateStatusWithdrawRequest = async function (req, res) {
  try {
    let status = req.body.status;
    let user_id = req.body.user_id;
    // let account_id = req.body.account_id;
    let req_id = req.body.req_id;
    let user_requests = await Withdraw.updateStatusWithdrawRequest(
      status,
      user_id,
      //account_id,
      req_id
    );
    res.status(200).send(user_requests);
  } catch (error) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
