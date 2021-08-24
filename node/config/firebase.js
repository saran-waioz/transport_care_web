var FCM = require('fcm-node');
var serverKey = "AAAAuyCaHec:APA91bGzwHDDdHDOODz4Pr_VL34CbIs9iyTWz_sWfjO72b8EtdPGgNBDd5DtQyWDhdSY_3Q74rQAe5YuR9CfEJHjJM4tkHs3K0OJvACxoj7lJ3kG_j8vy1PcOBy9v7xlcoecU5QI5nkZ"
var fcm = new FCM(serverKey);
exports.singleNotification = async(token,title,body,date,data=null,language='en') => {
  var body = body;
  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: token, 
    collapse_key: 'your_collapse_key',
    
    notification: {
        title: title, 
        body: body,
        sound:"default"
    },
    
    data:data
  };

  fcm.send(message, function(err, response){
      if (err) {
          // console.log("Something has gone wrong!",err);
      } else {
          // console.log("Successfully sent with response: ", response);
      }
  });
}