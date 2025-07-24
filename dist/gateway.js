import Fastify from 'fastify';
import jwtPlugin from './plugins/jwt.js';
import favouritesProxy from './routes/favourites.js';
import historyProxy from './routes/history.js';
import usersProxy from './routes/users.js';
import contentsProxy from './routes/contents.js';
const fastify = Fastify({ logger: true });
await fastify.register(jwtPlugin);
fastify.addHook('onReady', async () => {
    if (!fastify.authenticate) {
        throw new Error('Authentication decorator not registered!');
    }
});
await fastify.register(async (instance, opts) => {
    instance.register(favouritesProxy);
    instance.register(historyProxy);
    instance.register(usersProxy);
    instance.register(contentsProxy);
});
fastify.listen({ port: 30000 }, err => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
