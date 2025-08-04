import httpProxy from '@fastify/http-proxy';
export default async function historyProxy(fastify, opts) {
    const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:7500';
    fastify.register(httpProxy, {
        upstream: historyServiceUrl,
        prefix: '/history',
        rewritePrefix: '/api/history'
    });
}
