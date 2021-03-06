module.exports = {
    init: function(app) {
	    
        // init demo data
		app.route('/initdemo').get(function(req, res) {
		    // User
		    redis.set(userlistObj, JSON.stringify([
		        {
		            id: 1,
		            isCompany: false,
		            companyId: 3,
		            username: 'Franky',
		            email: 'fh@franky.ws',
		            password: sha1sum('test123'),
		            experiences: [
		                { experience: 'zapfen', level: 2 },
		                { experience: 'worker', level: 4 },
		                { experience: 'aufbau', level: 5 },
		                { experience: 'abbau', level: 8 },
		                { experience: 'kasse', level: 3 }
		            ]
		        },
		        {
		            id: 2,
		            isCompany: false,
		            companyId: 3,
		            username: 'Steve',
		            email: 'info@franky.ws',
		            password: sha1sum('test123'),
		            experiences: [
		                { experience: 'bonstelle', level: 2 },
		                { experience: 'worker', level: 5 }
		            ]
		        },
		        {
		            id: 3,
		            isCompany: true,
                    companyId: 3,
		            username: 'PollerWiesen GmbH',
		            email: 'franky@pollwiesen.org',
		            password: sha1sum('test123'),
		            experiences: null
		        },
		        {
		            id: 4,
		            isCompany: false,
		            companyId: 3,
		            username: 'Nico',
		            email: 'n.bastian@outlook.com',
		            password: sha1sum('test123'),
		            experiences: [
		                { experience: 'kasse', level: 5 },
		                { experience: 'kassenleitung', level: 5 }
		            ]
		        }
		    ]));
		    
		    // Veranstaltungen
		    redis.set(eventObj, JSON.stringify([
		        {
		            id: 1,
		            userId: 3,
		            name: 'PollerWiesen Minus',
		            dateStart: moment('2015-08-15 12:00').format('X'),
		            dateEnd: moment('2015-08-15 22:00').format('X')
		        },
		        {
		            id: 2,
		            userId: 3,
		            name: 'PollerWiesen Dortmund',
		            dateStart: moment('2015-09-15 12:00').format('X'),
		            dateEnd: moment('2015-09-15 22:00').format('X')
		        }
		    ]));
		    
		    // Dienstpläne
		    redis.set(rosterObj, JSON.stringify([
		        {
		            id: 1,
		            userId: null,
		            eventId: 1,
		            dateStart: moment('2015-08-15 13:00').format('X'),
		            dateEnd: moment('2015-08-15 14:00').format('X'),
		            position: 'kasse',
		            jobPriority: 5
		        },
		        {
		            id: 2,
		            userId: null,
		            eventId: 1,
		            dateStart: moment('2015-08-15 14:00').format('X'),
		            dateEnd: moment('2015-08-15 16:00').format('X'),
		            position: 'kasse',
		            jobPriority: 5
		        },
		        {
		            id: 3,
		            userId: null,
		            eventId: 1,
		            dateStart: moment('2015-08-15 13:00').format('X'),
		            dateEnd: moment('2015-08-15 18:00').format('X'),
		            position: 'kassenleitung',
		            jobPriority: 8
		        },
		        {
		            id: 4,
		            userId: null,
		            eventId: 2,
		            dateStart: moment('2015-09-15 13:00').format('X'),
		            dateEnd: moment('2015-09-15 15:00').format('X'),
		            position: 'worker',
		            jobPriority: 1
		        },
		        {
		            id: 5,
		            userId: null,
		            eventId: 2,
		            dateStart: moment('2015-09-15 15:00').format('X'),
		            dateEnd: moment('2015-09-15 16:00').format('X'),
		            position: 'worker',
		            jobPriority: 1
		        }
		    ]));
		    
		    res.json({
		        success: true,
		        msg: 'Demodata filled successful.'
		    });
		});
		
		console.log('module fill loaded successful');
    }
}