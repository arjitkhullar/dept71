var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var cors = require('cors');
var jsonData = require('./data.json');
var currentWeekNumber = require('current-week-number');
var originsWhitelist = [
  'http://localhost:4200', //this is my front-end url for development
  //  'http://www.myproductionurl.com'
];
var corsOptions = {
  origin: function (origin, callback) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
}
app.use(cors(corsOptions));


app.get('/', function (req, res) {
  res.send('<h1>Server Listning</h1>');
});

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('saveData', (data) => {
    let temp = {};
    temp[currentWeekNumber()] = data;
    console.log(temp);
    fs.writeFile('data.json', JSON.stringify(temp, null, 4), function (err) {
      if (err) {
        return console.error(err);
      }
    });
  });
  app.get('/getSheet', (req, res) => {

    // if (jsonData[(currentWeekNumber() + num).toString()]) {
    //   console.log(jsonData[(currentWeekNumber() + num).toString()]);
    //   res.send(JSON.stringify(jsonData[currentWeekNumber() + num]));
    // }
    console.log(req, res);
  });

});
http.listen(3003, function () {
  console.log('app running on port 3003');
});
