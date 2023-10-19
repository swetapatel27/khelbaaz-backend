const soccerEvent = require("../models/soccerevent");

// exports.getEventById = async function(req,res){
//     try {
//         const data = await Event.getEventById(req.params.event_id);
//         res.send(data);
//       } catch (err) {
//         console.log(err);
//         res.status(500).send('Error getting data');
//       }
// }

exports.getAllSoccerEvents = async function (req, res) {
  try {
    const data = await soccerEvent.getAllSoccerEvents();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
