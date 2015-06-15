# WBA2SS15BastianBeckersFranke

## API endpoints

### User endpoints
Ressource | Methode | content-type (req) | content-type (res) | Semantik
--- | --- | --- | --- | ---
/user | GET | empty | application/json | returns all user as json object-array
/user | POST | application/json | empty | create new user
/user/:id | GET | empty | application/json | returns single user
/user/:id | PUT | application/json | empty | update an existing user
/user/:id | DELETE | empty | empty | delete an existing user

### Veranstalter endpoints
Ressource | Methode | content-type (req) | content-type (res) | Semantik
--- | --- | --- | --- | ---
/organizer | GET | empty | application/json | returns all organizers as json object-array
/organizer | POST | application/json | empty | create new organizer
/organizer/:id | GET | empty | application/json | returns single organizer
/organizer/:id | PUT | application/json | empty | update an existing organizer
/organizer/:id | DELETE | empty | empty | delete an existing organizer


### Event endpoints
Ressource | Methode | content-type (req) | content-type (res) | Semantik
--- | --- | --- | --- | ---
/event | GET | empty | application/json | returns all events as json object-array
/event | POST | application/json | empty | create new event
/event/:eventid | GET | empty | empty | returns single event
/event/:eventid | PUT | application/json | empty | update an existing event
/event/:eventid | DELETE | empty | empty | delete an existing event

### Dienstplan endpoints
Ressource | Methode | content-type (req) | content-type (res) | Semantik
--- | --- | --- | --- | ---
/event/:eventid | POST | application/json | empty | create new event entry
/event/:eventid/:entryid | GET | empty | application/json | returns single event entry
/event/:eventid/:entryid | PUT | application/json | empty | update an existing event entry
/event/:eventid/:entryid | DELETE | empty | empty | delete an existing event entry