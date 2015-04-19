var https = require('https'),
  express = require('express'),
  path = require('path'),
  MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  Driver = require('./driver').Driver,
  tls = require('tls'),
  fs = require('fs');

var options = {
  key: fs.readFileSync('./openssl/key.pem'),
  cert: fs.readFileSync('./openssl/cert.pem'),

  // This is necessary only if using the client certificate authentication.
  requestCert: true
};

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser());

var mongoHost = 'localHost';
var mongoPort = 27017;
var driver;

var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
mongoClient.open(function(err, mongoClient) {

  if (!mongoClient) {
    console.error("Error! Exiting... Must start MongoDB first");
    process.exit(1);
  }
  
  var db = mongoClient.db("IrisDatabase");
  driver = new Driver(db);

});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/api/users/:id', function(req, res) {
  driver.handleGet(req, res);
});

app.put('/api/users', function(req, res) {
  driver.handlePut(req, res);
});

app.post('/api/users/:id', function(req, res) {
  driver.handlePost(req, res);
});

app.use(function(req, res) {
  res.render('404', {
    url: req.url
  });
});

https.createServer(options, app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});