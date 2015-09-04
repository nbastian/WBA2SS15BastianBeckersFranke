module.exports = {
    init: function(app) {
        // endpoint for getting and setting user
        app.route('/user')
            
            .get(function(req, res) {
                // get userlist from db
                
                redis.get(userlistObj, function (err, obj) {
                    userObj = parseJsonList(obj);
                    
                    var userList = JSON.parse(obj);
                    
                    res.status(200).json(userList);
                });
            })
            
              
            .post(function(req, res) {
                // save new user in db
                
                redis.get(userlistObj, function (err, obj) { 
                    // get old list
                    var userList = JSON.parse(obj)
                    var lastId = 0;
                    
                    for (var i in userList) {
                        if (userList[i].id > lastId) {
                            // get last id + 1
                            lastId = parseInt(userList[i].id);
                        }
                    }
                    
                    var newId = lastId + 1;
                    
                    // todo: check for valid inputs
                    
                    var newUser = {
                        id: newId,
                        isCompany: !!req.body.isCompany,
                        companyId: parseInt(req.body.companyId),
                        username: req.body.username,
                        email: req.body.email,
                        password: sha1sum(req.body.password), // never save password plaintext! todo: salt!
                        experience: req.body.experience
                    };
                    
                    // push new user
                    userList.push(newUser);
                    
                    // save list
                    redis.set(userlistObj, JSON.stringify(userList));
                    
                    // output
                    res.status(201).json(newUser);
                });
            });
        
        
        // endpoint for existing user
        // only with numberic user-id!
        app.route('/user/:id([0-9]+)')
        
            .get(function(req, res) {
                // return single user
                        
                redis.get(userlistObj, function (err, obj) {
                    var userList = parseJsonList(obj),
                        user = userList.filter(function(el) {
                            return el.id == req.params.id
                        });
                    
                    res.status(200).json(user[0] || []);
                });
            })
            
            
            .put(function(req, res) {
                // update single user
                        
                redis.get(userlistObj, function (err, obj) {
                    var userList = JSON.parse(obj);
                    
                    for (var i in userList) {
                        if (userList[i].id == req.params.id) {
                            
                            // todo: check for valid inputs
                                                
                            userList[i].isCompany = !!req.body.isCompany;
                            userList[i].companyId = parseInt(req.body.companyId);
                            userList[i].username = req.body.username;
                            userList[i].email = req.body.email;
                            if (req.body.password) userList[i].password = sha1sum(req.body.password);
                            
                            var newUser = userList[i];
                            
                            break;
                        }
                    }
                                        
                    // save list
                    redis.set(userlistObj, JSON.stringify(userList));
                    
                    // output
                    res.status(200).json(newUser);
                });
            })
            
            .delete(function(req, res) {
                // delete single user
                        
                redis.get(userlistObj, function (err, obj) {
                    var userList = JSON.parse(obj);
                    
                    // filter userlist..
                    userList = userList.filter(function(el) {
                        return el.id != req.params.id
                    });
                                        
                    // save list
                    redis.set(userlistObj, JSON.stringify(userList));
                    
                    // output
                    res.status(204).json({ 
                        success: true
                    });
                });
            });
		
        app.post('/authenticate', function(req, res) {
            redis.get(userlistObj, function (err, obj) {
	            var userList = JSON.parse(obj);
                for (var i in userList) {
                    if (userList[i].username == req.body.username) {
                        if (userList[i].password != sha1sum(req.body.password)) {
                            return res.json({ success: false, message: 'Authentication failed. Wrong password.'});
                        } else {
                    
                            var token = jwt.sign(userList[i], tokenSecret, {
                                expiresInMinutes: 60 * 24
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
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            });
        });
        
		console.log('module user loaded successful');
    }
}