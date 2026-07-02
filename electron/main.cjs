/**
 * Electron Main Process
 * ---------------------
 * This file serves as the backend entry point for the desktop executable.
 * It is responsible for creating the native OS window, managing the application lifecycle,
 * and loading the compiled Vite frontend (dist/index.html).
 * 
 * Important: webSecurity is set to false to allow the app to fetch local JSON blueprints
 * using the file:// protocol.
 */
const { app, BrowserWindow, Menu, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');

// The dist folder is always located next to this main.cjs file
const DIST_DIR = path.join(__dirname, '../dist');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Allow loading local file:// resources from fetch() calls
      webSecurity: false,
    }
  });

  // Remove default application menu to make it feel like a real app
  Menu.setApplicationMenu(null);

  // Load the index.html from the dist folder
  win.loadFile(path.join(DIST_DIR, 'index.html'));

  // Uncomment this line to open DevTools for debugging on Windows:
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
