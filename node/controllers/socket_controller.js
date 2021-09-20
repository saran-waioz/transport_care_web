const _ = require("lodash");
const moment = require("moment");
const User = require("../models/user");
const Trip = require("../models/trip_details");

// Controller agrees to implement the function called "respond"
module.exports.respond = function (socket_io) {
  socket_io.on("disconnect", function (reason) {});
  socket_io.on("disconnecting", (reason) => {});
  socket_io.on("ping", function (data) {
    global.io.to(socket_io.id).emit("pong", {});
  });
  socket_io.on("room_for_user", function (room) {
    socket_io.join(room);
  });
  socket_io.on("get_trip", async (data) => {
    var trip_populate = [
      "user_detail",
      "caregiver_detail",
      "driver_detail",
      {
        path: "user_rating",
        match: { rating_type: "driver-user" },
      },
      {
        path: "driver_rating",
        match: { rating_type: "user-driver" },
      },
      {
        path: "is_user_rated",
        match: { rating_type: "driver-user" },
      },
      {
        path: "is_driver_rated",
        match: { rating_type: "user-driver" },
      },
    ];
    var trip_detail = await Trip.findOne({ _id: data.trip_id }).populate(
      trip_populate
    );
    global.io.in("trip_" + trip_detail.id).emit("trip_detail", { trip_detail });
  });
  socket_io.on("update_location", async (data) => {
    try {
      let location = {
        type: "Point",
        coordinates: [data.latitude, data.longitude],
      };
      var update = {};
      update.location = location;
      update.bearing = data.bearing;
      await User.findOneAndUpdate({ _id: data.user_id }, { $set: update }).exec(); 
    } catch (error) {
      console.log("55")
    }
    var user_detail = await User.findOne({ _id: data.user_id });
    if (
      user_detail &&
      user_detail.current_trip_id &&
      user_detail.current_trip_id != ""
    ) {
      global.io
        .in("trip_" + user_detail.current_trip_id)
        .emit("driver_location", { data });
    }
  });
};
