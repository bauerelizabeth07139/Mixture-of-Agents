const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:3001';
const MAX_WAIT = 30000;

let mainWindow = null;

function waitForServer(url, timeout) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) resolve();
        else if (Date.now() - start > timeout) reject(new Error('Timeout'));
        else setTimeout(check, 500);
      }).on('error', () => {
        if (Date.now() - start > timeout) reject(new Error('Timeout'));
        else setTimeout(check, 500);
      });
    };
    check();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Mixture of Agents',
    icon: null,
    backgroundColor: '#0a0a0f',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(FRONTEND_URL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open external links in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http') && !url.includes('localhost')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  try {
    await waitForServer(FRONTEND_URL, MAX_WAIT);
    createWindow();
  } catch (e) {
    console.error('Frontend server not available:', e.message);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
