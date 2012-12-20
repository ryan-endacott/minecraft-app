
// Routes


var mcserver = require('../mcserver'),
	config = require('../config');


exports.login = function(req, res){

	// Redirect to admin if logged in.
	if (req.user)
		res.redirect('/admin');

	res.render('login', {title: config.appName});
};

exports.start = function(req, res){
	if (req) {
		mcserver.start();
		res.redirect('/admin');
	}
	else
		res.redirect('/');
};

exports.stop = function(req, res) {
	if (req) {
		mcserver.stop();
		res.redirect('/admin');
	}
	else
		res.redirect('/');

};

exports.admin = function(req, res){
	res.render('admin', {
		title: config.appName,
		status: mcserver.status, 
		running: mcserver.running
	});
};

