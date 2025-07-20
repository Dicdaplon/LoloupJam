// chat.js
import { db } from '../firebase/firebase-config.js';
import { ref, push, onChildAdded } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js';
import { get, child } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const chatInput = document.getElementById('chat-input');
const form = document.getElementById('chat-form');

// Référence Firebase pour les messages
const messagesRef = ref(db, 'messages');

// 🕒 Heure actuelle au moment du chargement
const now = Date.now();

// Envoi d’un message
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

// Réception — uniquement les messages récents

let showHistory = false;


onChildAdded(messagesRef, (snapshot) => {
  const message = snapshot.val();

  if (!message || typeof message.text !== 'string') return;

  const ts = Number(message.timestamp);

  // Ne pas afficher les anciens messages si en mode "live only"
  if (!showHistory && ts < now) return;

  // Activer l'affichage complet uniquement si /all est tapé maintenant
  if (message.text === '/all') {
    showAllMessages();
    return;
  }

  displayMessage(message.text);
});
function showAllMessages() {
  showHistory = true;
  get(child(ref(db), 'messages')).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      for (let key in data) {
        const msg = data[key];
        if (msg && typeof msg.text === 'string') {
          displayMessage(msg.text);
        }
      }
    }
  });
}
// Affichage overlay temporaire
function displayMessage(text) {
  const el = document.createElement('div');
  el.className = 'floating-message neon';

  el.innerText = text;

  // Position initiale aléatoire
  const x = Math.random() * 80 + 10; // 10% à 90%
  const y = Math.random() * 70 + 10;
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;

  // Couleur néon aléatoire
  const colors = ['#00f0ff', '#ff00c8', '#39ff14', '#ffd700', '#ff4444'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  el.style.color = color;
  el.style.textShadow = `0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color}`;

  // Générer un nom d'animation aléatoire unique
  const animName = `float-${Math.floor(Math.random() * 100000)}`;
  const deltaX = (Math.random() * 30 - 15); // -15px à +15px
  const deltaY = (Math.random() * 30 - 15);

  // Injecter animation CSS personnalisée
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes ${animName} {
      0%   { transform: translate(-50%, -50%) translate(0, 0); }
      50%  { transform: translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px); }
      100% { transform: translate(-50%, -50%) translate(0, 0); }
    }
  `;
  document.head.appendChild(style);

  el.style.animation = `${animName} 4s ease-in-out`;

  document.body.appendChild(el);

  setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => {
      el.remove();
      style.remove(); // Nettoyer le style injecté
    }, 1000);
  }, 4000);
}