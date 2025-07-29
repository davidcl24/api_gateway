import httpProxy from '@fastify/http-proxy';
export default async function historyProxy(fastify, opts) {
    const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:5000/api';
    fastify.register(httpProxy, {
        upstream: historyServiceUrl,
        prefix: '/history',
        rewritePrefix: '/history'
    });
}
