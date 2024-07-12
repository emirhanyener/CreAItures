const { BrowserWindow, screen } = require("electron/main");
const path = require("node:path");

class Ball {
  constructor(width, height) {
    const primaryDisplay = screen.getPrimaryDisplay();
    this.ballSize = { width: width, height: height };
    this.screenSize = primaryDisplay.workAreaSize;
    this.velocity = { x: 0, y: 0 };
    this.pointerPosition = { x: 0, y: 0 };

    this.events = { dragging: false, typing: false, result: false };

    this.win = new BrowserWindow({
      width: width,
      height: height,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "ball_preload.js"),
      },
      transparent: true,
      resizable: false,
      alwaysOnTop: true,
      show: false,
    });
    this.win.loadFile("src/html/ball.html");
    setTimeout(() => {
      this.win.setPosition(
        Math.floor(this.screenSize.width * 0.5 - this.ballSize.width * 0.5),
        Math.floor(this.screenSize.height * 0.1 - this.ballSize.height * 0.5)
      );
    }, 500);
  }

  spawn(){
    this.win.setPosition(
      Math.floor(this.screenSize.width * 0.5 - this.ballSize.width * 0.5),
      Math.floor(this.screenSize.height * 0.1 - this.ballSize.height * 0.5)
    );
    this.win.show();
  }
  destroy(){
    this.win.hide();
  }

  update() {
    const pointerPoint = screen.getCursorScreenPoint();
    if (this.events.dragging) {
      this.velocity.x = 0;
      this.velocity.y = 0;

      this.velocity.x =
        (Math.floor(
          this.win.getPosition()[0] + this.ballSize.width * 0.5
        ) -
          pointerPoint.x) *
        -1 *
        2;
      this.velocity.y =
        (Math.floor(
          this.win.getPosition()[1] + this.ballSize.height * 0.5
        ) -
          pointerPoint.y) *
        -1 *
        2;

      this.win.setPosition(
        Math.floor(pointerPoint.x - this.ballSize.width * 0.5),
        Math.floor(pointerPoint.y - this.ballSize.height * 0.5)
      );
    } else {
      this.velocity.x *= 0.98;
      if (Math.abs(this.velocity.x) < 1) {
        this.velocity.x = 0;
      }
      if (
        this.win.getPosition()[0] >=
        this.screenSize.width - this.ballSize.width
      ) {
        this.velocity.x *= -1;
        this.win.setPosition(
          this.screenSize.width - this.ballSize.width,
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
        this.screenSize.height - this.ballSize.height
      ) {
        this.win.setPosition(
          Math.floor(this.win.getPosition()[0]),
          Math.floor(this.screenSize.height - this.ballSize.height)
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
      this.win.webContents.send("ball_velocity", this.velocity.x);
    }
  }
}

module.exports = { Ball };
