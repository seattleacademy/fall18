var http = require('http');
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();


port = 1776;
var sensors = {};
counter = 0;
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port);
console.log('listening on port', port)

sensors.name = "Gary's weather station"

function updateSensors() {
	var db = new sqlite3.Database('/var/lib/weewx/weewx.sdb');
    db.serialize(function() {
        db.each("SELECT dateTime AS id, barometer FROM archive ORDER BY barometer DESC LIMIT 1", function(err, row) {
            var d = new Date(row.id * 1000);
            var n = d.toISOString();
            console.log(n + ": " + row.barometer);
            sensors.barometer = row.barometer;
            sensors.dateTime = n;
        });
    });
    db.close();
}
updateSensors();
app.all('/all', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    sensors.counter = counter;
    counter = counter + 1;
    sensors.temperature = 76 + Math.random() * 5;
    sensors.temperature = sensors.temperature.toFixed(2);
    updateSensors();
    res.send(JSON.stringify(sensors));
});
