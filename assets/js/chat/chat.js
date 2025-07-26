// chat.js
import { db } from '../firebase/firebase-config.js';
import { ref, push, onChildAdded } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js';
import { get, child } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { loadAllPictures } from '../pictures/pictures.js';

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
      // Tu peux ajouter d'autres commandes ici

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


  displayMessage(message.text);
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

      for (let key in data) {
        const msg = data[key];
        const ts = Number(msg.timestamp);

        if (
          msg && typeof msg.text === 'string' &&
          ts >= startTs && ts <= endTs
        ) {
          console.log(`✅ Match: ${msg.text} @ ${new Date(ts).toLocaleString()}`);
          displayMessage(msg.text);
        } else {
          console.log(`❌ Ignored: ${msg.text} @ ${new Date(ts).toLocaleString()}`);
        }
      }
    }

    // 🔥 Affichage des photos après les messages
    loadAllPictures((url) => {
      displayMessage('photo:' + url);
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
    img.style.maxWidth = '10vw';
    img.style.maxHeight = '10vh';
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

  setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => {
      el.remove();
      style.remove(); // Nettoyage
    }, 1000);
  }, 4000);
}
