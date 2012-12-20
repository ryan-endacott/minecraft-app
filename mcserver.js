// Separate file to handle all minecraft server stuff

var process = require('child_process'),
	config = require('./config'),
	mcServer = null;


// Starts the server
exports.start = function() {

	// Start the server if it isn't already
	if (!mcServer) {

		// Starts the server as specified on minecraft.net
		mcServer = process.spawn(
			"java",
			['-Xms1024M', '-Xmx1024M', '-jar', 'minecraft_server.jar', 'nogui'],
			// Cwd is the working directory of execution
			{ cwd: config.mcDirectory }
		);

		// Reassign to null on exit
		mcServer.on('exit', function() {
			mcServer = null;
		});
	}
};


// Stop the server
exports.stop = function() {
	if (mcServer) {
		mcServer.stdin.write('stop\n');

		// I've decided to go ahead and set it to null here, although
		// the process hasn't officially ended yet.  It makes it much simpler for client.
		mcServer = null; 
	}
};


/* Not sure if I want to use this.  Maybe later functionality only for me
exports.command = function(cmd) {
	if (mcServer) {
		console.stdin.write(cmd + '\n');
	}
}
*/


// Returns textual status of server
exports.status = function() {
	return mcServer ? 'running' : 'off';
};

// Returns boolean status of server (true if running)
exports.running = function() {
	return mcServer ? true : false;
};