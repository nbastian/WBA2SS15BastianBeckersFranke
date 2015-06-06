/**
 * 	PerPla Personalplanung
 *  restful-endpoints orientiert an der facebook graph api
 * 
 *  (c) 2015 by christian franke, franky.ws
 */

// include express module
var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis').createClient();
var crypto = require('crypto'), 
	shasum = crypto.createHash('sha1');
	
// functions
var sha1sum = function(input) {
	// function for creating sha1-hash
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex');
}

// init em up
var app = express();

// set bodyparser as default
app.use(bodyParser.json({ extended: true }));

// environments
app.set('port', process.env.PORT || 1337);
var userlistObj = 'userlist';

// redis error handling
redis.on('error', function (err) {
	console.log(err);
});

// static assets (html-files)
app.use(express.static('public'));




/**
 *  ENDPOINTS
 */


// todo: authentication

// endpoint for getting and setting user
app.route('/user')
	
	.get(function(req, res) {
		// get userlist from db
		
		redis.get(userlistObj, function (err, obj) {
		    res.json(JSON.parse(obj));
		});
	})
	
	
	.post(function(req, res) {
		// save new user in db
		
		redis.get(userlistObj, function (err, obj) {
			// get old list
		    var userList = JSON.parse(obj)
		    	newId = userList.length;
		    
		    
		    // todo: check for valid inputs
		    
		    
		    // push new user
		    userList.push({
			    id: newId,
			    username: req.params.id,
			    email: req.params.email,
			    password: sha1sum(req.params.password), // never save password plaintext! todo: salt!
			    isAdmin: 0 // todo: isAdmin
		    });
		    
		    // save list
		    redis.set(userlistObj, JSON.stringify(userList));
		    
		    // output
		    res.json({ 
			    success: true,
			    newId: newId 
			});
		});
	});


// endpoint for existing user
// only with numberic user-id!
app.route('/user/:id([0-9]+)')

	.get(function(req, res) {
    	// return single user
    			
		redis.get(userlistObj, function (err, obj) {
		    var userList = JSON.parse(obj);
		    
		    for (var i in userList) {
			    if (userList[i] == req.params.id) {
				    res.json(userList[i]);
				    break;
			    }
		    }
		});
	})
	
	
	.put(function(req, res) {
    	// update single user
    			
		redis.get(userlistObj, function (err, obj) {
		    var userList = JSON.parse(obj);
		    
		    for (var i in userList) {
			    if (userList[i] == req.params.id) {
				    
				    // todo: check for valid inputs
		    	    		    	    
				    userList[i] = {
					    id: newId,
					    username: req.params.id,
					    email: req.params.email,
					    password: sha1sum(req.params.password), // never save password plaintext! todo: salt!
					    isAdmin: 0 // todo: isAdmin
				    };
				    
				    break;
			    }
		    }
		    				    
		    // save list
		    redis.set(userlistObj, JSON.stringify(userList));
		    
		    // output
		    res.json({ 
			    success: true
			});
		});
	})
	
	.delete(function(req, res) {
    	// delete single user
    			
		redis.get(userlistObj, function (err, obj) {
		    var userList = JSON.parse(obj);
		    
		    // filter userlist..
		    userList = userList.filter(function(el) {
			    return el.id !== req.params.id
		    });
		    				    
		    // save list
		    redis.set(userlistObj, JSON.stringify(userList));
		    
		    // output
		    res.json({ 
			    success: true
			});
		});
	});



/**
 *  START IT UP..
 */

// Start server listening..
var server = app.listen(app.get('port'), function () {
	var port = server.address().port;
	
	console.log('Please point your browser to http://localhost:%s', port);
});