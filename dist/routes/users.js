/**
 * @module routes/users
 */
/**
 * @function usersProxy
 * @memberof module:routes/users
 * @summary It proxies the requests that come from the client to the users microservice
 * @param fastify The fastify instance
 * @param opts The options for the fastify plugin
 */
export default async function usersProxy(fastify, opts) {
    const usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:4000/api';
    /**
     * @name GET /users
     * @function
     * @memberof module:routes/users
     * @summary It retrieves from the microservice every existing user
     */
    fastify.get('/users', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const res = await fetch(`${usersServiceUrl}/users`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name GET /users/:id
     * @function
     * @memberof module:routes/users
     * @summary It retrieves from the microservice one specific user
     */
    fastify.get('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${usersServiceUrl}/users/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name GET /users/personal
     * @function
     * @memberof module:routes/users
     * @summary It retrieves from the microservice the data of the user who made the request
     */
    fastify.get('/users/personal', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const sub = request.user.sub;
        const res = await fetch(`${usersServiceUrl}/users/${sub}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name POST /users
     * @function
     * @memberof module:routes/users
     * @summary It allows to register a new user and also returns the JWT pair as cookies
     */
    fastify.post('/users', async (request, reply) => {
        const wrappedBody = { user: request.body };
        const res = await fetch(`${usersServiceUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrappedBody),
        });
        const setCookies = res.headers.getSetCookie();
        if (setCookies) {
            for (const cookie of setCookies) {
                reply.header('set-cookie', cookie);
            }
        }
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name PATCH /users/:id
     * @function
     * @memberof module:routes/users
     * @summary It calls the microservie to update a particular existing user
     */
    fastify.patch('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;
        const wrappedBody = { user: request.body };
        const res = await fetch(`${usersServiceUrl}/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrappedBody),
        });
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name PATCH /users/personal
     * @function
     * @memberof module:routes/users
     * @summary It calls the microserivce to update the user that made the request
     */
    fastify.patch('/users/personal', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const sub = request.user.sub;
        const wrappedBody = { user: request.body };
        const res = await fetch(`${usersServiceUrl}/users/${sub}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wrappedBody),
        });
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name DELETE /users/:id
     * @function
     * @memberof module:routes/users
     * @summary It calls the microservice to delete a user in particular
     */
    fastify.delete('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${usersServiceUrl}/users/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name DELETE /users/personal
     * @function
     * @memberof module:routes/users
     * @summary It calls the microservice to delete the user that made the request
     */
    fastify.delete('/users/personal', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const sub = request.user.sub;
        const res = await fetch(`${usersServiceUrl}/users/${sub}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name POST /login
     * @function
     * @memberof module:routes/users
     * @summary It returns a pair of new JWTs if the authentication was correct in the users microservice
     */
    fastify.post('/login', async (request, reply) => {
        const res = await fetch(`${usersServiceUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const setCookies = res.headers.getSetCookie();
        if (setCookies) {
            for (const cookie of setCookies) {
                reply.header('set-cookie', cookie);
            }
        }
        const data = await res.json();
        return reply.send(data);
    });
    fastify.post('/login/admin', async (request, reply) => {
        const res = await fetch(`${usersServiceUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const setCookies = res.headers.getSetCookie();
        if (setCookies) {
            for (const cookie of setCookies) {
                reply.header('set-cookie', cookie);
                if (cookie.startsWith("access_token=")) {
                    const accessToken = cookie.split(";")[0].split("=")[1];
                    const decoded = fastify.jwt.decode(accessToken);
                    if (decoded && decoded.role != 'admin') {
                        return reply.code(403).send({ error: 'Access denied. Admin role required' });
                    }
                }
            }
        }
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name POST /logout
     * @function
     * @memberof module:routes/users
     * @summary It returns a pair of empty JWTs generated in the users microservice
     */
    fastify.post('/logout', async (request, reply) => {
        const res = await fetch(`${usersServiceUrl}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const setCookies = res.headers.getSetCookie();
        if (setCookies) {
            for (const cookie of setCookies) {
                reply.header('set-cookie', cookie);
            }
        }
        const data = await res.json();
        return reply.send(data);
    });
    /**
     * @name POST /token-checker
     * @function
     * @memberof module:routes/users
     * @summary It checkes if any of the two tokens is valid
     */
    fastify.post('/token-checker', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        return reply.send();
    });
    // fastify.post('/refresh', { preHandler: [fastify.authenticate] }, async(request, reply) => {
    //     const res = await fetch(`${usersServiceUrl}/refresh`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'x-user-id': request.user.sub
    //         },
    //         body: JSON.stringify(request.body),
    //     });
    //     const setCookies = res.headers.getSetCookie();
    //     if (setCookies) {
    //         for (const cookie of setCookies) {
    //             reply.header('set-cookie', cookie);
    //         }
    //     }
    //     const data = await res.json();
    //     return reply.send(data)
    // });
}
