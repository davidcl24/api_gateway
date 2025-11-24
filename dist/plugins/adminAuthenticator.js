/**
 * @module plugins/adminAuthenticator
 */
import fp from 'fastify-plugin';
export default fp(
/**
 * @function adminPlugin
 * @memberof module:plugins/adminAuthenticator
 * @summary Verifies if the user making the request has the role admin.
 * @param fastify The fastify instance.
 * @param opts The options for the fastify plugin
 */
async function adminPlugin(fastify, opts) {
    fastify.decorate("requireAdmin", async function (request, reply) {
        if (!request.user || request.user.role != 'admin') {
            reply.code(403).send({ error: 'Access denied. Admin role required' });
        }
    });
});
