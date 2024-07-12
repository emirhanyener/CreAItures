const result = document.getElementById("result");

result.addEventListener("pointerdown", (e) => {
  if(e.button == 2){
    window.electronAPI.close();
  }
});
setInterval(() => {
  if(window.electronAPI.getMessage() != result.innerHTML){
    result.innerHTML = window.electronAPI.getMessage();
  }
}, 1000);