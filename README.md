# Minecraft Server App

This is a small app I created to solve a simple problem.  A few of my friends like to play on a Minecraft server that runs on my desktop.  Previously, when they wanted to play, I would have to log into a remote desktop client and start it up.  

Instead of continuing that tedious process, I figured it would be a fun project to make a site to handle it instead.  Now, any of them can go to this site and turn the server on and off.  I also plan on making it turn off the server when it detects there are no players.

On the off chance that anyone is in a similar situation and would like to use this, you will need a config.js that looks something like this:


```javascript

// Config file

var config = {};

config.appName = 'Minecraft Server App'

config.port = 2012;

config.users = ['friend1', 'friend2', 'friend3']; 
config.password = 'megasecretpasscode'; // Universal password to tell your friends

config.mcDirectory = 'C:\\Users\\owner\\Documents'; // Directory of minecraft_server.jar

module.exports = config;

```

Then just run the site (I use [Forever](https://github.com/nodejitsu/forever) so the service never goes down) and point your friends to http://YourIP:Port.  Happy crafting!

