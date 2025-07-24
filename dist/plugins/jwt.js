import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fp from 'fastify-plugin';
export default fp(async function jwtPlugin(fastify, opts) {
    fastify.register(fastifyJwt, {
        secret: String(process.env.SECRET_KEY) || 'dev_key',
    });
    fastify.register(fastifyCookie, {
        secret: process.env.SECRET_KEY || 'dev_key',
        hook: "preHandler",
    });
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            const token = request.cookies.token;
            if (!token) {
                return reply.status(401).send({ message: "Auth required" });
            }
            await request.jwtVerify(token);
        }
        catch (err) {
            reply.code(401).send({ error: 'Invalid or absent token' });
        }
    });
});
