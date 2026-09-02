const { contextBridge } = require("electron");

const argument = process.argv.find((value) => value.startsWith("--keyword-scanner-api="));
const apiBaseUrl = argument?.slice("--keyword-scanner-api=".length) || "http://127.0.0.1:8000";
contextBridge.exposeInMainWorld("keywordScanner", { getApiBaseUrl: () => apiBaseUrl });
