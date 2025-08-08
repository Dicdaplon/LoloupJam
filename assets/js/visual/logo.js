window.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('logo');

  // Liste des messages possibles
  const messages = [
    "Ahouuuuuuu 🎵",
    "Loloup t'observe… 👀",
    "Qui a mangé\nmon capodastre ? 🐺",
    "Ceci est une\nrépétition générale\npour la pleine lune 🌕",
    "Wolf mode: ON 🔥",
    "Attention : ce logo\nmord (en rythme) 🎶",
    "Ceci n’est pas un chien",
    "il vaut mieux\ndire bonjour",
    "Nann valait mieux\ndire bonjour",
    "Le saviez-vous ?\nWonderwall est interdit\npar la convention de Genève",
    "Un accord de Wonderwall =\n5 minutes de punition",
    "Le saviez-vous ?\nLes guitaristes règlent leur\naccordage plus longtemps\nqu’ils ne jouent",
    "Le saviez-vous ?\nLes batteurs comptent\njusqu’à 4, mais pas plus",
    "Le saviez-vous ?\nLes bassistes existent\n(vraiment)",
    "Le saviez-vous ?\nPlus un musicien joue fort,\nplus il croit jouer juste",
    "Micro ouvert,\ndanger maximal",
    "Encore une intro\nde 3 minutes",
    "Le saviez-vous ?\nLes claviéristes ont\ntoujours trop de câbles",
    "Le saviez-vous ?\nUn harmoniciste peut\ncaler un blues même\npendant ton discours\nde mariage.",
    "Le saviez-vous ?\nUn violoniste accorde\nson instrument pendant\nles deux moitié\ndu concert.",
    "Le saviez-vous ?\nEn jazz, si tu reconnais\nle morceau, c’est que\nt’es trop carré.",
    "Le saviez-vous ?\nUn standard de jazz\ncommence au piano et\nfinit quand tout\nle monde est partis."
  ];

  let lastClickTime = 0; // timestamp du dernier clic

  logo.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastClickTime < 2000) return; // bloque si moins d'1 seconde
    lastClickTime = now;

    // Shake
    logo.classList.add('shake');
    setTimeout(() => logo.classList.remove('shake'), 600);

    // Choix aléatoire
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Message flottant
    const message = document.createElement('div');
    message.className = 'floating-message-loloup';
    const rect = logo.getBoundingClientRect();
    message.style.left = rect.left + rect.width / 1 + 'px';
    message.style.top = rect.top + rect.height / 3 + window.scrollY + 'px';
    message.innerText = randomMessage;

    document.body.appendChild(message);
    setTimeout(() => message.classList.add('fade-out'), 3000);
    setTimeout(() => message.remove(), 4000);
  });
});
