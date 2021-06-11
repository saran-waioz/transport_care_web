var FCM = require('fcm-node');
var serverKey = "AAAAjY_2cx8:APA91bH3BA3zy1tLRjWmrMZSELE2zWkQfYOojYaYLSVGqTQnaBsyxAN-opAItKi6n87YQbv9SbyrpUEWuCAXwExRXwnElIhE61VTlUMDV1xEt0XeHRovn0IiRHsCcFqctq7vCUU_519m"
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