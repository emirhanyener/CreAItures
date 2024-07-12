const hint = document.getElementById("hint");

setInterval(() => {
  hint.innerHTML = window.electronAPI.getMessage();
}, 1000);