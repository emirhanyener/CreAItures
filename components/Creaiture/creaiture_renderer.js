const creaiture = document.getElementById("creaiture");
creaiture.addEventListener("pointerdown", (e) => {
  if(e.button == 0){
    window.electronAPI.pointerdown();
  } else if(e.button == 2){
    window.electronAPI.rightclick();
  }
});
creaiture.addEventListener("pointerup", (e) => {
  if(e.button == 0){
    window.electronAPI.pointerup();
  }
});
creaiture.addEventListener("pointerleave", (e) => {
  window.electronAPI.pointerup();
});

//Image Loader
const loadedImages = {default: "../img/Creaitures/Fox/FoxCreaiture.png",idle: [], drag: [], move: []};
let reverse = false;
let index = 0;
{
  loadedImages.idle.push("../img/Creaitures/Fox/FoxCreaiture.png");
  loadedImages.idle.push("../img/Creaitures/Fox/Idle/FoxCreaitureIdle.png");
  loadedImages.idle.push("../img/Creaitures/Fox/Idle/FoxCreaitureIdle2.png");

  loadedImages.move.push("../img/Creaitures/Fox/Move/FoxCreaitureMove.png");
  loadedImages.move.push("../img/Creaitures/Fox/FoxCreaiture.png");
  loadedImages.move.push("../img/Creaitures/Fox/Move/FoxCreaitureMove2.png");

  loadedImages.drag.push("../img/Creaitures/Fox/Drag/FoxCreaitureDrag1.png");
  loadedImages.drag.push("../img/Creaitures/Fox/Drag/FoxCreaitureDrag2.png");
  loadedImages.drag.push("../img/Creaitures/Fox/Drag/FoxCreaitureDrag3.png");
}

//Animation
setInterval(() => {
  if(index == loadedImages[window.electronAPI.getStatus()].length - 1){
    reverse = true;
  } else if(index == 0){
    reverse = false;
  }

  creaiture.src = loadedImages[window.electronAPI.getStatus()][index];

  if(reverse){
    index--;
  } else {
    index++;
  }
}, 150);