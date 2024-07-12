const { BrowserWindow, screen } = require("electron/main");
const path = require("node:path");

class AIResultPanel {
    constructor() {
      const primaryDisplay = screen.getPrimaryDisplay();
      this.screenSize = primaryDisplay.workAreaSize;
      const width = 200;
      const height = 400;
  
      this.win = new BrowserWindow({
        width: width,
        height: height,
        frame: false,
        webPreferences: {
          preload: path.join(__dirname, "airesultpanel_preload.js"),
        },
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        show: false,
      });
      this.win.loadFile("src/html/airesultpanel.html");
    }
    active(){
      this.win.show();
    }
    deactive(){
      this.win.hide();
    }

    showResult(message){
      this.active();
      this.win.webContents.send("prompt_result", message);
    }
}

module.exports = { AIResultPanel };