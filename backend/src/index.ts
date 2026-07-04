import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { ApiPoolManager } from './providers/api-pool';
import { ProjectManager } from './services/project-manager';
import { WSManager } from './services/ws-manager';
import { createProviderRoutes } from './routes/providers';
import { createProjectRoutes } from './routes/projects';
import { createModelRoutes } from './routes/models';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
app.use(cors());
app.use(express.json());

const poolManager = new ApiPoolManager();
const projectManager = new ProjectManager();
const wsManager = new WSManager();
wss.on('connection', (ws) => { wsManager.addClient(ws); });

app.use('/api/providers', createProviderRoutes(poolManager));
app.use('/api/projects', createProjectRoutes(projectManager, poolManager, wsManager.broadcast.bind(wsManager)));
app.use('/api/models', createModelRoutes(poolManager));
app.get('/api/health', (_req, res) => { res.json({ status: 'ok', providers: poolManager.getAllProviders().length }); });

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => { console.log('MoA backend on port ' + PORT); });
