const { BrowserWindow, screen } = require("electron/main");
const path = require("node:path");

class AIPanel {
    constructor() {
      const primaryDisplay = screen.getPrimaryDisplay();
      this.screenSize = primaryDisplay.workAreaSize;
      const width = 200;
      const height = 100;
  
      this.win = new BrowserWindow({
        width: width,
        height: height,
        frame: false,
        webPreferences: {
          preload: path.join(__dirname, "aipanel_preload.js"),
        },
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        show: false,
      });
      this.win.loadFile("src/html/aipanel.html");
    }
    active(){
      this.win.show();
      this.win.focus();
    }
    deactive(){
      this.win.hide();
    }
}

module.exports = { AIPanel };