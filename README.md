# WBA2SS15BastianBeckersFranke

## API endpoints
Endpoint | HTTP-Verb | POST-Body | Result
--- | --- | --- | ---
/user | GET | empty | returns all user as json object-array
/user | POST | JSON string | create new user
/user/:id | GET | empty | returns single user
/user/:id | PUT | JSON string | update an existing user
/user/:id | DELETE | empty | delete an existing user