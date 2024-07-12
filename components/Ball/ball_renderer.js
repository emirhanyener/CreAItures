const ball = document.getElementById("ball");
let rotation = 0;
ball.addEventListener("pointerdown", (e) => {
  if(e.button == 0){
    window.electronAPI.pointerdown();
  } else if(e.button == 2){
    window.electronAPI.rightclick();
  }
});
ball.addEventListener("pointerup", (e) => {
  if(e.button == 0){
    window.electronAPI.pointerup();
  }
});
ball.addEventListener("pointerleave", (e) => {
  window.electronAPI.pointerup();
});

setInterval(() => {
  rotation += window.electronAPI.getVelocity();
  ball.style.transform = "rotate(" + rotation + "deg)";
}, 10);