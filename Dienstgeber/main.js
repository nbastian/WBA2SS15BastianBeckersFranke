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

// functions
global.sha1sum = function(input) {
    // function for creating sha1-hash
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex');
}

// 
global.parseJsonList = function(jsonString) {
    try {
        jsonObj = JSON.parse(jsonString);
    } catch (e) {
        jsonObj = [];
    }
    
    return jsonObj;
}

// 
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
global.userlistObj = 'userlist';
global.eventObj = 'events';
global.rosterObj = 'roster';

global.tokenSecret = 'v;]LDoBv6^$!DSLdtQ&BNae>F)8MnifI{VO%7*GMp{eh/Pfc2eY^Tn_uP8}?op6*';

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

// Objekte erstellen und Demodaten in DB legen
app.route('/initdemo').get(function(req, res) {
    // User
    redis.set(userlistObj, JSON.stringify([
        {
            id: 1,
            isCompany: false,
            username: 'Franky',
            email: 'fh@franky.ws',
            password: sha1sum('test123'),
            experiences: [
                { experience: 'zapfen', level: 2 },
                { experience: 'worker', level: 4 },
                { experience: 'aufbau', level: 5 },
                { experience: 'abbau', level: 8 }
            ]
        },
        {
            id: 2,
            isCompany: false,
            username: 'Steve',
            email: 'info@franky.ws',
            password: sha1sum('test123'),
            experiences: [
                { experience: 'bonstelle', level: 2 },
                { experience: 'worker', level: 5 }
            ]
        },
        {
            id: 3,
            isCompany: true,
            username: 'PollerWiesen GmbH',
            email: 'franky@pollwiesen.org',
            password: sha1sum('test123'),
            experiences: null
        },
        {
            id: 4,
            isCompany: false,
            username: 'Nico',
            email: 'n.bastian@outlook.com',
            password: sha1sum('test123'),
            experiences: [
                { experience: 'kasse', level: 5 },
                { experience: 'kassenleitung', level: 5 }
            ]
        }
    ]));
    
    // Veranstaltungen
    redis.set(eventObj, JSON.stringify([
        {
            id: 1,
            userId: 3,
            name: 'PollerWiesen Minus',
            dateStart: moment('2015-08-15 13:00').format('X'),
            dateEnd: moment('2015-08-15 18:00').format('X')
        },
        {
            id: 2,
            userId: 3,
            name: 'PollerWiesen Dortmund',
            dateStart: moment('2015-09-15 13:00').format('X'),
            dateEnd: moment('2015-09-15 18:00').format('X')
        }
    ]));
    
    // Dienstpläne
    redis.set(rosterObj, JSON.stringify([
	    {
	        id: 1,
	        userId: 1,
	        eventId: 1,
	        dateStart: moment('2015-08-15 13:00').format('X'),
	        dateEnd: moment('2015-08-15 14:00').format('X'),
	        position: 'kasse'
	    },
	    {
	        id: 2,
	        userId: 2,
	        eventId: 1,
	        dateStart: moment('2015-08-15 14:00').format('X'),
	        dateEnd: moment('2015-08-15 16:00').format('X'),
	        position: 'kasse'
	    },
	    {
	        id: 3,
	        userId: 3,
	        eventId: 1,
	        dateStart: moment('2015-08-15 13:00').format('X'),
	        dateEnd: moment('2015-08-15 18:00').format('X'),
	        position: 'kassenleitung'
	    },
	    {
            id: 1,
            userId: 1,
	        eventId: 2,
            dateStart: moment('2015-09-15 13:00').format('X'),
            dateEnd: moment('2015-09-15 15:00').format('X'),
            position: 'worker'
        },
        {
            id: 2,
            userId: 2,
	        eventId: 2,
            dateStart: moment('2015-09-15 15:00').format('X'),
            dateEnd: moment('2015-09-15 16:00').format('X'),
            position: 'worker'
        }
	]));
    
    res.json({
        success: true,
        msg: 'Demodata filled successful.'
    });
});

var module_user = require('./user.js');
module_user.init(app);

var module_event = require('./events.js');
module_event.init(app);

var module_roster = require('./roster.js');
module_roster.init(app);

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