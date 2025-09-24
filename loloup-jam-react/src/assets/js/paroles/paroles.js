document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("selector");
  const contenu = document.getElementById("contenu-paroles");

  fetch("../../data/paroles-index.json")
    .then(res => res.json())
    .then(liste => {
      liste.forEach((item, index) => {
        const opt = document.createElement("option");
        opt.value = item.fichier;
        opt.textContent = item.titre;
        selector.appendChild(opt);
      });

      selector.addEventListener("change", (e) => {
        const fichier = e.target.value;
        fetch("../../paroles/" + fichier)
          .then(res => res.text())
          .then(texte => {
            contenu.textContent = texte;
          })
          .catch(err => contenu.textContent = "Erreur de chargement");
      });
    });
});