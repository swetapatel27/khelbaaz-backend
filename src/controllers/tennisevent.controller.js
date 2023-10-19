const tennisEvent = require("../models/tennisevent");

// exports.getEventById = async function(req,res){
//     try {
//         const data = await Event.getEventById(req.params.event_id);
//         res.send(data);
//       } catch (err) {
//         console.log(err);
//         res.status(500).send('Error getting data');
//       }
// }

exports.getAllTennisEvents = async function (req, res) {
  try {
    const data = await tennisEvent.getAllTennisEvents();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error getting data");
  }
};
