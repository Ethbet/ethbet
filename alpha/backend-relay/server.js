//App depencencies -----------------------------------------/
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const socketService = require('./lib/socketService');

let serverOptions = {
  key: fs.readFileSync('../key.pem'),
  cert: fs.readFileSync('../cert.crt')
};
const server = https.createServer(serverOptions, app);

const io = require('socket.io')(server, {path: '/api/socket.io'});

const web3Service = require('./lib/web3Service');

//App middleware -------------------------------------------/
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(morgan('combined', {
  skip: (req, res) => {
    // log only 4xx and 5xx responses to console
    return res.statusCode < 400;
  }
}));

app.use(cors());

//Route config -------------------------------------------/
require('./routes/apiRoutes')(app);

//Database config ---------------------------------------/
global.db = require('./models');

//Port config ---------------------------------------------------/
const PORT = process.env.PORT || 9000;

//Starting the server ------------------------------------/

server.listen(PORT, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.info("==> 🌎  Listening on port %s.", PORT);
  }
});

// Starting web3 provider unless in test mode
if (process.env.NODE_ENV !== "test") {
  web3Service.init();
}

// init socket service
socketService.init(io);

module.exports = {
  app: app,
  server: server
};