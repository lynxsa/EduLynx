"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const client_1 = require("../prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Fetch all curriculum subjects
app.get('/subjects', async (req, res) => {
    const subjects = await prisma.curriculumSubject.findMany({
        select: { id: true, name: true, grade: true, description: true, imageUrl: true },
    });
    res.json(subjects);
});
// Fetch topics for a given subject
app.get('/subjects/:subjectId/topics', async (req, res) => {
    const schema = zod_1.z.object({ subjectId: zod_1.z.string().regex(/^[0-9]+$/) });
    const parse = schema.safeParse(req.params);
    if (!parse.success) {
        return res.status(400).json({ error: 'Invalid subjectId' });
    }
    const id = Number(parse.data.subjectId);
    const topics = await prisma.topic.findMany({
        where: { subjectId: id },
        select: { id: true, title: true, description: true, orderIndex: true },
    });
    res.json(topics);
});
// Fetch lessons for a given topic
app.get('/topics/:topicId/lessons', async (req, res) => {
    const schema = zod_1.z.object({ topicId: zod_1.z.string().regex(/^[0-9]+$/) });
    const parse = schema.safeParse(req.params);
    if (!parse.success) {
        return res.status(400).json({ error: 'Invalid topicId' });
    }
    const id = Number(parse.data.topicId);
    const lessons = await prisma.lesson.findMany({
        where: { topicId: id },
        select: { id: true, title: true, duration: true, difficulty: true, videoUrl: true },
    });
    res.json(lessons);
});
// Fetch detail for a single lesson
app.get('/lessons/:lessonId', async (req, res) => {
    const schema = zod_1.z.object({ lessonId: zod_1.z.string().regex(/^[0-9]+$/) });
    const parse = schema.safeParse(req.params);
    if (!parse.success) {
        return res.status(400).json({ error: 'Invalid lessonId' });
    }
    const id = Number(parse.data.lessonId);
    const lesson = await prisma.lesson.findUnique({
        where: { id },
        select: { title: true, content: true, videoUrl: true, duration: true, difficulty: true },
    });
    if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Curriculum service running on port ${port}`);
});
