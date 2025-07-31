import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fp from 'fastify-plugin';
export default fp(async function jwtPlugin(fastify, opts) {
    const usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:4000/api';
    const secret = process.env.SECRET_KEY || 'dev_key';
    fastify.register(fastifyJwt, {
        secret: secret,
        sign: { algorithm: 'HS256' },
    });
    fastify.register(fastifyCookie, {
        secret: secret,
        hook: "preHandler",
    });
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            const accessToken = request.cookies.access_token;
            await request.jwtVerify(accessToken);
        }
        catch (err) {
            const refreshToken = request.cookies.refresh_token;
            if (!refreshToken) {
                return reply.status(401).send({ message: "Unauthorized" });
            }
            try {
                await request.jwtVerify(refreshToken);
                const res = await fetch(`${usersServiceUrl}/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-user-id': request.user.sub
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
            }
            catch (err) {
                if (err.name === 'TokenExpiredError')
                    reply.code(401).send({ error: 'Token expired' });
                if (err.name === 'JsonWebTokenError')
                    reply.code(401).send({ error: 'JWT error: ' + err.message });
            }
        }
    });
});
