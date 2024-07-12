const { BrowserWindow, screen } = require("electron/main");
const path = require("node:path");

class Creaiture {
  constructor(width, height) {
    const primaryDisplay = screen.getPrimaryDisplay();
    this.creaitureSize = { width: width, height: height };
    this.screenSize = primaryDisplay.workAreaSize;
    this.velocity = { x: 0, y: 0 };
    this.pointerPosition = { x: 0, y: 0 };
    this.speed = 2;

    this.events = { dragging: false, typing: false, result: false };

    this.win = new BrowserWindow({
      width: width,
      height: height,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "creaiture_preload.js"),
      },
      transparent: true,
      resizable: false,
      alwaysOnTop: true,
    });
    this.win.loadFile("src/html/creaiture.html");
    setTimeout(() => {
      this.win.setPosition(
        Math.floor(this.screenSize.width * 0.5 - this.creaitureSize.width * 0.5),
        Math.floor(this.screenSize.height * 0.1 - this.creaitureSize.height * 0.5)
      );
    }, 500);
  }

  update() {
    const pointerPoint = screen.getCursorScreenPoint();
    if (this.events.dragging) {
      this.velocity.x = 0;
      this.velocity.y = 0;

      this.velocity.x =
        (Math.floor(
          this.win.getPosition()[0] + this.creaitureSize.width * 0.5
        ) -
          pointerPoint.x) *
        -1 *
        2;
      this.velocity.y =
        (Math.floor(
          this.win.getPosition()[1] + this.creaitureSize.height * 0.5
        ) -
          pointerPoint.y) *
        -1 *
        2;

      this.win.setPosition(
        Math.floor(pointerPoint.x - this.creaitureSize.width * 0.5),
        Math.floor(pointerPoint.y - this.creaitureSize.height * 0.5)
      );
    } else {
      this.velocity.x *= 0.98;
      if (Math.abs(this.velocity.x) < 2) {
        this.velocity.x = 0;
      }
      if (
        this.win.getPosition()[0] >=
        this.screenSize.width - this.creaitureSize.width
      ) {
        this.velocity.x *= -1;
        this.win.setPosition(
          this.screenSize.width - this.creaitureSize.width,
          this.win.getPosition()[1]
        );
      }
      if (this.win.getPosition()[0] < 0) {
        this.velocity.x *= -1;
        this.win.setPosition(0, this.win.getPosition()[1]);
      }
      if (this.win.getPosition()[1] < 0) {
        this.velocity.y *= -1;
        this.win.setPosition(this.win.getPosition()[0], 0);
      }
      if (
        this.win.getPosition()[1] >=
        this.screenSize.height - this.creaitureSize.height
      ) {
        this.win.setPosition(
          Math.floor(this.win.getPosition()[0]),
          Math.floor(this.screenSize.height - this.creaitureSize.height)
        );
        if (Math.abs(this.velocity.y) < 5) {
          this.velocity.y = 0;
        } else {
          this.velocity.y *= -0.5;
        }
      } else {
        this.velocity.y += 9.81 * 0.1;
      }
      this.win.setPosition(
        Math.floor(this.win.getPosition()[0] + this.velocity.x),
        Math.floor(this.win.getPosition()[1] + this.velocity.y)
      );
    }
    if (
      this.events.dragging ||
      Math.abs(this.velocity.x) > 5 ||
      Math.abs(this.velocity.y) > 1
    ) {
      this.win.webContents.send("creaiture_status", "drag");
    } else if (
      Math.abs(this.velocity.x) > 0 &&
      Math.abs(this.velocity.x) < 10
    ) {
      this.win.webContents.send("creaiture_status", "move");
    } else {
      const distance = Math.sqrt(
        Math.pow(
          pointerPoint.x -
            this.win.getPosition()[0] -
            this.creaitureSize.width / 2,
          2
        ) +
          Math.pow(
            pointerPoint.y -
              this.win.getPosition()[1] -
              this.creaitureSize.height / 2,
            2
          )
      );
      //Ball Active
      if(Config.ball.win.isVisible() && !this.events.typing){
        this.win.setPosition(
          this.win.getPosition()[0] +
            Math.floor(
              clamp(
                -1,
                1,
                (Config.ball.win.getPosition()[0] -
                  this.win.getPosition()[0] -
                  this.creaitureSize.width / 2)
              )
            ) * this.speed,
          this.win.getPosition()[1]
        );
        //Ball kick
        if(Math.sqrt(
          Math.pow(
            Config.ball.win.getPosition()[0] -
              this.win.getPosition()[0] -
              this.creaitureSize.width / 2,
            2
          ) +
            Math.pow(
              Config.ball.win.getPosition()[1] -
                this.win.getPosition()[1] -
                this.creaitureSize.height,
              2
            )
        ) < 100){
          if(Config.ball.win.getPosition()[0] < this.screenSize.width / 2){
            Config.ball.win.setPosition(Math.floor(this.win.getPosition()[0] + this.creaitureSize.width), Config.ball.win.getPosition()[1]);
            Config.ball.velocity.x = Math.random() * 40;
            Config.ball.velocity.y = 20 + Math.random() * 40;
          } else {
            Config.ball.win.setPosition(Math.floor(this.win.getPosition()[0]), Config.ball.win.getPosition()[1]);
            Config.ball.velocity.x = Math.random() * 40 * (-1);
            Config.ball.velocity.y = 20 + Math.random() * 40;
          }
        }
        this.win.webContents.send("creaiture_status", "move");
      } 
      //Pointer event move animation
      else if (
        distance > 50 &&
        distance < 150 &&
        Math.abs(
          pointerPoint.x -
            this.win.getPosition()[0] -
            this.creaitureSize.width / 2
        ) > 50
      ) {
        this.win.setPosition(
          this.win.getPosition()[0] +
            Math.floor(
              clamp(
                -1,
                1,
                (pointerPoint.x -
                  this.win.getPosition()[0] -
                  this.creaitureSize.width / 2) *
                  -1
              )
            ) * this.speed,
          this.win.getPosition()[1]
        );
        this.win.webContents.send("creaiture_status", "move");
      } else if(!this.events.typing) {
        //Move to right botton corner
        if (
          this.win.getPosition()[0] <
          this.screenSize.width - this.creaitureSize.width
        ) {
          this.win.setPosition(
            this.win.getPosition()[0] + 2,
            this.win.getPosition()[1]
          );
          this.win.webContents.send("creaiture_status", "move");
        } else {
          this.win.webContents.send("creaiture_status", "idle");
        }
      } else {
        this.win.webContents.send("creaiture_status", "idle");
      }
    }
  }
}

function clamp(min, max, value) {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
}

module.exports = { Creaiture };
const { Config } = require("../Config.js");
