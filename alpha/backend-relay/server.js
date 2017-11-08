//App depencencies -----------------------------------------/
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var morgan = require('morgan');


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


//Route config -------------------------------------------/
require('./routes/apiRoutes')(app);

//Database config ---------------------------------------/
global.db = require('./models');

//Port config ---------------------------------------------------/
var PORT = process.env.PORT || 9000;

//Starting the server ------------------------------------/

app.listen(PORT, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});


module.exports = {
  app: app
};