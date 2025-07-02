import Fastify from 'fastify';
import jwtPlugin from './plugins/jwt';

const fastify = Fastify({ logger: true });

await fastify.register(jwtPlugin);

fastify.listen({ port: 30000 }, err => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});