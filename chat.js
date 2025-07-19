function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  db.ref("chat").push({
    user: "🎤",
    text: text,
    time: Date.now()
  });
  input.value = "";
}

function listenToChat() {
  db.ref("chat").on("child_added", snapshot => {
    const msg = snapshot.val();
    showFloatingMessage(`${msg.user} ${msg.text}`);
  });
}

window.addEventListener("load", listenToChat);

function showFloatingMessage(text) {
  const div = document.createElement("div");
  div.textContent = text;
  div.style.position = "fixed";
  div.style.left = `${10 + Math.random() * 80}%`;
  div.style.top = `${20 + Math.random() * 60}%`;
  div.style.color = "white";
  div.style.fontSize = "1.2rem";
  div.style.fontFamily = "sans-serif";
  div.style.padding = "0.5rem 1rem";
  div.style.background = "rgba(0,0,0,0.5)";
  div.style.border = "1px solid #0ff";
  div.style.borderRadius = "20px";
  div.style.zIndex = 15;
  div.style.opacity = 0;
  div.style.transition = "opacity 0.3s";

  document.body.appendChild(div);
  requestAnimationFrame(() => {
    div.style.opacity = 1;
  });

  setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => div.remove(), 1000);
  }, 4000);
}