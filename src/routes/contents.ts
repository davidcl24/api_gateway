import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function contentsProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const contentsServiceUrl = process.env.CONTENTS_SERVICE_URL || 'http://localhost:4000';

    registerActors(fastify, contentsServiceUrl);
    registerDirectors(fastify, contentsServiceUrl);
}

function registerActors(fastify: FastifyInstance, contentsServiceUrl: string) {
    interface Params {
        id: String
    }

    fastify.get('/actors', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/actors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data)
    });

    fastify.get<{ Params: Params }>('/actors/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/actors/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.post('/actors', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/actors`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/movies/:id/actors', async (request, reply) => {
        const id = request.params.id

        const res = await fetch(`${contentsServiceUrl}/movies/${id}/actors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    
      fastify.get<{ Params: Params }>('/shows/:id/actors', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}/actors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/actors/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/actors/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.delete<{ Params: Params }>('/actors/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/actors/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}

function registerDirectors(fastify: FastifyInstance, contentsServiceUrl: string) {
    interface Params {
        id: String
    }

    fastify.get('/directors', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/directors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data)
    });

    fastify.get<{ Params: Params }>('/directors/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/directors/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.post('/directors', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/directors`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/movies/:id/directors', async (request, reply) => {
        const id = request.params.id

        const res = await fetch(`${contentsServiceUrl}/movies/${id}/directors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    
      fastify.get<{ Params: Params }>('/shows/:id/directors', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}/directors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/directors/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/directors/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.delete<{ Params: Params }>('/directors/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/directors/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}
