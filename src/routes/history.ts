import httpProxy from '@fastify/http-proxy';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function historyProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:7500'

    fastify.get('/history/user/personal', { preHandler: [fastify.authenticate] }, async(request, reply) => {
        const sub = request.user.sub;

        const res = await fetch(`${historyServiceUrl}/api/history/user/${sub}`, {
            method: 'GET',
        });

        const data = await res.json();
        return reply.send(data);
    });

    fastify.register(httpProxy, {
        upstream: historyServiceUrl,
        prefix: '/history',
        rewritePrefix: '/api/history'
    });
}