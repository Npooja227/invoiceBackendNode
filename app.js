//Requiring necessary npm middleware packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');

//Setting up port
var PORT = process.env.PORT || 8080;

//Import the models folder
var db = require('./models');

//Import Mysql Configuration
var connection = require('./config');

//Creating express app and configuring middleware 
const app = express();

//Used for http requests logs
app.use(morgan('dev'));

//Used for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}));

//Used for parsing application/json
app.use(bodyParser.json());

//needed to read through our public folder
app.use(express.static("public"));

app.use(passport.initialize());

app.use(passport.session());

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

// used to serialize the user for the session
passport.serializeUser(function (user, done){
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function (id, done){
    // connection.query("select * from users where id = "+id,function(err,rows){	
    //     done(err, rows[0]);
    // });
    done(null, user);
});

//Routes
app.use('/', cors(), require('./routes/user'));

//Start the Server
db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log(`Listening to port ${PORT}`);
    })
});