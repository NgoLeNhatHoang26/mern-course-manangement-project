import { Router } from 'express';
import { getHealthReport } from '../services/health.service.js';

const router = Router();

router.get('/', async (_req, res) => {
    const { report, isHealthy } = await getHealthReport();
    res.status(isHealthy ? 200 : 503).json({ success: true, data: report });
});

export default router;
