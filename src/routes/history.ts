/**
 * @module routes/history
 */
import httpProxy from '@fastify/http-proxy';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

/**
 * @function historyProxy
 * @memberof module:routes/history
 * @summary It proxies the requests that come from the client to the history microservice
 * @param fastify The fastify instance
 * @param opts The options for the fastify plugin
 */
export default async function historyProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
      interface Params {
        id: string,
    }
    const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:7500'
    const contentsServiceUrl = process.env.CONTENTS_SERVICE_URL || 'http://localhost:8000/api';

    /**
     * @name GET /history/user/personal
     * @function
     * @memberof module:routes/history
     * @summary It retrieves from the microservice every element from the history of the user who made the request
     */
    fastify.get('/history/user/personal', { preHandler: [fastify.authenticate] }, async(request, reply) => {
        const sub = request.user.sub;

        const res = await fetch(`${historyServiceUrl}/api/history/user/${sub}`, {
            method: 'GET',
        });

        const data = await res.json();
        return reply.send(data);
    });

fastify.get('/history/user/personal/contents', { preHandler: [fastify.authenticate] },  async (request, reply) => {
        const sub = request.user.sub;

        const res = await fetch(`${historyServiceUrl}/api/history/user/${sub}`, {
            method: 'GET',
        });

        const history = await res.json();

        const movieIds = Array.isArray(history)
            ? history
                .sort((elementA, elementB) => {
                    const dateA = new Date(elementA.watch_date!).getTime();
                    const dateB = new Date(elementB.watch_date!).getTime();
                    return dateA - dateB;
                }).reverse()
                .filter(element => element.movie_id && element.movie_id !== 0)
                .map(fav => fav.movie_id)
            : [];

        const [movieRes] = await Promise.all([
            fetch(`${contentsServiceUrl}/movies/batch`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(movieIds),
            }),
        ]);

        const movieData: any = await movieRes.json();

        let orderedMovieData = [];
        if (movieIds) {
            orderedMovieData = [...movieData].sort((a, b) => {
                const indexA = movieIds.indexOf(a.id);
                const indexB = movieIds.indexOf(b.id);

                return indexA - indexB;
            });
        }
            
        return reply.send({
            movies: orderedMovieData
        });
    });

    /**
     * @name GET /history/user/personal/movie/:id
     * @function
     * @memberof module:routes/history
     * @summary It retrieves from the microservice a history element from the history of the user who made the request by a specific movie
     */
    fastify.get<{ Params: Params }>('/history/user/personal/movie/:id', { preHandler: [fastify.authenticate] }, async(request, reply) => {
        const sub = request.user.sub;
        const movieId = request.params.id;

        const res = await fetch(`${historyServiceUrl}/api/history/user/${sub}/movie/${movieId}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data)
    });

    /**
     * @name GET /history/user/personal/episode/:id
     * @function
     * @memberof module:routes/history
     * @summary It retrieves from the microservice a history element from the history of the user who made the request by a specific episode
     */
    fastify.get<{ Params: Params }>('/history/user/personal/episode/:id', { preHandler: [fastify.authenticate] }, async(request, reply) => {
        const sub = request.user.sub;
        const showId = request.params.id;

        const res = await fetch(`${historyServiceUrl}/api/history/user/${sub}/episode/${showId}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data)
    });

    /**
     * @name POST /history/new
     * @function
     * @memberof module:routes/history
     * @summary It calls the microservice to create a new history element for the user who made the request
     */
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

    /**
     * @name register
     * @function
     * @memberof module:routes/history
     * It proxies the rest of the routes
     */
    fastify.register(httpProxy, {
        upstream: historyServiceUrl,
        prefix: '/history',
        rewritePrefix: '/api/history'
    });
}