document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById("selector");
  const container = document.getElementById("grille-container");
  const titreEl = document.getElementById("titre");
  const infosEl = document.getElementById("infos");
  const mesuresEl = document.getElementById("mesures");

  fetch("data/tablatures.json")
    .then(response => response.json())
    .then(grilles => {
      grilles.forEach((grille, index) => {
        const opt = document.createElement("option");
        opt.value = index;
        opt.textContent = grille.titre;
        selector.appendChild(opt);
      });

      selector.addEventListener("change", e => {
        const index = e.target.value;
        const grille = grilles[index];

        titreEl.textContent = grille.titre;
        infosEl.textContent = `🎧 ${grille.style} | 🎵 Tonalité : ${grille.tonalite} | 🕒 ${grille.bpm} BPM`;

        mesuresEl.innerHTML = "";
grille.mesures.forEach(ligne => {
  const lineDiv = document.createElement("div");
  lineDiv.className = "ligne";

  const mesures = ligne.split("|").map(m => m.trim());

  mesures.forEach((mesure, index) => {
    const mesureDiv = document.createElement("div");
    mesureDiv.className = "cellule";

    // Gérer accords doubles (demi-mesure)
    if (mesure.includes("\\")) {
      const [a1, a2] = mesure.split("\\").map(m => m.trim());
      mesureDiv.innerHTML = `
        <span class="demi">${a1}</span><span class="slash">/</span><span class="demi">${a2}</span>
      `;
    } else {
      mesureDiv.textContent = mesure;
    }

    lineDiv.appendChild(mesureDiv);
  });

  mesuresEl.appendChild(lineDiv);
});


        container.classList.remove("hidden");
      });
    })
    .catch(err => console.error("Erreur chargement JSON", err));
});