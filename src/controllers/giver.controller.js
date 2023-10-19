const GiverMaster = require("../models/giver");
const Giver = require("../models/giver");

exports.addGiver = function (data, result) {
  giver = {
    giver_id: data.transfer_to_id,
    receiver_id: data.transfer_from_id,
    amount: data.amount,
  };
  const new_giver = new Giver(giver);

  Giver.create(new_giver, (err, giver) => {
    if (err) {
      res.send(err);
    } else {
      result(null, giver);
    }
  });
};

exports.getGiversByRole = function (req, res) {
  Giver.findGiverByRole(
    req.params.creator_id,
    req.params.role,
    req.params.type,
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        console.log("res", users);
        res.send(users);
      }
    }
  );
};

exports.getSelfGiversByEvent = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const self_givers = await GiverMaster.getSelfGiversByEvent(
      creator_id,
      event_id
    );
    res.send(self_givers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getSelfReceiversByEvent = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const self_receivers = await GiverMaster.getSelfReceiversByEvent(
      creator_id,
      event_id
    );
    res.send(self_receivers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getReceiversByRole = function (req, res) {
  Giver.findReceiverByRole(
    req.params.creator_id,
    req.params.role,
    req.params.type,
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        console.log("res", users);
        res.send(users);
      }
    }
  );
};

exports.addSubGivers = function (user_id, result) {
  Giver.addSubGivers(user_id, (err, givers) => {
    if (err) {
      console.log("contolerrerr-->", err);
      // res.send(err);
    } else {
      console.log("contoleres-->", givers);
      result(null, givers);
    }
  });
};

exports.addSubLosers = function (user_id, result) {
  Giver.addSubLosers(user_id, (err, receivers) => {
    if (err) {
      console.log("contolerrerr-->", err);
      // res.send(err);
    } else {
      console.log("contoleres-->", receivers);
      result(null, receivers);
    }
  });
};
