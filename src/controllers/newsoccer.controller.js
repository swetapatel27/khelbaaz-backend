const User = require("../models/user");
const SoccerMaster = require("../models/newsoccer");
const axios = require("axios");

exports.testing = async function (req, res) {
    try {
    const data = await SoccerMaster.saveMarkets();
    res.json(data);
    } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
    }
}

exports.saveSoccerData = async function (req, res) {
    try {
    const data = await SoccerMaster.saveMarkets();
    } catch (err) {
    console.log(err);
    }
}
