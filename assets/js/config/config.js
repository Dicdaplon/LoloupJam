// Détection de l'environnement local ou GitHub Pages
const IS_LOCAL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
const BASE_PATH = IS_LOCAL ? '' : '/LoloupJam';

const PATHS = {
  fonts: `${BASE_PATH}/assets/fonts/`,
  data: `${BASE_PATH}/data/`,
  paroles: `${BASE_PATH}/paroles/`,
  chat: `${BASE_PATH}/assets/js/chat/`,
  firebase:`${BASE_PATH}/assets/js/firebase/`,
};

// Gestion dynamique de la hauteur de l'app (mobile-friendly)
function updateAppHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

window.addEventListener('resize', updateAppHeight);
window.addEventListener('orientationchange', updateAppHeight);
updateAppHeight();