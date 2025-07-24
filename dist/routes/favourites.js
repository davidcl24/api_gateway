import httpProxy from '@fastify/http-proxy';
export default async function favouritesProxy(fastify, opts) {
    const favsServiceUrl = process.env.FAVOURITES_SERVICE_URL || 'http://localhost:4000';
    const contentsServiceUrl = process.env.CONTENTS_SERVICE_URL || 'http://localhost:4000';
    fastify.get('/favourites/user/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${favsServiceUrl}/favourites/user/${id}`, {
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
    fastify.register(httpProxy, {
        upstream: favsServiceUrl,
        prefix: '/favourites',
        rewritePrefix: '/favourites',
    });
}
