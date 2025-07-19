let intervalId = null;

    function startTempo(bpm) {
      clearInterval(intervalId);
      const led = document.getElementById("tempo-led");
      const interval = 60000 / bpm;

      intervalId = setInterval(() => {
        led.classList.add("active");
        setTimeout(() => led.classList.remove("active"), 100);
      }, interval);
    }

function renderGrille(grille) {
  const container = document.getElementById("grille-container");
  container.innerHTML = "";

  grille.forEach(ligne => {
    const rowWrapper = document.createElement("div");
    const row = document.createElement("div");
    row.className = "ligne";

    ligne.mesures.forEach((accord, i) => {
      const cell = document.createElement("div");
      cell.className = "cellule";
      cell.textContent = accord;

      // Effet néon au clic
      cell.addEventListener("click", () => {
        cell.classList.add("active");
        setTimeout(() => {
          cell.classList.remove("active");
        }, 1500);
      });

      // Badge de répétition sur la dernière cellule
      if (i === ligne.mesures.length - 1 && ligne.repetitions > 1) {
        const badge = document.createElement("span");
        badge.className = "repetition-badge";
        badge.textContent = `×${ligne.repetitions}`;
        cell.appendChild(badge);
      }

      row.appendChild(cell);
    });

    rowWrapper.appendChild(row);
    container.appendChild(rowWrapper);
  });
}
    fetch("../data/tablatures.json")
      .then(res => res.json())
      .then(morceaux => {
        const selector = document.getElementById("selector");
        const titre = document.getElementById("titre");
        const description = document.getElementById("description");
        const section = document.getElementById("grille-section");

        morceaux.forEach((morceau, index) => {
          const opt = document.createElement("option");
          opt.value = index;
          opt.textContent = morceau.titre;
          selector.appendChild(opt);
        });

        selector.addEventListener("change", e => {
          const morceau = morceaux[e.target.value];
          console.log("🎸 Morceau sélectionné :", morceau); // 👈
          titre.textContent = morceau.titre;
          description.innerHTML = `
            ${morceau.style} – ${morceau.tonalite} – ${morceau.signature} – 
            <strong>${morceau.difficulte}</strong><br>
            <em>${morceau.indication}</em>
          `;

          section.classList.remove("hidden");
          document.getElementById("selection-container").classList.add("hidden");
          renderGrille(morceau.grille);
          startTempo(morceau.bpm);
        });
      });