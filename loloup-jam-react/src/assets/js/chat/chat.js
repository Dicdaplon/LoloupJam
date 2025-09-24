// chat.js
import { db } from '../firebase/firebase-config.js';
import { ref, push, onChildAdded } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js';
import { get, child } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { loadAllPictures } from '../pictures/pictures.js';

const chatInput = document.getElementById('chat-input');
const form = document.getElementById('chat-form');

// Firebase database reference
const messagesRef = ref(db, 'messages');

// Time constant
const DISPLAY_TIME = 15000;   // visible time
const FADE_MS = 1000;        // Fadeout time
const STAGGER_MS = 100;      // time between messages

// Buffer, waiting queue
const msgQueue = [];
let processing = false;

/**
 * add a message to the queue
 * @param {string} text -text of the message
 */
function enqueueMessage(text) {
  msgQueue.push(text);
  if (!processing) processQueue();
}

/**
 * add a message to the queue
 * @param {string} text -text of the message
 */
function processQueue() {
  if (msgQueue.length === 0) {
    processing = false;
    return;
  }
  processing = true;
  const text = msgQueue.shift(); //get the last element
  displayMessage(text);
  setTimeout(processQueue, STAGGER_MS); // will call function again
}

const now = Date.now();

// sent message
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim(); //remove spaces at start and end

  if (text !== '') {
    if (text.startsWith('/')) {
      // Traite localement les commandes, ne pas sauvegarder
      const parts = text.trim().split(/\s+/);
      const cmd = parts[0];

      if (cmd === '/all') {
        if (parts.length === 4) {
          const [_, dateStr, startHourStr, endHourStr] = parts;
          showAllMessages(dateStr, Number(startHourStr), Number(endHourStr));
        } else {
          showAllMessages(); // fallback sans filtre
        }
      } else if (cmd === '/clear') {
        document.querySelectorAll('.floating-message').forEach(el => el.remove());
      }
    } else {
      push(messagesRef, {
        text: text,
        timestamp: Date.now()
      });
    }
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

  enqueueMessage(message.text);
});

function showAllMessages(dateStr, startHour, endHour) {
  showHistory = true;

  get(child(ref(db), 'messages')).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      let startTs = 0;
      let endTs = Infinity;

      if (dateStr && !isNaN(startHour) && !isNaN(endHour)) {
        // Format attendu : DDMMYYYY
        const day = parseInt(dateStr.slice(0, 2));
        const month = parseInt(dateStr.slice(2, 4)) - 1; // JS : 0-based
        const year = parseInt(dateStr.slice(4, 8));

        const start = new Date(year, month, day, startHour, 0, 0, 0);
        const end = new Date(year, month, day, endHour, 0, 0, 0);

        if (endHour <= startHour) {
          end.setDate(end.getDate() + 1); // Passer au lendemain
        }

        startTs = start.getTime();
        endTs = end.getTime();

        console.log(`🕓 Filtrage entre ${start} (${startTs}) et ${end} (${endTs})`);
      }

      // Trie par timestamp pour garder l’ordre
      const list = Object.values(data)
        .filter(msg => msg && typeof msg.text === 'string')
        .filter(msg => {
          const ts = Number(msg.timestamp);
          return ts >= startTs && ts <= endTs;
        })
        .sort((a, b) => a.timestamp - b.timestamp);

      for (const msg of list) {
        enqueueMessage(msg.text);
      }
    }

    // 🔥 Affichage des photos après les messages
    loadAllPictures((url) => {
      enqueueMessage('photo:' + url);
    });
  });
}

// Affichage overlay temporaire
function displayMessage(text) {
  const el = document.createElement('div');
  el.className = 'floating-message neon';

  // Position initiale aléatoire
  const x = Math.random() * 80 + 10; // 10% à 90%
  const y = Math.random() * 70 + 10;
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;

  // Couleur néon aléatoire
  const colors = ['#00f0ff', '#ff00c8', '#39ff14', '#ffd700', '#ff4444'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  el.style.textShadow = `0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color}`;

  // Gestion image ou texte
  if (text.startsWith('photo:')) {
    const url = text.slice(6).trim();
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Jam Photo';
    img.style.maxWidth = '30vw';
    img.style.maxHeight = '30vh';
    img.style.borderRadius = '1rem';
    img.style.boxShadow = `0 0 20px ${color}`;
    img.style.pointerEvents = 'none';
    el.appendChild(img);
  } else {
    el.innerText = text;
    el.style.color = color;
  }

  // Générer un nom d'animation unique
  const animName = `float-${Math.floor(Math.random() * 100000)}`;
  const deltaX = (Math.random() * 30 - 15); // -15px à +15px
  const deltaY = (Math.random() * 30 - 15);

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

  // Timers : affichage + fade-out
  setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => {
      el.remove();
      style.remove(); // Nettoyage
    }, FADE_MS);
  }, DISPLAY_TIME);
}
