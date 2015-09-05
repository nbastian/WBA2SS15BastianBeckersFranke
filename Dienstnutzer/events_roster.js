module.exports = {
    init: function(app, http) {
	    var extend = require('util')._extend,
	   		moment = require('moment');
	   		
	   	var inputFormat = {
		   	date: 'YYYY-MM-DD',
		   	time: 'HH:mm'
	   	}
	    
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
		            var jsonEvent = JSON.parse(respJsonString);
					
		            res.render('pages/veranstaltung', {
		                event: extend(jsonEvent, { 
			            	startDate: moment(jsonEvent.dateStart, 'X').format(inputFormat.date),
			            	startTime: moment(jsonEvent.dateStart, 'X').format(inputFormat.time),
			            	endDate: moment(jsonEvent.dateEnd, 'X').format(inputFormat.date),
			            	endTime: moment(jsonEvent.dateEnd, 'X').format(inputFormat.time)
			            }),
		                name: req.cookies.username
		            });
		        });
		    }).end();
		})
    }
}