const Report = require("../models/report");

exports.getCompanyReport = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const company_report = await Report.getCompanyReport(creator_id, event_id);
    res.status(200).send(company_report);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};

exports.getAgentStats = async function (req, res) {
  try {
    const creator_id = req.params.creator_id;
    const event_id = req.params.event_id;
    const agent_stats = await Report.getAgentStats(creator_id, event_id);
    res.status(200).send(agent_stats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
