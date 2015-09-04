/**
 *  PerPla Personalplanung
 *  restful-endpoints orientiert an der facebook graph api
 * 
 *  (c) 2015 by christian franke, franky.ws
 */

// include express module
global.express = require('express');
global.bodyParser = require('body-parser');
global.redis = require('redis').createClient();
global.crypto = require('crypto');
global.shasum = crypto.createHash('sha1');
global.moment = require('moment');
global.jwt = require('jsonwebtoken');


/**
 *  CONFIG
 */

// json-object names
global.userlistObj = 'userlist';
global.eventObj = 'events';
global.rosterObj = 'roster';

// secret token salt
global.tokenSecret = 'v;]LDoBv6^$!DSLdtQ&BNae>F)8MnifI{VO%7*GMp{eh/Pfc2eY^Tn_uP8}?op6*';




/**
 *  FUNCTIONS
 */
 
// sha1 oneway-hash
global.sha1sum = function(input) {
    // function for creating sha1-hash
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex');
}

// parse json fix
global.parseJsonList = function(jsonString) {
    try {
        jsonObj = JSON.parse(jsonString);
    } catch (e) {
        jsonObj = [];
    }
    
    return jsonObj;
}

// is token valid?
global.verifyToken = function(req, callback){
    var token = req.query.token;
    
    // decode token
    if (!token && typeof callback == 'function') callback(false);
    
    // verifies secret and checks exp
    jwt.verify(token, tokenSecret, function(err, decoded) {      
        if (typeof callback == 'function') callback(!err);
    });
}




// init em up
global.app = express();

// set bodyparser as default
app.use(bodyParser.json({ extended: true }));

// environments
app.set('port', process.env.PORT || 1337);

// redis error handling
redis.on('error', function (err) {
    console.log(err);
    process.exit(1);  
});

// static assets (html-files)
app.use(express.static('public'));




/**
 *  ENDPOINTS
 */

// demodata filler endpoint
var module_fill = require('./fill.js');
module_fill.init(app);


// live endpoints
var module_user = require('./user.js');
module_user.init(app);

var module_event = require('./events.js');
module_event.init(app);

var module_roster = require('./roster.js');
module_roster.init(app);


// authenticate endpoint
var module_authenticate = require('./authenticate.js');
module_authenticate.init(app);




/** 
 *  START IT UP..
 */

// Start server listening..
var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    
    console.log('+++++++++++++++++++++++++++++++++++++++++');
    console.log('+ PerPla Personalplanung                +');
    console.log('+++++++++++++++++++++++++++++++++++++++++');
    console.log('');
    console.log('Please point your browser to http://localhost:%s', port);
});