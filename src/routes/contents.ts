import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function actorsProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const contentsServiceUrl = process.env.CONTENTS_SERVICE_URL || 'http://localhost:4000';


}