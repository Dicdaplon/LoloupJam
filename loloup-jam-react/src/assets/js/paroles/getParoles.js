document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("selector-paroles");
  const contenu = document.getElementById("contenu-paroles");

  if (typeof PATHS === "undefined") {
  console.error("❌ PATHS non défini");
  return;
}
  fetch(PATHS.data + "paroles-index.json")
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
        fetch("paroles/" + fichier)
          .then(res => res.text())
          .then(texte => {
  renderParoles(texte); 
})
          .catch(err => contenu.textContent = "Erreur de chargement");
      });
    });
});

function renderParoles(text) {
  const container = document.getElementById("contenu-paroles");
  container.innerHTML = ""; // reset

  const lines = text.split("\n");
  let currentStyle = "A";
  let buffer = [];

  const applyBlock = (linesBlock, styleKey) => {
    if (linesBlock.length === 0) return;
    const p = document.createElement("div");
    p.className = `paroles-neon${styleKey}`;
    p.innerHTML = linesBlock.join("<br>");
    container.appendChild(p);
  };

  lines.forEach(line => {
    const trimmed = line.trim();

    const match = trimmed.match(/^\((A|B|C)\)$/i);
    if (match) {
      applyBlock(buffer, currentStyle);
      buffer = [];
      currentStyle = match[1].toUpperCase();
      return;
    }

    if (trimmed === "") {
      applyBlock(buffer, currentStyle);
      buffer = [];
      currentStyle = currentStyle === "A" ? "B" : "A";
      return;
    }

    buffer.push(trimmed);
  });

  applyBlock(buffer, currentStyle); // dernier bloc
}
