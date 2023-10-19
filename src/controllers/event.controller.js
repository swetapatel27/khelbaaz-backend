const Event = require("../models/event");

exports.getEventById = async function(req,res){
    try {
        const data = await Event.getEventById(req.params.event_id);
        res.send(data);
      } catch (err) {
        console.log(err);
        res.status(500).send('Error getting data');
      }
}

exports.getAllEvents = async function(req,res){
  try{
    const data = await Event.getAllEvents();
    res.send(data);
  }catch (err) {
    console.log(err);
    res.status(500).send('Error getting data');
  }
}