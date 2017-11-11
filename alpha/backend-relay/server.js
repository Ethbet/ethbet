//App depencencies -----------------------------------------/
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const web3Service = require('./lib/web3Service');

//App middleware -------------------------------------------/
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(morgan('combined', {
  skip: (req, res) => {
    return process.env.NODE_ENV === "test";
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
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});

// Starting web3 provider
web3Service.init();


module.exports = {
  app: app,
  server: server,
  io: io
};