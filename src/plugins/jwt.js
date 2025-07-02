
export default async function jwtPlugin(fastify, opts) {
    fastify.register(import('@fastify/jwt'), {
        secret: process.env.SECRET_KEY || 'dev_key'
    });

    fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Token inválido o ausente' });
    }
  });
}