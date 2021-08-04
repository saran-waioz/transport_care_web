const _ = require("lodash")
const moment = require("moment");
const User = require("../models/user");



// Controller agrees to implement the function called "respond"
module.exports.respond = function(socket_io){
    socket_io.on('ping', function(data){
      console.log(data.id)
      global.io.to(data.socket_id).emit('pong', {});
    });
    socket_io.on('room_for_user', function(room) {
      console.log(room)
      socket_io.join(room);
    });
    socket_io.on('update_location', async(data) => {
      let location = {
        type: "Point",
        coordinates: [data.latitude,data.longitude]
      }
      var update = {}
      update.location = location;
      update.bearing = data.bearing;
      await User.findOneAndUpdate({ "_id": data.user_id }, { "$set": update}).exec();
    })
}