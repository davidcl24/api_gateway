import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import  multipart from '@fastify/multipart';
import fs from 'fs';
import path from 'path';
import { Queue } from 'bullmq';

export default async function contentsProxy(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const contentsServiceUrl = process.env.CONTENTS_SERVICE_URL || 'http://localhost:8000/api';

    const queue = new Queue('video-queue', {
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(String(process.env.REDIS_PORT)) || 6379,
        },
    });

     fastify.register(multipart, {
        limits: {
            fileSize: 1000 * 1024 * 1024
        }
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
        id: string
    }

    fastify.get('/actors', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/actors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data)
    });

    fastify.get<{ Params: Params }>('/actors/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/actors/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.post('/actors', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

    fastify.get<{ Params: Params }>('/movies/:id/actors', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id

        const res = await fetch(`${contentsServiceUrl}/movies/${id}/actors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    
      fastify.get<{ Params: Params }>('/shows/:id/actors', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}/actors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/actors/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

    fastify.delete<{ Params: Params }>('/actors/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
        id: string
    }

    fastify.get('/directors', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/directors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data)
    });

    fastify.get<{ Params: Params }>('/directors/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/directors/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.post('/directors', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

    fastify.get<{ Params: Params }>('/movies/:id/directors', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id

        const res = await fetch(`${contentsServiceUrl}/movies/${id}/directors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    
      fastify.get<{ Params: Params }>('/shows/:id/directors', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}/directors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/directors/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

    fastify.delete<{ Params: Params }>('/directors/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
        id: string
    }

    fastify.get('/genres', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/genres`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/genres/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/genres/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.post('/genres', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

    fastify.patch<{ Params: Params }>('/genres/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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

    fastify.delete<{ Params: Params }>('/genres/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
        id: string
    }

    fastify.post('/movies', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};
        let videoFileBuffer = null;
        let videoFileName = null;

        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            } else if (part.fieldname != 'url') {
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

        try {
            await queue.add('ffmpeg-conversion', {
                'inputPath': filePath,
                'outputFolder': `/uploads/hls/movies/${fileKey}`,
                'resolutions': [1080, 720, 480],
                'fileKey': fileKey
            }, 
            {
                removeOnComplete: true,
                removeOnFail: false,
            });
        } catch (error) {
            fastify.log.error('Failed to enqueue job', error);
            return reply.code(500).send({ error: 'Failed to enqueue video conversion job.' });
        }
      

        const movieData = {
            ...metadata,
            genre_id: metadata.genre_id ? parseInt(metadata.genre_id, 10) : null,
            directors_ids: ([] as string[]).concat(metadata.directors_ids).map(id => parseInt(id, 10)).filter(n => !isNaN(n)),
            actors_ids: ([] as string[]).concat(metadata.actors_ids).map(id => parseInt(id, 10)).filter(n => !isNaN(n)),
            rating: metadata.rating ? parseFloat(metadata.rating) : null,
            release_date: metadata.release_date ? metadata.release_date : null,
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

    fastify.get('/movies', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/movies/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/movies/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/movies/:id/extended', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/movies/${id}/extended`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/genres/:id/movies', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/genres/${id}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/actors/:id/movies', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/actors/${id}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/directors/:id/movies', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/directors/${id}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    
    fastify.patch<{ Params: Params }>('/movies/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};
        let videoFileBuffer = null;
        let videoFileName = null;

        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            } else if (part.fieldname != 'url') {
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
            genre_id: metadata.genre_id ? parseInt(metadata.genre_id, 10) : null,
            directors_ids: ([] as string[]).concat(metadata.directors_ids).map(id => parseInt(id, 10)).filter(n => !isNaN(n)),
            actors_ids: ([] as string[]).concat(metadata.actors_ids).map(id => parseInt(id, 10)).filter(n => !isNaN(n)),
            rating: metadata.rating ? parseFloat(metadata.rating) : null,
            release_date: metadata.release_date ? metadata.release_date : null,
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

    fastify.delete<{ Params: Params }>('/movies/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
        id: string
    }

    fastify.post('/shows', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};

        for await (const part of parts) {
            if (part.type === 'field' && part.fieldname != 'url') {
                metadata[part.fieldname] = part.value;
            }
        };

        const showData = {
            ...metadata,
            seasons_num: metadata.seasons_num ? parseInt(metadata.seasons_num, 10) : null,
            genre_id: metadata.genre_id ? parseInt(metadata.genre_id, 10) : null,
            directors_ids: ([] as string[]).concat(metadata.directors_ids).map(id => parseInt(id, 10)).filter(n => !isNaN(n)),
            actors_ids: ([] as string[]).concat(metadata.actors_ids).map(id => parseInt(id, 10)).filter(n => !isNaN(n)),
            rating: metadata.rating ? parseFloat(metadata.rating) : null,
            release_date: metadata.release_date ? metadata.release_date : null
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

    fastify.get('/shows', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/shows/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/shows/:id/extended', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}/extended`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/genres/:id/shows', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/genres/${id}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/actors/:id/shows', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/actors/${id}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get<{ Params: Params }>('/directors/:id/shows', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/directors/${id}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/shows/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};

        for await (const part of parts) {
            if (part.type === 'field' && part.fieldname != 'url') {
                metadata[part.fieldname] = part.value;
            }
        };

        const showData = {
            ...metadata,
            seasons_num: metadata.seasons_num ? parseInt(metadata.seasons_num, 10) : null,
            genre_id: metadata.genre_id ? parseInt(metadata.genre_id, 10) : null,
            directors_ids: ([] as string[]).concat(metadata.directors_ids).map(id => parseInt(id, 10)).filter(n => !isNaN(n)),
            actors_ids: ([] as string[]).concat(metadata.actors_ids).map(id => parseInt(id, 10)).filter(n => !isNaN(n)),
            rating: metadata.rating ? parseFloat(metadata.rating) : null,
            release_date: metadata.release_date ? metadata.release_date : null
        }

        console.log(showData);

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
        id: string,
        seasonNum: string
    }
    fastify.post('/episodes', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};
        let videoFileBuffer = null;
        let videoFileName = null;


        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            } else if (part.fieldname != 'url') {
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
            'output_folder': `/uploads/hls/shows/${metadata['show_id']}/${metadata['season_num']}/${fileKey}`,
            'resolutions': [1080, 720, 480],
            'file_key': fileKey
        });

        const episodeData = {
            ...metadata,
            season_num: metadata.season_num ? parseInt(metadata.season_num, 10) : null,
            episode_num: metadata.episode_num ? parseInt(metadata.episode_num, 10) : null,
            release_date: metadata.release_date ? metadata.release_date : null,
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

    fastify.get<{ Params: Params }>('/shows/:id/episodes', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}/episodes`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/shows/:id/:seasonNum/episodes', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;
        const seasonNum = request.params.seasonNum;

        const res = await fetch(`${contentsServiceUrl}/shows/${id}/${seasonNum}/episodes`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.get<{ Params: Params }>('/episodes/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/episodes/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });

    fastify.patch<{ Params: Params }>('/episodes/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;
        const parts = request.parts();
        const metadata: { [key: string]: any } = {};
        let videoFileBuffer = null;
        let videoFileName = null;


        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            } else if (part.fieldname != 'url') {
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
            'output_folder': `/uploads/hls/shows/${metadata['show_id']}/${metadata['season_num']}/${fileKey}`,
            'resolutions': [1080, 720, 480],
            'file_key': fileKey
        });

        const episodeData = {
            ...metadata,
            season_num: metadata.season_num ? parseInt(metadata.season_num, 10) : null,
            episode_num: metadata.episode_num ? parseInt(metadata.episode_num, 10) : null,
            release_date: metadata.release_date ? metadata.release_date : null,
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

    fastify.delete<{ Params: Params }>('/episodes/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const id = request.params.id;

        const res = await fetch(`${contentsServiceUrl}/episodes/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}