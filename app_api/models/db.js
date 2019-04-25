var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://blogs:blogs@localhost/blogs';
mongoose.connect(dbURI);

// Monitor and report when ataase is connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

// Monitor and report error connecting to database
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

// Monitor and report when database is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
// Closes (disconnects) from Mongoose DB upon shutdown    
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
	console.log('Mongoose disconnected through ' + msg);
	callback();
    });
};

// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
	process.kill(process.pid, 'SIGUSR2');
    }); });

// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function () {
	process.exit(0);
    }); });

// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
	process.exit(0);
    }); });

require('./blog');
require('./users');
