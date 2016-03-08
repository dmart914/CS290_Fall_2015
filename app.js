// CS290 - Fall 2015
// Student: 	Dave Martinez
// Email: 		martind2@oregonstate.edu
// Assignment:  Database interactions and UI

// LIVE SITE: http://52.89.145.141:3020/

/* Requirements:
	+ Database:
		+ name - name of the exercise
		+ reps - number of times exercise was performed
		+ weight - the weight of the weights used
		+ date - the date the exercise was performed
		+ lbs - a boolean indiciating if measurement was in lbs or kg (1=lbs, 0=kgs)
	+ Single page web app
	+ Shows table of all completed exercises
		+ Don't show ids
		+ header should show all columns
		+ use hidden input to track id
	+ Form at top of page
		+ lets you enter in all data needed to make a new entry with submit button
		+ Button should add the row to the table if successfully added to db
		+ If not successful, app should not add to table
	+ Each row in table should have two buttons
		+ Delete - delete the row immediately from table and remove from db
		+ Edit - Edit data. Ok to go to another page 
	+ All interactions should happen via AJAX. 
	+ Include, as a comment, a URL to the active site

 */

// Requriements
var mysql = require('mysql');
var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');
var bodyParser = require('body-parser');


// Setup
var app = express();

app.use(express.static(__dirname + '/static'));

var pool = mysql.createPool({
	host 	: 'localhost',
	user 	: 'cs290user',
	password: 'cs290userPassword',
	database: 'cs290'
})

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Routes
// Main page
app.get('/', function(req, res) {
	context = {};
	pool.query('SELECT * FROM workouts ORDER BY date DESC', function (err, rows, fields) {
		if (err) {	
			next(err);
			return;
		}
		context.results = rows;

        context.results.forEach(function(x) {
            if (x.lbs == 1) {
                x.lbs = 'Pounds';
            } else {
                x.lbs = 'Kilograms';
            }
        })

		res.render('index', context);
	})

});

app.post('/new-workout', function(req, res) {
	var data = req.body;

    var q = "INSERT INTO workouts " + 
    "(name, reps, weight, date, lbs) VALUES " +
    "('" + data.name + "'," + data.reps + "," +
    data.weight + ",'" + data.date + "'," +
    data.pounds + ")";

    pool.query(q, function(err, result) {
        if (err) { res.status(500).send('ERROR'); return; }

        if (result.affectedRows != 1) {
            res.status(500).send('ERROR'); return;
        }

        // Get the resulting row back
        var q_result = "SELECT * FROM workouts WHERE id=" + result.insertId;
        pool.query(q_result, function(err, rows, fields) {
            if (err) { res.status(500).send('ERROR'); return; }

            // SUCCESS
  			// Provide rows back as response
            res.send(rows)
        });
    });

});

app.post('/workout-edit', function(req, res, next) {
    if (!req.query.id) { console.log('ERROR 1'); res.send("ERROR 1"); return; }

    var workout_id = req.query.id;
    var data = req.body;

    var q = "UPDATE workouts SET " +
    "name='" + data.name + "'," + "reps=" + data.reps + "," +
    "weight=" + data.weight + "," + "date='" + data.date + "'," +
    "lbs=" + data.pounds + " WHERE id=" + workout_id;

    pool.query(q, function(err, rows, fields) {
        if (err) { console.log(err); res.status(500).send('ERROR 2'); return; }

        var q_result = "SELECT * FROM workouts WHERE id=" + workout_id;
        pool.query(q_result, function(err, rows, fields) {
            if (err) { console.log(err); res.status(500).send('ERROR 3'); return; }

            // SUCCESS
            res.send(rows);
        })
    })
});

app.delete('/workout-delete', function(req, res, next) {
    
    var workout_id = req.query.id;
    
    var q = "DELETE FROM workouts WHERE id=" + workout_id;

    pool.query(q, function(err, rows, fields) {
        if (err) { console.log(err); res.status(500).send('ERROR')}
        if (rows.affectedRows == 1) {
            res.send("SUCCESS");
        } else {
            res.send("ERROR");
        }
    })
});

// Table reset
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('index',context);
    })
  });
});

// 404
app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});


// Server
var server = app.listen(3020, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App running at http://%s:%s', host, port);
})
