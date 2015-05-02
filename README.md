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
	"auth": {
		"e": "65",
		"n": "283509283507230857230852038509235"
	},
	"encryption_params": "JSONBlob",
	"data": "10j1n3f0ine02mf02ef02n0"
}

Note: "e" and "n" are strings, to assist in parsing big numbers
```

Create a user in the database: `PUT /api/users/`

Request:

```
{
	"user_id": "akshayp29",
	"auth": {
		"e": "65",
		"n": "283509283507230857230852038509235"
	},
	"encryption_params": "JSONBlob",
	"data": "10j1n3f0ine02mf02ef02n0"
}

Note: "e" and "n" are strings, to assist in parsing big numbers
```

Response:

```
200 OK
```

Add/change information of a user's account: `POST /api/users/{user_id}`

Request:

```
{
	"old_auth": {
		"p": "893259872398572983752981",
		"q": "891u258917250971203"
	}
	"new_auth": {
		"e": "65",
		"n": "283509283507230857230852038509235"
	},
	"data": (optional) "10j1n3f0ine02mf02ef02n0",
	"encryption_params": (optional) "JSONBlob",
}

Note: "e", "n", "p", and "q" are strings, to assist in parsing big numbers
Also, "p" and "q" can be interchanged
Furthermore, the "data" field in this post request replaces the previous "data" field, given that the authorization was successful.
```

Response:

```
200 OK
```