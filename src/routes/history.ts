import httpProxy from '@fastify/http-proxy';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function historyProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
      interface Params {
        id: string,
    }
    const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:7500'

    fastify.get('/history/user/personal', { preHandler: [fastify.authenticate] }, async(request, reply) => {
        const sub = request.user.sub;

        const res = await fetch(`${historyServiceUrl}/api/history/user/${sub}`, {
            method: 'GET',
        });

        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/history/user/personal/movie/:id', { preHandler: [fastify.authenticate] }, async(request, reply) => {
        const sub = request.user.sub;
        const movieId = request.params.id;

        const res = await fetch(`${historyServiceUrl}/api/history/user/${sub}/movie/${movieId}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data)
    });

    fastify.get<{ Params: Params }>('/history/user/personal/episode/:id', { preHandler: [fastify.authenticate] }, async(request, reply) => {
        const sub = request.user.sub;
        const showId = request.params.id;

        const res = await fetch(`${historyServiceUrl}/api/history/user/${sub}/episode/${showId}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data)
    });

    fastify.post('/history/new', { preHandler: [fastify.authenticate] }, async(request, reply) => {
        const sub = request.user.sub;
        const originalBody = request.body as any;

        request.body = {
            ...originalBody,
            user_id: sub
        }

        const res = await fetch(`${historyServiceUrl}/api/history`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(request.body),
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