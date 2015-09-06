module.exports = {
    init: function(app, http) {
	    var extend = require('util')._extend,
	   		moment = require('moment'),
	   		async = require('async'),
	   		inputFormat = {
			   	date: 'YYYY-MM-DD',
			   	time: 'HH:mm'
		   	};
	    
        // endpoint for module_events_roster
        app.get('/veranstaltungen/:eventId([0-9]+)', function(req, res) {
		    var httpReq = http.request({
		        host: 'localhost',
		        port: 1337,
		        path: '/event/' + req.params.eventId + '/?token=' + req.cookies.token,
		        method: 'GET',
		        headers: {
		            accept: 'application/json'
		        }
		    }, function(externalRes){
		        externalRes.on('data', function(respJsonString){
		            var jsonEvent = JSON.parse(respJsonString),
						startDate = moment(jsonEvent.dateStart, 'X'),
						endDate = moment(jsonEvent.dateEnd, 'X');
					
		            res.render('pages/veranstaltung', {
		                event: extend(jsonEvent, { 
			            	startDate: startDate.format(inputFormat.date),
			            	startTime: startDate.format(inputFormat.time),
			            	endDate: endDate.format(inputFormat.date),
			            	endTime: endDate.format(inputFormat.time)
			            }),
		                name: req.cookies.username,
						isCompany: req.cookies.isCompany
		            });
		        });
		    }).end();
		});
		
		// edit event
		app.put('/veranstaltungen/:eventId([0-9]+)', function(req, res) {
			var options = {
		        host: 'localhost',
		        port: 1337,
		        path: '/event/' + req.params.eventId + '?token=' + req.cookies.token,
		        method: 'PUT',
		        headers: {
		            'Content-Type': 'application/json'
		        }
		    };
		    
		    req.body = extend(req.body, {
			    dateStart: moment(req.body.eventdate_date + ' ' + req.body.eventdate_time).format('X'),
			    dateEnd: moment(req.body.eventdate_end_date + ' ' + req.body.eventdate_end_time).format('X')
		    });
			 
		    var serverRequest = http.request(options, function(apiRes){
	            apiRes.on('data', function(jsonString){
		            var json = JSON.parse(jsonString);
	                res.json(json);
	            });
	        });
	        serverRequest.write(JSON.stringify(req.body));
	        serverRequest.end();
		});
		
		// here comes the intelligence
		app.get('/veranstaltungen/:eventId([0-9]+)/roster', function(req, res) {
		    // get roster and find best fitting user
		    
		    // requests async / parallel!
		    async.parallel({
			    roster: function(callback){
			        http.request({
				        host: 'localhost',
				        port: 1337,
				        path: '/event/' + req.params.eventId + '/roster?token=' + req.cookies.token,
				        method: 'GET',
				        headers: {
				            accept: 'application/json'
				        }
				    }, function(rosterRes){
				        rosterRes.on('data', function(respJsonString){
				            var jsonRoster = JSON.parse(respJsonString);
				            
				            // get only roster from current event
				            jsonRoster = jsonRoster.filter(function(currRoster) {
					            return currRoster.eventId = req.params.eventId;
				            });
							
							callback(null, jsonRoster);
				        });
				    }).end();
			    },
			    user: function(callback){
			        http.request({
				        host: 'localhost',
				        port: 1337,
				        path: '/user?token=' + req.cookies.token,
				        method: 'GET',
				        headers: {
				            accept: 'application/json'
				        }
				    }, function(userRes){
				        userRes.on('data', function(respJsonString){
				            var jsonUser = JSON.parse(respJsonString);
				            
							// filter user
				            jsonUser = jsonUser.filter(function(currUser) {
					            return !currUser.isCompany;
				            });
							
							callback(null, jsonUser);
				        });
				    }).end();
			    }
			},
			
			function(err, asyncRes){
				// each resource answered
				
				var outputJson = [];
				
				// sort jobs by priority (for which job is is acute to find a person)
				asyncRes.roster = asyncRes.roster.sort(function(a, b) {
					return a.jobPriority > b.jobPriority ? -1 : 1;
				});
				
				for (var i in asyncRes.roster) {
					var currRoster = asyncRes.roster[i],
						positionForFindingUser = currRoster.position,
						userFit4Job = [],
						outputJsonBit = currRoster;
					
					for (var j in asyncRes.user) {
						var currUser = asyncRes.user[j];
						
						if (!currUser['blockedFor']) currUser['blockedFor'] = [];
					
						for (var k in currUser.experiences) {
							var currUserExperience = currUser.experiences[k];
							
							// is user experience that what were searching for?
							if (
								currUserExperience.experience.toLowerCase() == positionForFindingUser.toLowerCase()
							) {
								
								// is blocked for this time?
								var userIsBlocked = false;
								for (var l in currUser.blockedFor) {
									var userBlockBit = currUser.blockedFor[l];
									userIsBlocked = userBlockBit.dateStart > currRoster.dateStart && userBlockBit.dateEnd < currRoster.dateEnd;
								}
								
								if (!userIsBlocked) {
									// user can work
									
									userFit4Job.push({
										user: {
											userId: currUser.id,
											username: currUser.username,
											email: currUser.email
										},
										level: currUserExperience.level
									});
									
									// not available for other jobs [at this time]
									currUser.blockedFor.push({
										rosterId: currRoster.id,
										dateStart: currRoster.dateStart,
										dateEnd: currRoster.dateEnd
									});
								}
							}
						}
					}
					
					
					if (userFit4Job.length > 0) {
						// now we have fitting user
						// sort by level
						
						userFit4Job = userFit4Job.sort(function(a, b) {
							return a.level > b.level ? -1 : 1;
						});
					}
					
					outputJsonBit['userFit4Job'] = userFit4Job;
					
					outputJson.push(outputJsonBit);
				}
				
			    res.json(outputJson);
			});
		});
		
		app.post('/veranstaltungen/:eventId([0-9]+)/roster', function(req, res) {
			var options = {
		        host: 'localhost',
		        port: 1337,
		        path: req.body.id && req.body.id != '' ? '/roster/' + req.body.id + '?token=' + req.cookies.token : '/event/' + req.params.eventId + '/roster?token=' + req.cookies.token,
		        method: req.body.id && req.body.id != '' ? 'PUT' : 'POST',
		        headers: {
		            'Content-Type': 'application/json'
		        }
		    };
		    
		    req.body = extend(req.body, {
			    dateStart: moment(req.body.eventdate_date + ' ' + req.body.eventdate_time).format('X'),
			    dateEnd: moment(req.body.eventdate_end_date + ' ' + req.body.eventdate_end_time).format('X')
		    });
			 
		    var serverRequest = http.request(options, function(apiRes){
	            apiRes.on('data', function(jsonString){
		            var json = JSON.parse(jsonString);
	                res.json(json);
	            });
	        });
	        serverRequest.write(JSON.stringify(req.body));
	        serverRequest.end();
		});
    }
}