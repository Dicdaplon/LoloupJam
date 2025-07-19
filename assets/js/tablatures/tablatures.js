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

    ligne.mesures.forEach(accord => {
      const cell = document.createElement("div");
      cell.className = "cellule";
      cell.textContent = accord;
      row.appendChild(cell);
    });

    const rep = document.createElement("div");
    rep.className = "rep";
    rep.textContent = `×${ligne.repetitions}`;

    rowWrapper.appendChild(row);
    rowWrapper.appendChild(rep);
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