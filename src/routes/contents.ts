import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import  multipart from '@fastify/multipart';
import fs from 'fs';
import path from 'path';
import { Queue } from 'bullmq';

export default async function contentsProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const contentsServiceUrl = process.env.CONTENTS_SERVICE_URL || 'http://localhost:4000/api';

    const queue = new Queue('video-queue', {
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(String(process.env.REDIS_PORT)) || 6379,
        },
    });

    registerActors(fastify, contentsServiceUrl);
    registerDirectors(fastify, contentsServiceUrl);
    registerGenres(fastify, contentsServiceUrl);
    registerMovies(fastify, contentsServiceUrl, queue);
    registerShows(fastify, contentsServiceUrl);
    registerEpisodes(fastify, contentsServiceUrl, queue);
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

function registerGenres(fastify: FastifyInstance, contentsServiceUrl: string) {
    interface Params {
        id: String
    }

    fastify.get('/genres', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/genres`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/genres/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/genres/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.post('/genres', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/genres`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/genres/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/genres/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(request.body),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.delete<{ Params: Params }>('/genres/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/genres/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}

function registerMovies(fastify: FastifyInstance, contentsServiceUrl: string, queue: Queue) {
    interface Params {
        id: String
    }

    fastify.post('/movies', async (request, reply) => {
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};
        let videoFileBuffer = null;
        let videoFileName = null;

        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            } else {
                metadata[part.fieldname] = part.value;
            }
        };

        if (!videoFileBuffer || !videoFileName) {
            return reply.code(400).send({ error: 'Missing file' });
        }

        const fileKey = `${Date.now()}_${videoFileName}`;
        const dirPath = path.join('/uploads/raw/movies');
        const filePath = path.join(dirPath, fileKey);

        await fs.promises.mkdir(dirPath, { recursive: true });
        await fs.promises.writeFile(filePath, videoFileBuffer);

        await queue.add('ffmpeg-conversion', {
            'input_path': filePath,
            'output_folder': `/uploads/hls/movies/${fileKey}`,
            'resolutions': [1080, 720, 480],
            'file_key': fileKey
        });

        const movieData = {
            ...metadata,
            file_key: fileKey,
        }

        const res = await fetch(`${contentsServiceUrl}/movies`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(movieData),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get('/movies', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/movies/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/movies/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/genres/:id/movies', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/genres/${id}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/actors/:id/movies', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/actors/${id}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/directors/:id/movies', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/directors/${id}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    
    fastify.patch<{ Params: Params }>('/movies/:id', async (request, reply) => {
        const id = request.params.id;
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};
        let videoFileBuffer = null;
        let videoFileName = null;

        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            } else {
                metadata[part.fieldname] = part.value;
            }
        };

        if (!videoFileBuffer || !videoFileName) {
            return reply.code(400).send({ error: 'Missing file' });
        }
        
        const fileKey = `${Date.now()}_${videoFileName}`;
        const dirPath = path.join('/uploads/raw/movies');
        const filePath = path.join(dirPath, fileKey)

        await fs.promises.mkdir(dirPath, { recursive: true });
        await fs.promises.writeFile(filePath, videoFileBuffer);

        await queue.add('ffmpeg-conversion', {
            'input_path': filePath,
            'output_folder': `/uploads/hls/movies/${fileKey}`,
            'resolutions': [1080, 720, 480],
            'file_key': fileKey
        });

        const movieData = {
            ...metadata,
            file_key: fileKey,
        }

        const res = await fetch(`${contentsServiceUrl}/movies/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(movieData),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.delete<{ Params: Params }>('/movies/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/movies/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}

function registerShows(fastify: FastifyInstance, contentsServiceUrl: string){
     interface Params {
        id: String
    }

    fastify.post('/shows', async (request, reply) => {
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};

        for await (const part of parts) {
            if (part.type === 'field') {
                metadata[part.fieldname] = part.value;
            }
        };

        const showData = {
            ...metadata,
        }
        
        const res = await fetch(`${contentsServiceUrl}/shows`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(showData),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get('/shows', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/shows/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/genres/:id/shows', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/genres/${id}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/actors/:id/shows', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/actors/${id}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get<{ Params: Params }>('/directors/:id/shows', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/directors/${id}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/shows/:id', async (request, reply) => {
        const id = request.params.id;
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};

        for await (const part of parts) {
            if (part.type === 'field') {
                metadata[part.fieldname] = part.value;
            }
        };

        const showData = {
            ...metadata,
        }

        const res = await fetch(`${contentsServiceUrl}/shows/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(showData),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.delete<{ Params: Params }>('/shows/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}

function registerEpisodes(fastify: FastifyInstance, contentsServiceUrl: string, queue: Queue){
      interface Params {
        id: String,
        seasonNum: String
    }
    fastify.post('/episodes', async (request, reply) => {
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};
        let videoFileBuffer = null;
        let videoFileName = null;


        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            } else {
                metadata[part.fieldname] = part.value;
            }
        }

        if (!videoFileBuffer || !videoFileName) {
            return reply.code(400).send({ error: 'Missing file' });
        }
        
        const fileKey = `${Date.now()}_${videoFileName}`;
        const dirPath = path.join(`/uploads/raw/shows/${metadata['show_id']}/${metadata['season_num']}`);
        const filePath = path.join(dirPath, fileKey);

        await fs.promises.mkdir(dirPath, { recursive: true });
        await fs.promises.writeFile(filePath, videoFileBuffer);

        await queue.add('ffmpeg-conversion', {
            'input_path': filePath,
            'output_folder': `/uploads/hls/shows/${metadata['show_id']}/${metadata['season_num']}`,
            'resolutions': [1080, 720, 480],
            'file_key': fileKey
        });

        const episodeData = {
            ...metadata,
            file_key: fileKey,
        }

        const res = await fetch(`${contentsServiceUrl}/episodes`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(episodeData),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/shows/:id/episodes', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}/episodes`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/shows/:id/:seasonNum/episodes', async (request, reply) => {
        const id = request.params.id;
        const seasonNum = request.params.seasonNum;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}/${seasonNum}/episodes`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/episodes/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/episodes/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/episodes/:id', async (request, reply) => {
        const id = request.params.id;
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};
        let videoFileBuffer = null;
        let videoFileName = null;


        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            } else {
                metadata[part.fieldname] = part.value;
            }
        }

        if (!videoFileBuffer || !videoFileName) {
            return reply.code(400).send({ error: 'Missing file' });
        }
        
        const fileKey = `${Date.now()}_${videoFileName}`;
        const dirPath = path.join(`/uploads/raw/shows/${metadata['show_id']}/${metadata['season_num']}`);
        const filePath = path.join(dirPath, fileKey);

        await fs.promises.mkdir(dirPath, { recursive: true });
        await fs.promises.writeFile(filePath, videoFileBuffer);

        await queue.add('ffmpeg-conversion', {
            'input_path': filePath,
            'output_folder': `/uploads/hls/shows/${metadata['show_id']}/${metadata['season_num']}`,
            'resolutions': [1080, 720, 480],
            'file_key': fileKey
        });

        const episodeData = {
            ...metadata,
            file_key: fileKey,
        }

        const res = await fetch(`${contentsServiceUrl}/episodes/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(episodeData),
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.delete<{ Params: Params }>('/episodes/:id', async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/episodes/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}