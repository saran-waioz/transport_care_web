const _ = require("lodash")
const moment = require("moment");
const User = require("../models/user");
const Trip = require("../models/trip_details");


// Controller agrees to implement the function called "respond"
module.exports.respond = function(socket_io){
    socket_io.on('disconnect', function(reason){
    });
    socket_io.on("disconnecting", (reason) => {
    });
    socket_io.on('ping', function(data){
      global.io.to(socket_io.id).emit('pong', {});
    });
    socket_io.on('room_for_user', function(room) {
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
      var user_detail = await User.findOne({ _id: data.user_id})
      if(user_detail && user_detail.current_trip_id && user_detail.current_trip_id!="")
      {
        global.io.in("trip_"+ user_detail.current_trip_id).emit('driver_location', { data });
      }
    })
}