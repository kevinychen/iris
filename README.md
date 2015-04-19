# Iris

6.857 Project

# Server

## How to get certificates for TLS

Open the terminal and `cd` into `server/openssl/`.

Run `openssl genrsa -out key.pem 2048` and `openssl req -new -sha256 -key key.pem -out csr.pem`.
This will ask you questions about your organization in order to provide you a certificate for TLS.

After answering them, run `openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem`

## How to start the server

Open the terminal and run `mongod` (make sure you have mongoDB). If this doesn't work, try `sudo mongod`.

In a different terminal window, `cd` into `server/` from the terminal and run `npm install` (make sure you have node and npm)

Run `node .` to start the server.

In order to talk to the server, use the base URL `https://localhost:3000/`. It might complain that you do not have a valid TLS certificate (as we don't), but that's fine for now.

# Endpoints

Get information about a user: `GET /api/users/{user_id}`

Response:

```
{
	"user_id": "akshayp29",
	"first_name": "Akshay",
	"last_name": "Padmanabha",
	"email": "akshayp29@gmail.com",
	"dob": "07/29/96",
	"middle_name": (optional) "Bradley",
	"home_phone": (optional) "1234567890",
	"mobile_phone": (optional) "2345678901",
	"work_phone": (optional) "3456789012",
	"address": (optional) "410 Memorial Drive",
	"city": (optional) "Cambridge",
	"state": (optional) "MA",
	"zip_code": (optional) "02139",
	"card_number": (optional) "1234123412340000",
	"services": [{
		"name": "Iris"
	},{
		"name": "GitHub",
		"username": "username",
		"password": "password"
	}]
}

Note: all of the fields in the above request are encrypted
```

Create a user in the database: `PUT /api/users/`

Request:

```
{
	"user_id": "akshayp29",
	"first_name": "Akshay",
	"last_name": "Padmanabha",
	"email": "akshayp29@gmail.com",
	"dob": "07/29/96",
	"middle_name": (optional) "Bradley",
	"home_phone": (optional) "1234567890",
	"mobile_phone": (optional) "2345678901",
	"work_phone": (optional) "3456789012",
	"address": (optional) "410 Memorial Drive",
	"city": (optional) "Cambridge",
	"state": (optional) "MA",
	"zip_code": (optional) "02139",
	"card_number": (optional) "1234123412340000"
}

Note: all of the fields in the above request are encrypted
```

Response:

```
200 OK
```

Add/change information of a user's account: `POST /api/users/{user_id}`

Request:

```
{
	"middle_name": (optional) "Bradley",
	"home_phone": (optional) "1234567890",
	"mobile_phone": (optional) "2345678901",
	"work_phone": (optional) "3456789012",
	"address": (optional) "410 Memorial Drive",
	"city": (optional) "Cambridge",
	"state": (optional) "MA",
	"zip_code": (optional) "02139",
	"card_number": (optional) "1234123412340000"
}
```

Response:

```
200 OK
```

Add a service to a user's account: `POST /api/users/{user_id}`

Request:

```
{
	"service": {
		"name": "Facebook",
		"username": "username",
		"password": "password"
	}
}
```

Response:

```
200 OK
```