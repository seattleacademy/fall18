var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/var/lib/weewx/weewx.sdb');
var check;
db.serialize(function() {

  db.each("SELECT dateTime AS id, barometer FROM archive ORDER BY barometer DESC LIMIT 1", function(err, row) {
	var d = new Date(row.id * 1000);
	var n = d.toISOString();
      console.log(n + ": " + row.barometer);
  });
});

db.close();
