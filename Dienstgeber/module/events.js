module.exports = {
    init: function(app) {
        // endpoint for getting and setting events
        app.route('/event')
            
            .get(function(req, res) {
                // get eventlist from db
                redis.get(eventObj, function (err, obj) {
                    var eventList = parseJsonList(obj);
                    
                    res.json(eventList).status('200');
                });
            })
            
            
            .post(function(req, res) {
                // save new event in db
                
                redis.get(eventObj, function (err, obj) {
                    // get old list
                    var eventList = JSON.parse(obj)
                        lastId = 0;
                        
                    for (var i in eventList) {
                        if (eventList[i].id > lastId) {
                            lastId = parseInt(eventList[i].id);
                        }
                    }
                    
                    var newId = lastId + 1;
                    
                    // todo: check for valid inputs
                    
                    
                    var newEvent = {
                        id: newId,
                        name: req.body.name,
                        userId: req.body.id,
                        dateStart: moment(req.body.dateStart).format('X'),
                        dateEnd: moment(req.body.dateEnd).format('X')
                    };
                    
                    
                    // push new event
                    eventList.push(newEvent);
                    
                    // save list
                    redis.set(eventObj, JSON.stringify(eventList));
                    
                    // output
                    res.status(201).json(newEvent);
                });
            });
        
        
        // endpoint for existing organisations
        // only with numberic organisation-id!
        app.route('/event/:id([0-9]+)')
        
            .get(function(req, res) {
                // return single event
                        
                redis.get(eventObj, function (err, obj) {
                    var eventList = parseJsonList(obj),
                        event = eventList.filter(function(el) {
                            return el.id == req.params.id
                        });
                    
                    res.status(200).json(event[0] || []);
                });
            })
            
            
            .put(function(req, res) {
                // update single event
                        
                redis.get(eventObj, function (err, obj) {
                    var eventList = JSON.parse(obj);
                    
                    for (var i in eventList) {
                        if (eventList[i].id == req.params.id) {
                            
                            // todo: check for valid inputs
                                                
                            if (req.body.name) organizerList[i].name = req.body.name;
                            if (req.body.dateStart) organizerList[i].dateStart = moment(req.body.dateStart).format('X');
                            if (req.body.dateEnd) organizerList[i].dateEnd = moment(req.body.dateEnd).format('X');
                            
                            var newEvent = organizerList[i];
                            
                            break;
                        }
                    }
                                        
                    // save list
                    redis.set(eventObj, JSON.stringify(eventList));
                    
                    // output
                    res.status(200).json(newEvent);
                });
            })
            
            .delete(function(req, res) {
                // delete single event
                        
                redis.get(eventObj, function (err, obj) {
                    var eventList = JSON.parse(obj);
                    
                    //console.log(eventList);
                    
                    // filter userlist..
                    eventList = eventList.filter(function(el) {
                        return el.id != req.params.id
                    });
                                        
                    // save list
                    redis.set(eventObj, JSON.stringify(eventList));
                    
                    // output
                    res.status(200).json({ 
                        success: true
                    });
                });
            });
            
        console.log('module events loaded successful');
    }
}