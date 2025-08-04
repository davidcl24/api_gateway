import httpProxy from '@fastify/http-proxy';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function historyProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:7500/api'
    fastify.register(httpProxy, {
        upstream: historyServiceUrl
    });
}