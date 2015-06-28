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
    
// functions
global.sha1sum = function(input) {
    // function for creating sha1-hash
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex');
}

global.parseJsonList = function(jsonString) {
    try {
        jsonObj = JSON.parse(jsonString);
    } catch (e) {
        jsonObj = [];
    }
    
    return jsonObj;
}

// init em up
global.app = express();

// set bodyparser as default
app.use(bodyParser.json({ extended: true }));

// environments
app.set('port', process.env.PORT || 1337);
global.userlistObj = 'userlist';
global.adminlistObj = 'adminlist';
global.companyObj = 'companys';
global.eventObj = 'events';

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
            username: 'Testuser1',
            email: 'fh@franky.ws',
            password: '7288edd0fc3ffcbe93a0cf06e3568e28521687bc', // test123
            experience: [
	            'zapfen',
	            'worker',
	            'aufbau',
	            'abbau'
            ]
        },
        {
            id: 2,
            username: 'Testuser2',
            email: 'info@franky.ws',
            password: '7288edd0fc3ffcbe93a0cf06e3568e28521687bc', // test123
            experience: [
	            'kasse',
	            'kassenleitung',
	            'bonstelle'
            ]
        }
    ]));
    
    // Veranstaltungen
    redis.set(eventObj, JSON.stringify([
        {
            id: 1,
            name: 'PollerWiesen',
            dateStart: moment('2015-08-15 13:00').format('X'),
            dateEnd: moment('2015-08-15 18:00').format('X')
        }
    ]));
    
    // Firmen
    redis.set(companyObj, JSON.stringify([
        {
            id: 1,
            name: 'PollerWiesen GmbH',
            user: [1, 2],
            events: [1],
            admins: [
		        {
		            id: 1,
		            username: 'Franky',
		            email: 'franky@pollerwiesen.org',
		            password: '7288edd0fc3ffcbe93a0cf06e3568e28521687bc' // test123
		        }
		    ]
        }
    ]));
    
    res.json({
        success: true,
        msg: 'Demodata filled successful.'
    });
});

var module_user = require('./user.js');
module_user.init(app);

var module_company = require('./companys.js');
module_company.init(app);

var module_event = require('./events.js');
module_event.init(app);



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