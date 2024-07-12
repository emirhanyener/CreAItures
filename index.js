const { app, BrowserWindow, screen, ipcMain } = require("electron/main");
const { Config } = require("./components/Config.js");
const fs = require("fs");

const { GoogleGenerativeAI } = require("@google/generative-ai");
let genAI;
fs.readFile("./api.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  genAI = new GoogleGenerativeAI(data);
});

let hintTime = 0;
const hintMessages = [
  "What can I do for you?",
  "Let's get started",
  "I'm listening",
  "Just ask away",
  "Don't be shy, ask me anything",
  "I'm happy to help",
  "How can I make your day better?",
  "Your AI assistant is here",
  "I'm ready to answer your questions",
  "Let's explore the world of knowledge together",
  "Ask me anything, I'm here to assist",
  "Don't hesitate to ask for help",
  "I'm eager to learn and help you learn",
  "Let's make this a productive session",
  "I'm your AI companion for anything you need",
  "Just type away, I'm ready to listen",
  "Let's discover what we can achieve together",
  "Your friendly AI assistant is at your service",
  "I'm excited to see what you'll ask me",
  "Ready to answer any questions you have",
  "Let's make this a fun and informative conversation",
  "Your questions are welcome, I'm here to assist",
  "Don't be afraid to ask anything, no question is too small or too big",
  "I'm ready to provide answers and information",
  "Let's explore the possibilities together",
  "I'm here to support you and help you learn",
];

const quickMessages = [
  { message: "hi", answer: "Hello! How can I assist you today?" },
  { message: "hey", answer: "Hey there! What can I do for you?" },
  {
    message: "good morning",
    answer: "Good morning! How can I help you today?",
  },
  {
    message: "good afternoon",
    answer: "Good afternoon! How can I assist you?",
  },
  { message: "good evening", answer: "Good evening! What can I do for you?" },
  { message: "help", answer: "I'm here to help! How can I assist you?" },
  { message: "can you help me", answer: "Of course! How can I help you?" },
  {
    message: "i need help",
    answer: "I'm here to assist. What do you need help with?",
  },
  {
    message: "what can you do",
    answer:
      "I'm a large language model. I can help you with various tasks like generating text, translating languages, writing different kinds of creative content, and answering your questions in an informative way.",
  },
  {
    message: "how are you",
    answer:
      "I am an AI, so I don't have feelings, but I'm here to assist you! 😊",
  },
  {
    message: "what's up",
    answer: "Not much, just waiting to help! What about you?",
  },
  {
    message: "thanks",
    answer: "You're welcome! Is there anything else I can help you with?",
  },
  { message: "thank you", answer: "You're welcome! Happy to help." },
  {
    message: "thank you so much",
    answer: "You're very welcome! Glad I could be of assistance.",
  },
  { message: "appreciate it", answer: "No problem! Happy to help." },
  { message: "you're awesome", answer: "Thanks! I'm here to assist you." },
  { message: "great", answer: "Great! Anything else I can do for you?" },
  {
    message: "amazing",
    answer: "I'm glad you think so! Is there anything else you need?",
  },
  { message: "cool", answer: "Cool! Anything else?" },
  { message: "ok", answer: "Okay! Let me know if you need anything else." },
  { message: "okay", answer: "Okay! Let me know if you need anything else." },
  {
    message: "sure",
    answer: "Sure! Let me know if you have any other questions.",
  },
  { message: "yes", answer: "Yes! How can I help?" },
  {
    message: "no",
    answer: "No problem! Let me know if you need anything else.",
  },
  {
    message: "no thanks",
    answer: "Okay, no problem. Let me know if you need anything else.",
  },
  { message: "bye", answer: "Goodbye! Have a great day." },
  { message: "goodbye", answer: "Goodbye! Have a nice day." },
  { message: "later", answer: "See you later! 😊" },
];

function createWindow() {
  Config.init();

  Config.hintBox.sendHint("I'm FoxAI");

  intervalFunction = setInterval(() => {
    Config.creaiture.update();
    Config.ball.update();
    Config.aipanel.win.setPosition(
      Config.creaiture.win.getPosition()[0] - 150,
      Config.creaiture.win.getPosition()[1] - 100
    );
    Config.aiResultPanel.win.setPosition(
      Config.creaiture.win.getPosition()[0] - 200,
      Config.creaiture.win.getPosition()[1] - 400
    );

    if (!Config.creaiture.events.typing && !Config.creaiture.events.result) {
      Config.hintBox.win.setPosition(
        Config.creaiture.win.getPosition()[0] - 150,
        Config.creaiture.win.getPosition()[1] - 100
      );
      hintTime++;

      if (hintTime > 6000) {
        hintTime = 0;
        Config.hintBox.sendHint(
          hintMessages[Math.floor(Math.random() * hintMessages.length)]
        );
      }
    }
  }, 10);
}

function handCreaitureEvent(event, eventName) {
  if (eventName === "pointerdown") {
    Config.creaiture.events.dragging = true;
  } else if (eventName === "pointerup") {
    Config.creaiture.events.dragging = false;
  } else if (eventName === "rightclick") {
    Config.hintBox.deactive();
    Config.aiResultPanel.deactive();
    Config.creaiture.events.typing = !Config.creaiture.events.typing;
    Config.creaiture.events.result = false;
    if (Config.creaiture.events.typing) {
      Config.aipanel.active();
    } else {
      Config.aipanel.deactive();
    }
  }
}
function handBallEvent(event, eventName) {
  if (eventName === "pointerdown") {
    Config.ball.events.dragging = true;
  } else if (eventName === "pointerup") {
    Config.ball.events.dragging = false;
  }
}

async function executePrompt(input) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = input;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    let textoutput = text;
    textoutput = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    textoutput = textoutput.replaceAll("*", "<br>");
    Config.aiResultPanel.showResult(textoutput);
  } catch (error) {
    setTimeout(() => {
      if (Config.creaiture.events.result) {
        executePrompt(input);
      }
    }, 1000);
  }
}

function handInputEvent(event, input) {
  if (input.charAt(0) == ".") {
    const command = input.split(" ")[0];
    const arg = input.split(" ")[1];

    if (command == ".leave") {
      clearInterval(intervalFunction);
      app.quit();
    } else if (command == ".ball") {
      if (Config.ball.win.isVisible()) {
        Config.ball.destroy();
      } else {
        Config.ball.spawn();
      }
    } else if (command == ".set-api") {
      fs.writeFile("./api.txt", arg, (err) => {
        if (err) {
          console.error(err);
        }
      });
      genAI = new GoogleGenerativeAI(arg);
    } else if (command == ".result") {
      Config.aiResultPanel.active();
      Config.creaiture.events.result = true;
    }
    Config.aipanel.deactive();
    Config.creaiture.events.typing = false;
    return;
  }

  Config.creaiture.events.result = true;
  Config.creaiture.events.typing = false;
  Config.aiResultPanel.showResult(
    "<div style='display: flex;justify-content: center;align-items: center;font-size:32px;font-weight:bold;'>...</div>"
  );
  Config.hintBox.deactive();
  Config.aipanel.deactive();
  const answerIndex = quickMessages.findIndex((message) => {
    return message.message == input.toLowerCase();
  });
  if (answerIndex == -1) {
    executePrompt(input);
  } else {
    Config.aiResultPanel.showResult("<b style='font-size: 24px;'>" + quickMessages[answerIndex].answer + "</b>");
  }
}

function handResultPanelEvent(event, prompt) {
  if (prompt == "close") {
    Config.creaiture.events.result = false;
    Config.aiResultPanel.deactive();
  }
}

app.whenReady().then(() => {
  ipcMain.on("creaiture", handCreaitureEvent);
  ipcMain.on("ball", handBallEvent);
  ipcMain.on("aipanel_prompt", handInputEvent);
  ipcMain.on("airesultpanel_status", handResultPanelEvent);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    clearInterval(intervalFunction);
    app.quit();
  }
});
