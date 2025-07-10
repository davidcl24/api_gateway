import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function usersProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    interface Params {
        id: string
    }
    const usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:4000';

    fastify.get('/users', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const res = await fetch(`${usersServiceUrl}/users`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id

        const res = await fetch(`${usersServiceUrl}/users/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    
    fastify.post('/users', async (request, reply) => {
        const res = await fetch(`${usersServiceUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/users/:id', {preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id

        const res = await fetch(`${usersServiceUrl}/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.delete<{ Params: Params }>('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id

        const res = await fetch(`${usersServiceUrl}/users/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.post('/login', async(request, reply) => {
        const res = await fetch(`${usersServiceUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.post('/logout', async(request, reply) => {
        const res = await fetch(`${usersServiceUrl}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.post('/refresh', { preHandler: [fastify.authenticate] }, async(request, reply) => {
        const res = await fetch(`${usersServiceUrl}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': request.user.sub
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data)
    });
}