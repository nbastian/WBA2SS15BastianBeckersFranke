module.exports = {
    init: function(app) {
        app.post('/user/authenticate', function(req, res) {
            redis.get(userlistObj, function (err, obj) {
	            console.log(req.body);
	            
                var userList = JSON.parse(obj);
                for (var i in userList) {
                    if (userList[i].username == req.body.username) {
                        if (userList[i].password != sha1sum(req.body.password)) {
                            return res.json({ success: false, message: 'Authentication failed. Wrong password.'});
                        } else {
                            var token = jwt.sign(userList[i], tokenSecret, {
                                expiresInMinutes: 1440 //24 Stunden
                            });
                
                            return res.json({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token
                            });
                        }
                    }
                }
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            });
        });
		console.log('module authenticate loaded successful');
    }
}