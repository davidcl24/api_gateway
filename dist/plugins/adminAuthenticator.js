import fp from 'fastify-plugin';
export default fp(async function adminPlugin(fastify, opts) {
    fastify.decorate("requireAdmin", async function (request, reply) {
        if (!request.user || request.user.role != 'admin') {
            reply.code(403).send({ error: 'Access denied. Admin role required' });
        }
    });
});
