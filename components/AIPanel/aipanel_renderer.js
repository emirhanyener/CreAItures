const input_textarea = document.getElementById("prompt");

input_textarea.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    const prompt = input_textarea.value;
    input_textarea.value = "";
    window.electronAPI.sendPrompt(prompt);
    e.preventDefault();
  }
});
