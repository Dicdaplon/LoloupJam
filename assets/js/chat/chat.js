// chat.js
import { db } from '../firebase/firebase-config.js';
import { ref, push, onChildAdded } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js';

const chatInput = document.getElementById('chat-input');
const form = document.getElementById('chat-form');

// Référence Firebase pour les messages
const messagesRef = ref(db, 'messages');

// Envoyer un message
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (text !== '') {
    push(messagesRef, {
      text: text,
      timestamp: Date.now()
    });
    chatInput.value = '';
  }
});

onChildAdded(messagesRef, (snapshot) => {
  const message = snapshot.val();
  displayMessage(message.text); // juste affichage, pas de push()
});

// Affichage overlay temporaire
function displayMessage(text) {
  const el = document.createElement('div');
  el.className = 'floating-message';
  el.innerText = text;
  document.body.appendChild(el);

  // Animation de disparition
  setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => el.remove(), 1000);
  }, 4000); // 4s visible + 1s fade
}