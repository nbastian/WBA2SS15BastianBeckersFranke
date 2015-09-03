module.exports = {
    init: function(app) {
        // endpoint for getting and setting organisation
        app.route('/companys')
            
            .get(function(req, res) {
                // get userlist from db
                var token = req.body.token || req.query.token || req.headers['x-access-token'];

                  // decode token
                  if (token) {

                    // verifies secret and checks exp
                    jwt.verify(token, 'secret' /*app.get('superSecret')*/, function(err, decoded) {      
                      if (err) {
                        
                        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });    
                      } else {
                        //Gibt den User des Tokens! nützlich für die eingelogt als Anzeige
                        console.log(decoded);
                        redis.get(companyObj, function (err, obj) {
                            var organizerList = parseJsonList(obj);

                            return res.status(200).json(organizerList);
                        });
                      }
                    });

                  } else {

                    // if there is no token
                    // return an error
                    return res.status(401).send({ 
                        success: false, 
                        message: 'No token provided.' 
                    });

                  }
                
            })
            
            
            .post(function(req, res) {
                //  save new user in db  
                
                redis.get(companyObj, function (err, obj) {
                    // get old list
                    var organizerList = JSON.parse(obj)
                    var lastId = 0;
                    
                    for (var i in organizerList) {
                        if (organizerList[i].id > lastId) {
                            lastId = parseInt(organizerList[i].id);
                        }
                    }
                    var newId = lastId + 1;
                    
                    // todo: check for valid inputs
                    
                    
                    var newOrganisation = {
                        id: newId,
                        name: req.body.name,
                        user: req.body.userIdList,
                        events: req.body.eventIdList,
                        admins: req.body.admins
                    };
                    
                    // push new user
                    organizerList.push(newOrganisation);
                    
                    // save list
                    redis.set(companyObj, JSON.stringify(organizerList));
                    
                    // output
                    res.status(201).json(newOrganisation);
                });
            });
        
        

        // endpoint for existing organisations
        // only with numberic organisation-id!

        app.route('/companys/:id([0-9]+)')

            .get(function(req, res) {
                // return single user
                        
                redis.get(companyObj, function (err, obj) {
                    var organizerList = parseJsonList(obj),
                        organisation = organizerList.filter(function(el) {
                            return el.id == req.params.id
                        });
                    
                    res.status(200).json(organisation[0] || []);
                });
            })
            
            
            .put(function(req, res) {
                // update single user
                        
                redis.get(companyObj, function (err, obj) {
                    var organizerList = JSON.parse(obj);
                    
                    for (var i in organizerList) {
                        if (organizerList[i].id == req.params.id) {
                            
                            // todo: check for valid inputs
                                                
                            if (req.body.name) organizerList[i].name = req.body.name;
                            if (req.body.userIdList) organizerList[i].user = req.body.userIdList;
                            if (req.body.eventIdList) organizerList[i].events = req.body.eventIdList;
                            if (req.body.admins) organizerList[i].admins = req.body.admins;
                            
                            var newOrganisation = organizerList[i];
                            
                            break;
                        }
                    }
                                        
                    // save list
                    redis.set(companyObj, JSON.stringify(organizerList));
                    
                    // output
                    res.status(200).json(newOrganisation);
                });
            })
            
            .delete(function(req, res) {
                // delete single user
                        
                redis.get(companyObj, function (err, obj) {
                    var organizerList = JSON.parse(obj);
                    
                    // filter userlist..
                    organizerList = organizerList.filter(function(el) {
                        return el.id != req.params.id
                    });
                                        
                    // save list
                    redis.set(companyObj, JSON.stringify(organizerList));
                    
                    // output
                    res.status(204).json({ 
                        success: true
                    });
                });
            });
            
        console.log('module company loaded successful');
    }
}