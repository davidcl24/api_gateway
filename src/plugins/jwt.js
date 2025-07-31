import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fp from 'fastify-plugin';


export default fp(
  async function jwtPlugin(fastify, opts) {
      const secret = process.env.SECRET_KEY || 'dev_key';

      fastify.register(fastifyJwt, {
          secret: secret,
          sign: { algorithm: 'HS256' },
      });

      fastify.register(fastifyCookie, {
          secret: secret,
          hook: "preHandler",
      });

      fastify.decorate("authenticate", async function (request, reply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        if (err.name === 'TokenExpiredError')
          reply.code(401).send({ error: 'Token expired' });

        if (err.name === 'JsonWebTokenError')
          reply.code(401).send({ error: 'JWT error: ' + err.message  });
      }
    });
  }
)
