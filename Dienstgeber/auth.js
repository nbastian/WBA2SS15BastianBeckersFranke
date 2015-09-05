module.exports = {
    init: function(app) {
        // endpoint for getting and setting user
       app.all('*', function(req, res, next) {
        
	        // exceptions
	        if (req.path == '/authenticate' || (req.path == '/events' && req.method == 'get')) {
		        return next();
	        }
	        
	        var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'] || false;
	        
	        verifyToken(token, {
		        callbackSuccess: function() {
			        // token valid
			        
			        next();
		        },
		        callbackError: function() {
			        res.status(403).json({
				        success: false,
				        message: 'Private resource requested and token not valid.'
			        });
		        }
	        });
        });
        
        app.route('/authenticate')
			.post(function(req, res) {
	            redis.get(userlistObj, function (err, obj) {
	                var userList = JSON.parse(obj);
	                
	                for (var i in userList) {
		                if (userList[i].username == req.body.username) {
	                        if (userList[i].password != sha1sum(req.body.password)) {
	                            return res.status(403).json({ success: false, message: 'Authentication failed. Wrong password.'});
	                        } else {
	                            var token = jwt.sign(userList[i].id, tokenSecret, {
	                                expiresInMinutes: 1440 //24 Stunden
	                            });
	                
	                            return res.json({
	                                success: true,
	                                message: 'Enjoy your token!',
	                                token: token,
	                                user: userList[i]
	                            });
	                        }
	                    }
	                }
	                
	                return res.json({ success: false, message: 'Authentication failed. User not found.' });
	            });
			});
   }
}  