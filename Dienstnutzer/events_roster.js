module.exports = {
    init: function(app, http) {
	    var extend = require('util')._extend,
	   		moment = require('moment'),
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
		})
    }
}