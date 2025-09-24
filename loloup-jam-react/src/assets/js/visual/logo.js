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
    "Le saviez-vous ?\nUn standard de jazz\ncommence au piano et\nfinit quand tout\nle monde est partis.",
  "Le saviez-vous ?\nLes rockeurs considèrent que\n“laver ses cheveux” est un acte bourgeois.",
  "Le saviez-vous ?\nTout rockeur a déjà cassé\nune guitare sur scène,\nmême si c’était juste\nune guitare Décathlon.",
  "Le saviez-vous ?\nUn rockeur ne vieillit pas,\nil jaunit comme une vieille\npochette vinyle.",
  "Le saviez-vous ?\nUn metalleux peut survivre\nun mois avec trois bières,\nun paquet de Monster Munch\net un T-shirt de Motörhead.",
  "Le saviez-vous ?\nEn Metal, plus le logo d’un groupe\nest illisible, plus il est “true”.",
  "Le saviez-vous ?\nLes metalleux hibernent\nde novembre à juin,\npuis migrent tous au Hellfest.",
  "Le saviez-vous ?\nLes jazzmen peuvent improviser\nun solo sur le bip\nde la caisse enregistreuse.",
  "Le saviez-vous ?\nQuand un jazzman est à l’heure,\nc’est qu’il est en avance\nde trois mesures.",
  "Le saviez-vous ?\nLes jazzmen appellent “standard”\nun morceau que personne\nne connaît.",
  "Le saviez-vous ?\nUn concert de jazz peut durer\n3 heures et contenir\n2 chansons.",
  "Le saviez-vous ?\nUn bluesman a toujours l’air\nd’avoir raté son bus,\nsa vie et son mariage…\ndans cet ordre.",
  "Le saviez-vous ?\nLes bluesmen transforment\nn’importe quelle météo\nen “ciel triste”.",
  "Le saviez-vous ?\nChaque chanson de blues parle\nsoit d’une femme partie,\nsoit d’un chien mort,\nparfois des deux.",
  "Le saviez-vous ?\nLes musiciens funk peuvent porter\nplus de paillettes qu’un sapin\nde Noël sous acide.",
  "Le saviez-vous ?\nLe funk ne se joue pas :\nil se transpire.",
  "Le saviez-vous ?\nLes musiciens funk ne vieillissent pas,\nils s’évaporent en vapeur de sueur\nparfumée au patchouli.",
  "Le saviez-vous ?\nDans la chanson française,\nla pluie est un personnage principal.",
  "Le saviez-vous ?\nLes textes de chanson française\nsont si poétiques que personne\nne sait vraiment de quoi ils parlent.",
  "Le saviez-vous ?\nUn chanteur français ne respire pas :\nil soupire en rimes.",
   "Il n’y a pas de fausses notes !\n… seulement des notes mal placées,\nmal choisies et qui n’ont rien à faire là.",
  "Le saviez-vous ?\nUne arythmie n’est pas\nune nuance de jeu.\nVeuillez consulter.",
  "Today is *not* gonna be the day.\nArrêtez ça tout de suite.",
  "Le premier qui crie\nROOOOOXanne entre\nsur ma liste rouge.",
  "Le saviez-vous ?\nLes bassistes à 5 cordes sont\ndes guitaristes qui n’ont pas\nréussi à se racheter un jeu.",
  "La batterie, c’est facile :\nil suffit de taper…\nmais au bon endroit,\nau bon moment,\net pas trop fort.",
  "Le métronome n’est pas votre ennemi…\nle batteur peut le devenir.",
  "La basse à 4 cordes, c’est classique.\nÀ 5, c’est suspect.\nÀ 6, c’est un aveu.",
  "Le saviez-vous ?\nLe silence est aussi une note.\nLa préférée des voisins.",
  "Les pianistes comptent toujours\nsur leurs dix doigts.\nLes autres, sur la chance."
  ];

  let lastClickTime = 0; // timestamp du dernier clic

  function showMessage() {
    const now = Date.now();
    if (now - lastClickTime < 4000) return; // bloque si trop rapproché
    lastClickTime = now;

    // Shake
    logo.classList.add('shake');
    setTimeout(() => logo.classList.remove('shake'), 2000);

    // Choix aléatoire
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Message flottant
    const message = document.createElement('div');
    message.className = 'floating-message-loloup';
    const rect = logo.getBoundingClientRect();
    message.style.left = rect.left + window.scrollX + rect.width + 'px';
    message.style.top = rect.top + window.scrollY + rect.height / 3 + 'px';
    message.innerText = randomMessage;

    document.body.appendChild(message);
    setTimeout(() => message.classList.add('fade-out'), 4000);
    setTimeout(() => message.remove(), 6000);
  }

  // clic manuel
  logo.addEventListener('click', showMessage);

  // déclenche auto toutes les minutes
  const AUTO_INTERVAL_MS =30_000;
  setInterval(() => {
    if (!document.hidden) {
      showMessage();
    }
  }, AUTO_INTERVAL_MS);

  // premier lancement auto dès le chargement
  showMessage();
});