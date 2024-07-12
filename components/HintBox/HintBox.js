const { BrowserWindow, screen } = require("electron/main");
const path = require("node:path");

class HintBox {
    constructor() {
      const primaryDisplay = screen.getPrimaryDisplay();
      this.screenSize = primaryDisplay.workAreaSize;
      const width = 150;
      const height = 100;
  
      this.win = new BrowserWindow({
        width: width,
        height: height,
        frame: false,
        webPreferences: {
          preload: path.join(__dirname, "hintbox_preload.js"),
        },
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        show: false,
      });
      this.win.loadFile("src/html/hintbox.html");
    }
    active(){
      this.win.show();
    }
    deactive(){
      this.win.hide();
    }

    sendHint(message){
      this.win.webContents.send("hint_message", message);
      
      setTimeout(() => {
        this.active();
      }, 1000);
      setTimeout(() => {
        this.deactive();
      }, 5000);
    }
}

module.exports = { HintBox };