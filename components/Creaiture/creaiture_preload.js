const { contextBridge, ipcRenderer } = require("electron");
let creaitureStatus = "idle";

contextBridge.exposeInMainWorld("electronAPI", {
    pointerdown: () => ipcRenderer.send("creaiture", "pointerdown"),
    pointerup: () => ipcRenderer.send("creaiture", "pointerup"),
    rightclick: () => ipcRenderer.send("creaiture", "rightclick"),
    getStatus: () => {return creaitureStatus;},
});

function handleStatus(event, status){
    creaitureStatus = status;
}
ipcRenderer.on("creaiture_status", handleStatus);
