module.exports = {
    init: function(app) {
        // get all Roster by eventId
        app.route('/event/:eventId([0-9]+)/roster')
            .get(function(req, res) {
                // return single roster by eventId
                        
                redis.get(rosterObj, function (err, obj) {
                    var rosterList = parseJsonList(obj),
                        rosterByEvent = rosterList.filter(function(el) {
                            return el.eventId == req.params.eventId
                        });
                    
                    res.status(200).json(rosterByEvent || []);
                });
            });
        
        // specific rosterEntry
        app.route('/roster/:rosterId([0-9]+)')
            .put(function(req, res) {
                // update single rosterObj.
                        
                redis.get(rosterObj, function (err, obj) {
                    var rosterList = JSON.parse(obj);
                    
                    for (var i in rosterList) {
                        if (rosterList[i].id == req.params.rosterId) {
                            
                            // todo: check for valid inputs
                                                
                            if (req.body.userId) rosterList[i].userId = parseInt(req.body.userId);
                            if (req.body.eventId) rosterList[i].userId = parseInt(req.body.eventId);
                            if (req.body.dateStart) rosterList[i].dateStart = moment(req.body.dateStart).format('X');
                            if (req.body.dateEnd) rosterList[i].dateEnd = moment(req.body.dateEnd).format('X');
                            
                            var newRosterEntry = rosterList[i];
                            
                            break;
                        }
                    }
                                        
                    // save list
                    redis.set(rosterObj, JSON.stringify(rosterList));
                    
                    // output
                    res.status(200).json(newRosterEntry);
                });
            })
            
            .delete(function(req, res) {
                // delete single user
                        
                redis.get(rosterObj, function (err, obj) {
                    var rosterList = JSON.parse(obj);
                    
                    // filter userlist..
                    rosterList = rosterList.filter(function(el) {
                        return el.id != req.params.rosterId
                    });
                                        
                    // save list
                    redis.set(rosterObj, JSON.stringify(rosterList));
                    
                    // output
                    res.status(204).json({ 
                        success: true
                    });
                });
            });
            
        console.log('module rosters loaded successful');
    }
}