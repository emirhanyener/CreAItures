class Config{
    static screenSize;
    static creaiture;
    static ball;
    static intervalFunction;
    static aipanel;
    static hintBox;

    static init(){
        const primaryDisplay = screen.getPrimaryDisplay();
        Config.screenSize = primaryDisplay.workAreaSize;
        
        Config.creaiture = new Creaiture(153, 153);
        Config.ball = new Ball(30, 30);
        Config.aipanel = new AIPanel();
        Config.aiResultPanel = new AIResultPanel();
        Config.hintBox = new HintBox();      
    }
}

module.exports = { Config };
const { screen } = require("electron/main");
const { Creaiture } = require("./Creaiture/Creaiture.js");
const { Ball } = require("./Ball/Ball.js");
const { AIPanel } = require("./AIPanel/AIPanel.js");
const { HintBox } = require("./HintBox/HintBox.js");
const {
  AIResultPanel,
} = require("./AIResultPanel/AIResultPanel.js");
