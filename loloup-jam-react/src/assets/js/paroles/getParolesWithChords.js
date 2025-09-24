// ==== Chargement ====
document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("selector");
  const contenu = document.getElementById("contenu-paroles");

  if (typeof PATHS === "undefined") {
    console.error("❌ PATHS non défini");
    return;
  }

  fetch(PATHS.data + "paroles-index.json")
    .then(res => res.json())
    .then(liste => {
      liste.forEach((item) => {
        const opt = document.createElement("option");
        opt.value = item.fichier;     // ex: "sunny.txt"
        opt.textContent = item.titre; // titre affiché
        selector.appendChild(opt);
      });

      selector.addEventListener("change", (e) => {
        const fichier = e.target.value;

        const parolesPath = "paroles/" + fichier;                         // ex: paroles/sunny.txt
        const chordsPath  = "textChords/" + fichier.replace(/\.[^.]+$/i, ".json"); // ex: textChords/sunny.json

        Promise.all([
          fetch(parolesPath).then(res => res.text()),
          fetch(chordsPath).then(res => res.json()).catch(() => ({}))
        ])
        .then(([texteParoles, chordMap]) => {
          renderParolesWithChords(texteParoles, { chords: chordMap });
        })
        .catch(err => {
          console.error(err);
          contenu.textContent = "Erreur de chargement";
        });
      });
    })
    .catch(err => console.error("❌ Impossible de charger paroles-index.json", err));
});


function renderParolesWithChords(text, options = {}) {
  const container = document.getElementById("contenu-paroles");
  container.innerHTML = "";

  const chordMap = options.chords || {}; // { "Am": [ {sentence, offset}, ...], ... }

  const norm = s => (s ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (Object.keys(chordMap).length > 0) {
    const lines = text.split("\n");

    lines.forEach(line => {
      const lineRaw  = line;
      const lineNorm = norm(line);
      const occurrences = [];

      // collecte des accords pour cette ligne (sous-chaîne + offset relatif)
      for (const chord in chordMap) {
        for (const entry of chordMap[chord] || []) {
          if (!entry || typeof entry.sentence !== "string" || !Number.isFinite(entry.offset)) continue;
          const sentNorm = norm(entry.sentence);
          if (!sentNorm) continue;

          const startInLine = lineNorm.indexOf(sentNorm);
          if (startInLine >= 0) {
            const localOffset = Math.max(0, Math.min(sentNorm.length, entry.offset));
            const absolute    = startInLine + localOffset;
            const clamped     = Math.max(0, Math.min(lineRaw.length, absolute));
            occurrences.push({ chord, offset: clamped });
          }
        }
      }

      // conteneur de la ligne (texte intact)
      const lineDiv = document.createElement("div");
      lineDiv.className = "paroles-line overlay-chords";
      lineDiv.textContent = lineRaw;

      if (occurrences.length) {
        // couche d’accords par-dessus
        const layer = document.createElement("div");
        layer.className = "chords-layer";

        // on trie pour cohérence (pas obligatoire)
        occurrences.sort((a, b) => a.offset - b.offset);

        occurrences.forEach(({ chord, offset }) => {
          const badge = document.createElement("span");
          badge.className = "chord-badge chord-abs";
          badge.textContent = chord;

          // position horizontale basée sur l’offset en 'ch'
          // (1 offset = ~1 caractère de largeur)
          badge.style.left = offset + "ch";

          layer.appendChild(badge);
        });

        lineDiv.appendChild(layer);
      }

      const wrapper = document.createElement("div");
      wrapper.className = "line-wrapper";
      wrapper.appendChild(lineDiv);
      container.appendChild(wrapper);
    });

    return;
  }

  // --- Mode classique (neon A/B/C) inchangé ---
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

  applyBlock(buffer, currentStyle);
}