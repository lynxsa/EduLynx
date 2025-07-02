import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '../prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

// Create assessment
app.post('/assessments', async (req, res) => {
  const schema = z.object({
    courseId: z.number(), // required
    title: z.string(),
    description: z.string().optional(),
    totalMarks: z.number(),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.message });
  // Explicitly destructure to ensure all required fields are present
  const { courseId, title, description, totalMarks } = parse.data;
  const assessment = await prisma.assessment.create({
    data: { courseId, title, description, totalMarks },
  });
  res.status(201).json(assessment);
});

// Record result
app.post('/assessments/:id/results', async (req, res) => {
  const paramsSchema = z.object({ id: z.string().regex(/^[0-9]+$/) });
  const bodySchema = z.object({ studentId: z.string(), score: z.number() });
  const paramParse = paramsSchema.safeParse(req.params);
  if (!paramParse.success) return res.status(400).json({ error: 'Invalid assessment id' });
  const id = Number(paramParse.data.id);
  const bodyParse = bodySchema.safeParse(req.body);
  if (!bodyParse.success) return res.status(400).json({ error: bodyParse.error.message });
  const { studentId, score } = bodyParse.data;
  // Use the correct structure for ResultCreateInput
  const result = await prisma.result.create({
    data: {
      assessment: { connect: { id } },
      studentId,
      score,
    },
  });
  res.status(201).json(result);
});

// Get assessment results
app.get('/assessments/:id/results', async (req, res) => {
  const schema = z.object({ id: z.string().regex(/^[0-9]+$/) });
  const parse = schema.safeParse(req.params);
  if (!parse.success) return res.status(400).json({ error: 'Invalid id' });
  const id = Number(parse.data.id);
  const results = await prisma.result.findMany({ where: { assessmentId: id } });
  res.json(results);
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Assessment service running on port ${port}`));
