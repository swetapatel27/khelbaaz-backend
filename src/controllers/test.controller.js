const Test = require("../models/test");
const Result = require("../models/result");

exports.addTest = async function (req, res) {
  try {
    const result = new Result(req.body);
    const manual_session = { price: req.body.price };
    console.log("result-->", result);
    console.log("manual-->", manual_session);
    const data = await Test.addTest(result, manual_session);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.rollBackResult = async function (req, res) {
  try {
    const result = new Result(req.body);
    console.log("result_data--->", result);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send({ error: true, message: "Please provide all required field" });
    } else {
      const data = await Test.rollBackResult(result);
      res.status(200).send({ message: data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
