# WBA2SS15BastianBeckersFranke

## API endpoints

### User endpoints
Ressource | Methode | content-type (req) | content-type (res) | Result/Semantik
--- | --- | --- | --- | ---
/user | GET | empty | application/json | returns all user as json object-array
/user | POST | application/json | empty | create new user
/user/:id | GET | empty | application/json | returns single user
/user/:id | PUT | application/json | empty | update an existing user
/user/:id | DELETE | empty | empty | delete an existing user

!!!temp!!!
### Veranstalter endpoints
Ressource | Methode | POST-Body | Result
--- | --- | --- | ---
/user | GET | empty | returns all user as json object-array
/user | POST | JSON string | create new user
/user/:id | GET | empty | returns single user
/user/:id | PUT | JSON string | update an existing user
/user/:id | DELETE | empty | delete an existing user
!!!temp!!!

### Event endpoints
Ressource | Methode | POST-Body | Result
--- | --- | --- | ---
/event | GET | empty | returns all events as json object-array
/event | POST | JSON string | create new event
/event/:eventid | GET | empty | returns single event
/event/:eventid | PUT | JSON string | update an existing event
/event/:eventid | DELETE | empty | delete an existing event

### Dienstplan endpoints
Ressource | Methode | POST-Body | Result
--- | --- | --- | ---
/event/:eventid | POST | JSON string | create new event entry
/event/:eventid/:entryid | GET | empty | returns single event entry
/event/:eventid/:entryid | PUT | JSON string | update an existing event entry
/event/:eventid/:entryid | DELETE | empty | delete an existing event entry