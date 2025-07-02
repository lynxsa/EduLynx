"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const client_1 = require("../prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
// Create assessment
app.post('/assessments', async (req, res) => {
    const schema = zod_1.z.object({
        courseId: zod_1.z.number(), // required
        title: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        totalMarks: zod_1.z.number(),
    });
    const parse = schema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.message });
    // Explicitly destructure to ensure all required fields are present
    const { courseId, title, description, totalMarks } = parse.data;
    const assessment = await prisma.assessment.create({
        data: { courseId, title, description, totalMarks },
    });
    res.status(201).json(assessment);
});
// Record result
app.post('/assessments/:id/results', async (req, res) => {
    const paramsSchema = zod_1.z.object({ id: zod_1.z.string().regex(/^[0-9]+$/) });
    const bodySchema = zod_1.z.object({ studentId: zod_1.z.string(), score: zod_1.z.number() });
    const paramParse = paramsSchema.safeParse(req.params);
    if (!paramParse.success)
        return res.status(400).json({ error: 'Invalid assessment id' });
    const id = Number(paramParse.data.id);
    const bodyParse = bodySchema.safeParse(req.body);
    if (!bodyParse.success)
        return res.status(400).json({ error: bodyParse.error.message });
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
    const schema = zod_1.z.object({ id: zod_1.z.string().regex(/^[0-9]+$/) });
    const parse = schema.safeParse(req.params);
    if (!parse.success)
        return res.status(400).json({ error: 'Invalid id' });
    const id = Number(parse.data.id);
    const results = await prisma.result.findMany({ where: { assessmentId: id } });
    res.json(results);
});
// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Assessment service running on port ${port}`));
//# sourceMappingURL=index.js.map