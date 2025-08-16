import multipart from '@fastify/multipart';
import fs from 'fs';
import path from 'path';
import { Queue } from 'bullmq';
export default async function contentsProxy(fastify, opts) {
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
function registerActors(fastify, contentsServiceUrl) {
    fastify.get('/actors', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/actors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/actors/:id', async (request, reply) => {
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
    fastify.get('/movies/:id/actors', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/movies/${id}/actors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/shows/:id/actors', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/shows/${id}/actors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.patch('/actors/:id', async (request, reply) => {
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
    fastify.delete('/actors/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/actors/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}
function registerDirectors(fastify, contentsServiceUrl) {
    fastify.get('/directors', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/directors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/directors/:id', async (request, reply) => {
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
    fastify.get('/movies/:id/directors', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/movies/${id}/directors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/shows/:id/directors', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/shows/${id}/directors`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.patch('/directors/:id', async (request, reply) => {
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
    fastify.delete('/directors/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/directors/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}
function registerGenres(fastify, contentsServiceUrl) {
    fastify.get('/genres', async (request, reply) => {
        const res = await fetch(`${contentsServiceUrl}/genres`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/genres/:id', async (request, reply) => {
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
    fastify.patch('/genres/:id', async (request, reply) => {
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
    fastify.delete('/genres/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/genres/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}
function registerMovies(fastify, contentsServiceUrl, queue) {
    fastify.post('/movies', async (request, reply) => {
        const parts = request.parts();
        const metadata = {};
        let videoFileBuffer = null;
        let videoFileName = null;
        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            }
            else {
                metadata[part.fieldname] = part.value;
            }
        }
        ;
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
            }, {
                removeOnComplete: true,
                removeOnFail: false,
            });
        }
        catch (error) {
            fastify.log.error('Failed to enqueue job', error);
            return reply.code(500).send({ error: 'Failed to enqueue video conversion job.' });
        }
        const movieData = {
            ...metadata,
            file_key: fileKey,
        };
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
    fastify.get('/movies/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/movies/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/genres/:id/movies', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/genres/${id}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/actors/:id/movies', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/actors/${id}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/directors/:id/movies', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/directors/${id}/movies`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.patch('/movies/:id', async (request, reply) => {
        const id = request.params.id;
        const parts = request.parts();
        const metadata = {};
        let videoFileBuffer = null;
        let videoFileName = null;
        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            }
            else {
                metadata[part.fieldname] = part.value;
            }
        }
        ;
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
        };
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
    fastify.delete('/movies/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/movies/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}
function registerShows(fastify, contentsServiceUrl) {
    fastify.post('/shows', async (request, reply) => {
        const parts = request.parts();
        const metadata = {};
        for await (const part of parts) {
            if (part.type === 'field') {
                metadata[part.fieldname] = part.value;
            }
        }
        ;
        const showData = {
            ...metadata,
        };
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
    fastify.get('/shows/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/shows/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/genres/:id/shows', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/genres/${id}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/actors/:id/shows', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/actors/${id}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/directors/:id/shows', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/directors/${id}/shows`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.patch('/shows/:id', async (request, reply) => {
        const id = request.params.id;
        const parts = request.parts();
        const metadata = {};
        for await (const part of parts) {
            if (part.type === 'field') {
                metadata[part.fieldname] = part.value;
            }
        }
        ;
        const showData = {
            ...metadata,
        };
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
    fastify.delete('/shows/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/shows/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}
function registerEpisodes(fastify, contentsServiceUrl, queue) {
    fastify.post('/episodes', async (request, reply) => {
        const parts = request.parts();
        const metadata = {};
        let videoFileBuffer = null;
        let videoFileName = null;
        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            }
            else {
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
        };
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
    fastify.get('/shows/:id/episodes', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/shows/${id}/episodes`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/shows/:id/:seasonNum/episodes', async (request, reply) => {
        const id = request.params.id;
        const seasonNum = request.params.seasonNum;
        const res = await fetch(`${contentsServiceUrl}/shows/${id}/${seasonNum}/episodes`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.get('/episodes/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/episodes/${id}`, {
            method: 'GET',
        });
        const data = await res.json();
        return reply.send(data);
    });
    fastify.patch('/episodes/:id', async (request, reply) => {
        const id = request.params.id;
        const parts = request.parts();
        const metadata = {};
        let videoFileBuffer = null;
        let videoFileName = null;
        for await (const part of parts) {
            if (part.type === 'file') {
                videoFileName = part.filename;
                videoFileBuffer = await part.toBuffer();
            }
            else {
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
        };
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
    fastify.delete('/episodes/:id', async (request, reply) => {
        const id = request.params.id;
        const res = await fetch(`${contentsServiceUrl}/episodes/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return reply.send(data);
    });
}
