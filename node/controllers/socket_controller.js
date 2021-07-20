const _ = require("lodash")
const moment = require("moment");


// Controller agrees to implement the function called "respond"
module.exports.respond = function(socket_io){
    socket_io.on('pong', function(data){
      console.log(data);
    });
}