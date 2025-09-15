import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string
      username?: string
      email?: string
      role: string
      type: 'access' | 'refresh'
    }
    user: {
      sub: string
      username?: string
      email?: string
      role: string
      type: 'access' | 'refresh'
    }
  }
}