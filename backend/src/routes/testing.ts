import { Router } from 'express';
import { ApiPoolManager } from '../providers/api-pool';
import { CapabilityTestEngine } from '../services/capability-test';

export function createTestingRoutes(pool: ApiPoolManager, wsBroadcast: Function) {
  const r = Router();
  r.get('/test-cases', (_req, res) => { res.json(CapabilityTestEngine.getTestCases()); });
  r.post('/:pid/models/:mid/test-full', async (req, res) => {
    const prov = pool.getProvider(req.params.pid); if (!prov) return res.status(404).json({ error: 'Not found' });
    const model = prov.models.find(m => m.id === req.params.mid); if (!model) return res.status(404).json({ error: 'Model not found' });
    const key = pool.getNextApiKey(prov.id); if (!key) return res.status(400).json({ error: 'No keys' });
    wsBroadcast('test_started', { modelId: model.modelId, providerName: prov.name });
    const report = await CapabilityTestEngine.runFullTest(prov, key, model);
    model.capabilities = report.capabilities;
    wsBroadcast('test_completed', { modelId: model.modelId, report });
    res.json(report);
  });
  r.post('/:pid/models/:mid/test-quick', async (req, res) => {
    const prov = pool.getProvider(req.params.pid); if (!prov) return res.status(404).json({ error: 'Not found' });
    const model = prov.models.find(m => m.id === req.params.mid); if (!model) return res.status(404).json({ error: 'Model not found' });
    const key = pool.getNextApiKey(prov.id); if (!key) return res.status(400).json({ error: 'No keys' });
    const report = await CapabilityTestEngine.runQuickTest(prov, key, model);
    model.capabilities = report.capabilities;
    res.json(report);
  });
  r.post('/:pid/models/:mid/test-multimodal', async (req, res) => {
    const prov = pool.getProvider(req.params.pid); if (!prov) return res.status(404).json({ error: 'Not found' });
    const model = prov.models.find(m => m.id === req.params.mid); if (!model) return res.status(404).json({ error: 'Model not found' });
    const key = pool.getNextApiKey(prov.id); if (!key) return res.status(400).json({ error: 'No keys' });
    const imageUrl = req.body.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg';
    res.json(await CapabilityTestEngine.testMultimodal(prov, key, model, imageUrl));
  });
  return r;
}
