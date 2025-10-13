import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fp from 'fastify-plugin';
import { log } from 'console';
export default fp(async function jwtPlugin(fastify, opts) {
    const secret = process.env.SECRET_KEY || 'dev_key';
    fastify.register(fastifyJwt, {
        secret: secret,
        sign: { algorithm: 'HS256' },
    });
    fastify.register(fastifyCookie, {
        secret: secret,
    });
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            log('me cago');
            var accessToken = request.cookies.access_token;
            log('access token: ', accessToken);
            var refreshToken = request.cookies.refresh_token;
            log('refresh Token: ', refreshToken);
            if (!accessToken && !refreshToken) {
                reply.code(401).send({ error: 'No tokens provided' });
                return;
            }
            let decoded;
            if (accessToken) {
                decoded = await request.jwtVerify({ jwt: accessToken });
            }
            else {
                throw new Error('Access token missing or invalid');
            }
            request.user = decoded;
        }
        catch (err) {
            if (err.message === 'Access token missing or invalid') {
                if (!refreshToken) {
                    reply.code(401).send({ error: 'Refresh token missing' });
                    return;
                }
                try {
                    const refreshDecoded = await request.jwtVerify({ jwt: refreshToken });
                    const res = await fetch(`http://localhost:4000/api/refresh`, {
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
                    request.user = refreshDecoded;
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
