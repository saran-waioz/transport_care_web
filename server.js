/* For env file function */
const dotenv = require('dotenv');
dotenv.config();

if (!process.env.PORT) {
  console.log('Please configure env file.')
  console.log('Copy .env.default to .env and configure the values.')
  return
}

const fs = require('fs');
if(process.env.HTTPS=="true")
{
  var http = require('https');
  var options = {
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT)
  };
  
}
else
{
  var http = require('http');
  var options = {};
}

const app = require('./node/app');
const socketController = require('./node/controllers/socket_controller');
const httpPort = process.env.PORT || 8080;
const server = http.createServer(options,app);
const io = require('socket.io')(server);
global.io = io; //added
io.sockets.on('connection', socketController.respond );
const agenda = require('./node/agenda');
server.listen(httpPort);
agenda.start()
console.log('Server listening on ' + ':' + httpPort)