const { contextBridge, ipcRenderer } = require("electron");

let _velocity = 0;

contextBridge.exposeInMainWorld("electronAPI", {
    pointerdown: () => ipcRenderer.send("ball", "pointerdown"),
    pointerup: () => ipcRenderer.send("ball", "pointerup"),
    rightclick: () => ipcRenderer.send("ball", "rightclick"),
    getVelocity: () => {return _velocity;},
});

function handleBallVelocity(event, velocity){
    _velocity = velocity;
}
ipcRenderer.on("ball_velocity", handleBallVelocity);