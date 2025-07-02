import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '../prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

// Fetch all curriculum subjects
app.get('/subjects', async (req, res) => {
  const subjects = await prisma.curriculumSubject.findMany({
    select: { id: true, name: true, grade: true, description: true, imageUrl: true },
  });
  res.json(subjects);
});

// Fetch topics for a given subject
app.get('/subjects/:subjectId/topics', async (req, res) => {
  const schema = z.object({ subjectId: z.string().regex(/^[0-9]+$/) });
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
  const schema = z.object({ topicId: z.string().regex(/^[0-9]+$/) });
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
  const schema = z.object({ lessonId: z.string().regex(/^[0-9]+$/) });
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
