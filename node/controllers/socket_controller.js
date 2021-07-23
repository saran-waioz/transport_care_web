const _ = require("lodash")
const moment = require("moment");
const User = require("../models/user");



// Controller agrees to implement the function called "respond"
module.exports.respond = function(socket_io){
    socket_io.on('pong', function(data){
      console.log(data);
    });

    socket_io.on('update_location', async(data) => {
      let location = {
        type: "Point",
        coordinates: [data.longitude,data.latitude]
      }
      var update = {}
      update.location = location;
      update.bearing = data.bearing;
      await User.findOneAndUpdate({ "_id": data.user_id }, { "$set": update}).exec();
    })
}