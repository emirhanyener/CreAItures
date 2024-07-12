const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    sendPrompt: (prompt) => {ipcRenderer.send("aipanel_prompt", prompt);},
});