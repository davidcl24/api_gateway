/**
 * @module plugins/jwt
 */
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fp from 'fastify-plugin';
import { log } from 'console';
export default fp(
/**
 * @function jwtPlugin
 * @memberof module:plugins/jwt
 * @summary Verifies if the JWTs that came in the cookies of the request are valid. If the access token is valid, it allows the request. If it is not, but the refresh token is valid, it allows the request and calls the user microservice that generates a new token pair. If neither is valid, it doesn't allow the request.
 * @param fastify The fastify instance.
 * @param opts The options for the fastify plugin
 */
async function jwtPlugin(fastify, opts) {
    const secret = process.env.SECRET_KEY || 'dev_key';
    const usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:4000/api';
    fastify.register(fastifyJwt, {
        secret: secret,
        sign: { algorithm: 'HS256' },
    });
    fastify.register(fastifyCookie, {
        secret: secret,
        cookie: {
            cookieName: 'access_token',
            signed: false
        }
    });
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            const accessToken = request.cookies.access_token;
            var refreshToken = request.cookies.refresh_token;
            if (!accessToken && !refreshToken) {
                reply.code(401).send({ error: 'No tokens provided' });
                return;
            }
            let decoded;
            if (accessToken) {
                decoded = await fastify.jwt.verify(accessToken);
            }
            else {
                throw new Error('Access token missing or invalid');
            }
            request.user = decoded;
        }
        catch (err) {
            if (err.name === 'TokenExpiredError' ||
                err.name === 'JsonWebTokenError' ||
                err.code === 'FAST_JWT_MALFORMED' ||
                err.message === 'Access token missing or invalid') {
                if (!refreshToken) {
                    reply.code(401).send({ error: 'Refresh token missing' });
                    return;
                }
                try {
                    const refreshDecoded = await fastify.jwt.verify(refreshToken);
                    const res = await fetch(`${usersServiceUrl}/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-user-id': refreshDecoded.sub
                        },
                        body: JSON.stringify(request.body),
                    });
                    const setCookies = res.headers.getSetCookie();
                    if (setCookies) {
                        for (const cookie of setCookies) {
                            reply.header('set-cookie', cookie);
                        }
                    }
                    const newAccessToken = setCookies[1].match(/access_token=([^;]+)/)[1];
                    const newDecoded = await fastify.jwt.verify(newAccessToken);
                    request.user = newDecoded;
                }
                catch (refreshErr) {
                    if (refreshErr.name === 'TokenExpiredError') {
                        reply.code(401).send({ error: 'Refresh token expired' });
                    }
                    else if (refreshErr.name === 'JsonWebTokenError') {
                        reply.code(401).send({ error: 'Refresh token invalid' });
                    }
                    else {
                        reply.code(401).send({ error: 'Authentication error' });
                    }
                    return;
                }
            }
            else {
                reply.code(401).send({ error: 'Authentication error' });
                return;
            }
        }
    });
});
