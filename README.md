# ApiGateway

This service works as and Api Gateway that communicates the frontend with the microservices for a streaming app

## Characteristics

* It servers as a single entrypoint for the backend.
* It connects to the following microservices:
    * Users microservice
    * Contents microservice
    * Favourites service
    * History service
* It uses the Fastify routers for a better performance.
* It validates the tokens before each request.
* It connects to a Redis queue to create new jobs for   the FFMPEG transcoder program.

## Configuration
It uses environment variables to know the URLs of the microservices, the secret key for the tokens, and the Redis host.

```
CONTENTS_SERVICE_URL=http://localhost:8000
FAVOURITES_SERVICE_URL=http://localhost:7600
HISTORY_SERVICE_URL=http://localhost:7500
USER_SERVICE_URL=http://users_service:4000
SECRET_KEY=super-secret-key
REDIS_HOST=localhost
```

## Setup

To start your server:

* Run `npm install` to install dependencies 
* Run `npm run build` to transpile the TypeScript code to JavaScript
* Start the endpoint with `node ./dist/gateway.js`

Now the server will be active at [`localhost:30000`](http://localhost:30000).

