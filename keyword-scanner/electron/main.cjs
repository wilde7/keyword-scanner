const { app, BrowserWindow, dialog, Menu } = require("electron");
const { spawn } = require("child_process");
const http = require("http");
const net = require("net");
const path = require("path");

let mainWindow;
let backendProcess;
let isQuitting = false;

function reservePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

function requestHealth(port) {
  return new Promise((resolve) => {
    const request = http.get(`http://127.0.0.1:${port}/api/health`, (response) => { response.resume(); resolve(response.statusCode === 200); });
    request.on("error", () => resolve(false));
    request.setTimeout(700, () => { request.destroy(); resolve(false); });
  });
}

async function waitForBackend(port) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await requestHealth(port)) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("本地扫描引擎启动超时");
}

function backendCommand(port) {
  if (app.isPackaged) return { command: path.join(process.resourcesPath, "backend", "keyword-scanner-api", "keyword-scanner-api.exe"), args: ["--port", String(port)] };
  const python = process.platform === "win32" ? path.join(app.getAppPath(), "backend", ".venv", "Scripts", "python.exe") : path.join(app.getAppPath(), "backend", ".venv", "bin", "python");
  return { command: python, args: [path.join(app.getAppPath(), "backend", "desktop_entry.py"), "--port", String(port)] };
}

async function startBackend() {
  const port = await reservePort();
  const { command, args } = backendCommand(port);
  backendProcess = spawn(command, args, { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  backendProcess.on("error", (error) => { if (!isQuitting) dialog.showErrorBox("启动失败", `无法启动本地扫描引擎：${error.message}`); });
  await waitForBackend(port);
  return `http://127.0.0.1:${port}`;
}

function createWindow(apiBaseUrl) {
  mainWindow = new BrowserWindow({ width: 1440, height: 920, minWidth: 1080, minHeight: 720, title: "关键词检索器", webPreferences: { preload: path.join(__dirname, "preload.cjs"), contextIsolation: true, nodeIntegration: false, additionalArguments: [`--keyword-scanner-api=${apiBaseUrl}`] } });
  mainWindow.loadFile(path.join(app.getAppPath(), "dist", "desktop", "index.html"));
}

function stopBackend() {
  if (!backendProcess || backendProcess.killed) return;
  if (process.platform === "win32") spawn("taskkill", ["/pid", String(backendProcess.pid), "/f", "/t"]);
  else backendProcess.kill("SIGTERM");
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  try { createWindow(await startBackend()); }
  catch (error) { dialog.showErrorBox("关键词检索器", `${error.message}\n请重新安装应用后再试。`); app.quit(); }
});
app.on("before-quit", () => { isQuitting = true; stopBackend(); });
app.on("window-all-closed", () => app.quit());
