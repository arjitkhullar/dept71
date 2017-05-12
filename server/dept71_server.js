var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jsonfile = require('jsonfile');
var datafile = 'data.json';
var usersfile = 'users.json';
var partsfile = 'parts.json';
var templateWeek = require('./template.json');
var currentWeekNumber = require('current-week-number');

app.get('/', function (req, res) {
  res.send('<h1>Server Listning</h1>');
});

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('saveData', (data) => {
    let temp = {};
    let week = data['week'] + currentWeekNumber();
    temp[week] = data['data'];
    writeJson(temp, week);
  });
  socket.on('getSheet', (num) => {
    jsonfile.readFile(datafile, function (err, jsonData) {
      if (err) {
        return console.log(err);
      }
      if (jsonData[(currentWeekNumber() + num).toString()]) {
        io.emit('loadSheet', {
          sheet: jsonData[currentWeekNumber() + num]
        });
      } else {
        let temp = {};
        temp[currentWeekNumber() + num] = templateWeek;
        writeJson(temp, currentWeekNumber() + num);
        io.emit('loadSheet', {
          sheet: temp[currentWeekNumber() + num]
        });
      }
    });
  });
  socket.on('transferSheet', (data) => {
    jsonfile.readFile(datafile, function (err, jsonData) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
      if (jsonData[(currentWeekNumber() + data['to'])]) {
        TransferDataJson(jsonData[(currentWeekNumber() + data['from'])], currentWeekNumber() + data['to']);
      }
    });
  });
  socket.on('getParts', (data) => {
    jsonfile.readFile(partsfile, function (err, jsonData) {
      if (err) {
        return console.log(err);
      }
      io.emit('loadParts', jsonData);
    });
  });
  socket.on('saveParts', (data) => {
    OverwriteJson(partsfile, data);
  });

  socket.on('getUsers', (data) => {
    jsonfile.readFile(usersfile, function (err, jsonData) {
      if (err) {
        return console.log(err);
      }
      io.emit('loadUsers', jsonData);
    });
  });
  socket.on('saveUsers', (data) => {
    OverwriteJson(usersfile, data);
  });
  socket.on('getView', (num) => {
    jsonfile.readFile(datafile, function (err, jsonData) {
      if (err) {
        return console.log(err);
      }
      if (jsonData[(currentWeekNumber() + num).toString()]) {
        io.emit('ShowView', jsonData[currentWeekNumber() + num]);
      } else {
        io.emit('ShowView', templateWeek);
      }
    });
  });
});
http.listen(3003, function () {
  console.log('app running on port 3003');
});

function OverwriteJson(filename, data) {
  jsonfile.writeFile(filename, data, function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

function writeJson(newdata, toChange) {
  var oldData
  jsonfile.readFile(datafile, function (err, jsonData) {
    if (err) {
      return console.log(err);
    }
    oldData = jsonData;
    oldData[toChange] = newdata[toChange];
    jsonfile.writeFile(datafile, oldData, function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });

}

function TransferDataJson(newdata, toReplace) {
  var oldData
  jsonfile.readFile(datafile, function (err, jsonData) {
    if (err) {
      return console.log(err);
    }
    oldData = jsonData;
    oldData[toReplace] = newdata;
    jsonfile.writeFile(datafile, oldData, function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });

}
