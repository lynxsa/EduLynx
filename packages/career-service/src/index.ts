import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '../prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

// Create or update career profile
app.post('/profiles', async (req, res) => {
  const schema = z.object({
    userId: z.string(),
    interest: z.string(),
    skills: z.array(z.string()),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.message });
  const { userId, interest, skills } = parse.data;
  const profile = await prisma.careerProfile.upsert({
    where: { userId },
    update: { interest, skills },
    create: { userId, interest, skills, recommended: [] },
  });
  res.json(profile);
});

// Get career recommendations
app.get('/profiles/:userId/recommendations', async (req, res) => {
  const schema = z.object({ userId: z.string() });
  const parse = schema.safeParse(req.params);
  if (!parse.success) return res.status(400).json({ error: 'Invalid userId' });
  const profile = await prisma.careerProfile.findUnique({ where: { userId: parse.data.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile.recommended);
});

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4002;
app.listen(port, () => console.log(`Career service running on port ${port}`));
