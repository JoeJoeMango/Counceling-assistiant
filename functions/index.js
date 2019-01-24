var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
const csv = require('csvtojson');
// var capitalize = require('lodash.capitalize');
// const asyncHandler = require('./middlewares/async-handler');
const dialogflow = require('./middlewares/dialogflow');

(async() => {


	const rows = await csv().fromFile(
		path.join(__dirname, 'data', 'phrases.csv')
	);

	const phrases = {};

	for(const [, {subject, key, value, onemore}] of Object.entries(rows)) {
		if(!phrases[subject])
			phrases[subject] = {};

		phrases[subject][key] = value;
	}
	console.log(phrases);

	dialogflow.phrases = phrases;

	app.use(bodyParser.json());
	app.use(dialogflow);

	app.use((err, req, res, next) => {
		console.log('err', err.message);
		res
			.status(500)
			.end('Error');
	});

	var port = 3000;
	app.listen(port, () => {
		console.log("listening on port:  " + port);
	});

})();
