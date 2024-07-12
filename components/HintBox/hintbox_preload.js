const { contextBridge, ipcRenderer } = require("electron");
let message = "Hello";

contextBridge.exposeInMainWorld("electronAPI", {
    getMessage: () => {return message;},
});

function handleMessage(event, _message){
    message = _message;
}
ipcRenderer.on("hint_message", handleMessage);