import httpProxy from '@fastify/http-proxy';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function favouritesProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const favsServiceUrl = process.env.FAVOURITES_SERVICE_URL || 'http://localhost:4000'
    fastify.register(httpProxy, {
        upstream: favsServiceUrl ,
        prefix: '/favourites',
        rewritePrefix: '/favourites'
    });
}