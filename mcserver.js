// Separate file to handle all minecraft server stuff

var process = require('child_process'),
	config = require('./config'),
	mcServer = null,
	gettingNumPlayers = false,
	oldNumPlayers = 0,
	curNumPlayers = 0,
	CHECKFREQ = 5 * 60 * 1000, // How often to check if players are online
	intervalID; // ID of playercheck interval


// Starts the server
exports.start = function() {

	// Start the server if it isn't already
	if (!mcServer) {

		console.log("Starting Minecraft Server...");

		// Starts the server as specified on minecraft.net
		mcServer = process.spawn(
			"java",
			['-Xms1024M', '-Xmx1024M', '-jar', 'minecraft_server.jar', 'nogui'],
			// Cwd is the working directory of execution
			{ cwd: config.mcDirectory }
		);


		mcServer.stderr.on('data', function (data) {

			// Grab the output if in process of getting number of players 
			// As set in getNumPlayers()
			if (gettingNumPlayers) {

				// Convert to string
				var strData = '' + data;

				// To track if no players have been on for CHECKFREQ amount of time
				oldNumPlayers = curNumPlayers;

				// Grab the input, because it comes in a format like so:
				// 2012-12-20 18:07:04 [INFO] There are 0/20 players online:
				// So the 7th number has the info.
				curNumPlayers = parseInt(strData.match(/[0-9]+/g)[6], 10);

				// Make number of players available to other modules
				exports.numPlayers = curNumPlayers;

				gettingNumPlayers = false;
			}

		});

		// Reassign to null on exit
		mcServer.on('exit', function() {
			mcServer = null;
		});

		// Start check every CHECKFREQ
		intervalID = setInterval(checkPlayers, CHECKFREQ);
	}
};


// Stop the server
exports.stop = function() {
	if (mcServer) {

		console.log('Shutting down Minecraft Server...');

		// Stop checking players
		clearInterval(intervalID);

		mcServer.stdin.write('stop\n');

		// I've decided to go ahead and set it to null here, although
		// the process hasn't officially ended yet.  It makes it much simpler for client.
		mcServer = null; 
	}
};


// Sends a command to the minecraft server
exports.command = function(cmd) {
	if (mcServer) {
		mcServer.stdin.write(cmd + '\n');
	}
}


// Returns textual status of server
exports.status = function() {
	return mcServer ? 'running' : 'off';
};

// Returns boolean status of server (true if running)
exports.running = function() {
	return mcServer ? true : false;
};


// Returns number of players on server
exports.numPlayers = curNumPlayers;

// Function to update the variable curNumPlayers
// It uses the stderr stream of mcserver set up above.
var getNumPlayers = function() {
	gettingNumPlayers = true;
	exports.command('list');
};


// Function to call getNumPlayers and
// Then shuts down server if nobody has been playing for CHECKFREQ
var checkPlayers = function() {

	// Update current number of players
	getNumPlayers();

	// Give it time to find the number
	setTimeout(function() {

		// Display current players
		console.log("There are currently " + curNumPlayers + " players on the server.");

		// If current # players and old # players are both 0, stop server
		if (!curNumPlayers && !oldNumPlayers) {
			console.log("Server error or no players detected...");
			exports.stop();
		}

	}, 1000);

}