import httpProxy from '@fastify/http-proxy';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function favouritesProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
      interface Params {
        id: string,
    }
    const favsServiceUrl = process.env.FAVOURITES_SERVICE_URL || 'http://localhost:7600'
    const contentsServiceUrl = process.env.CONTENTS_SERVICE_URL || 'http://localhost:8000/api';

    fastify.get<{ Params: Params }>('/favourites/user/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${favsServiceUrl}/api/favourites/user/${id}`, {
            method: 'GET',
        });

        const favourites = await res.json();

        const movieIds = Array.isArray(favourites)
            ? favourites
                .filter(fav => fav.movie_id && fav.movie_id !== 0)
                .map(fav => fav.movie_id)
            : [];
        const showIds = Array.isArray(favourites)
            ? favourites
                .filter(fav => fav.show_id && fav.show_id !== 0)
                .map(fav => fav.show_id)
            : [];


        const [movieRes, showRes] = await Promise.all([
            fetch(`${contentsServiceUrl}/movies/batch`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(movieIds),
            }),

            fetch(`${contentsServiceUrl}/shows/batch`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(showIds),
            }),
        ]);

        const movieData = await movieRes.json();
        const showData = await showRes.json();

        return reply.send({
            movies: movieData,
            shows: showData,
        });
    });


    fastify.get('/favourites/user/personal', { preHandler: [fastify.authenticate] },  async (request, reply) => {
        const sub = request.user.sub;

        const res = await fetch(`${favsServiceUrl}/api/favourites/user/${sub}`, {
            method: 'GET',
        });

        const favourites = await res.json();

        const movieIds = Array.isArray(favourites)
            ? favourites
                .filter(fav => fav.movie_id && fav.movie_id !== 0)
                .map(fav => fav.movie_id)
            : [];
        const showIds = Array.isArray(favourites)
            ? favourites
                .filter(fav => fav.show_id && fav.show_id !== 0)
                .map(fav => fav.show_id)
            : [];


        const [movieRes, showRes] = await Promise.all([
            fetch(`${contentsServiceUrl}/movies/batch`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(movieIds),
            }),

            fetch(`${contentsServiceUrl}/shows/batch`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(showIds),
            }),
        ]);

        const movieData = await movieRes.json();
        const showData = await showRes.json();

        return reply.send({
            movies: movieData,
            shows: showData,
        });
    });

    fastify.get<{ Params: Params }>('/favourites/user/personal/movie/:id' , { preHandler: [fastify.authenticate] },  async (request, reply) => {
        const sub = request.user.sub;
        const movieId = request.params.id;

        const res = await fetch(`${favsServiceUrl}/api/favourites/user/${sub}/movie/${movieId}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/favourites/user/personal/show/:id' , { preHandler: [fastify.authenticate] },  async (request, reply) => {
        const sub = request.user.sub;
        const showId = request.params.id;

        const res = await fetch(`${favsServiceUrl}/api/favourites/user/${sub}/show/${showId}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.register(httpProxy, {
        upstream: favsServiceUrl,
        prefix: '/favourites',
        rewritePrefix: '/api/favourites'
    });
}