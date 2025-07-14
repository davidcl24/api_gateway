import Fastify from 'fastify';
import jwtPlugin from './plugins/jwt';
import favouritesProxy from './routes/favourites';
import historyProxy from './routes/history';
import usersProxy from './routes/users';
import contentsProxy from './routes/contents';

const fastify = Fastify({ logger: true });

await fastify.register(jwtPlugin);
await fastify.register(favouritesProxy);
await fastify.register(historyProxy);
await fastify.register(usersProxy);
await fastify.register(contentsProxy);


fastify.listen({ port: 30000 }, err => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});