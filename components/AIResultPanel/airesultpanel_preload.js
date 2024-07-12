const { contextBridge, ipcRenderer } = require("electron");
let message = "...";

contextBridge.exposeInMainWorld("electronAPI", {
    getMessage: () => {return message;},
    close: () => {ipcRenderer.send("airesultpanel_status", "close")},
});

function handleMessage(event, _message){
    message = _message;
}
ipcRenderer.on("prompt_result", handleMessage);