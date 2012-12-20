// App.js!


var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    config = require('./config');


// Authentification with passport-local
passport.use(new LocalStrategy(
    {passReqToCallback: true}, 
    function(req, user, password, done) {

        // Check username and password from config
        if (config.users.indexOf(user.toLowerCase()) > -1 
            && password == config.password) {

            req.session.messages.push({
                text: "Hello " + user + "!!  You've logged into Ryan's Minecraft server manager!",
                type: 'success'
            });
            return done(null, user);
        }
        else {
            req.session.messages.push({
                text: "Incorrect username or password.  Please try again.",
                type: 'error'
            });
            return done(null, false);
        }
    })
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Middleware to ensure the user is logged in
function ensureAuth(req, res, next) {
    if (req.user) {
        next();
    }
    else {
        req.session.messages.push({
            text: "You must be logged in to do that.",
            type: 'error'
        });
        res.redirect('/');
    }
}


var app = express();

app.configure(function(){
    app.set('port', config.port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'hbs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(passport.initialize());
    app.use(passport.session());
    // SSCMM:  Super simple client messaging middleware
    app.use(function (req, res, next) {
        res.locals.user = req.user
        res.locals.messages = req.session.messages;
        req.session.messages=[];
        next();
    })

    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.login);
app.get('/admin', ensureAuth, routes.admin);
app.get('/start', ensureAuth, routes.start);
app.get('/stop', ensureAuth, routes.stop);
app.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/'
    })
);
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
