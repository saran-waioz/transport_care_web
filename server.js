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
const httpPort = process.env.PORT || 8080;
const server = http.createServer(options,app);
server.listen(httpPort);
console.log('Server listening on ' + ':' + httpPort)