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
        opt.value = item.fichier;
        opt.textContent = item.titre;
        selector.appendChild(opt);
      });

      selector.addEventListener("change", (e) => {
        const fichier = e.target.value;

        Promise.all([
          fetch("paroles/" + fichier).then(res => res.text()),
          fetch("textChords/" + fichier).then(res => res.text()).catch(() => "")
        ])
          .then(([texteParoles, texteChords]) => {
            const insertions = parseChordsFile(texteChords);
            renderParolesWithChords(texteParoles, { insertions });
          })
          .catch(err => contenu.textContent = "Erreur de chargement");
      });
    });
});

function renderParolesWithChords(text, options = {}) {
  const container = document.getElementById("contenu-paroles");
  container.innerHTML = "";

  const insertionDefinitions = options.insertions || [];

  if (insertionDefinitions.length > 0) {
    const lines = text.split("\n");

    lines.forEach(line => {
      const wrapper = document.createElement("div");
      wrapper.className = "line-wrapper";

      let rebuiltLine = "";
      let remaining = line;

      while (true) {
        let bestMatch = null;

        for (const def of insertionDefinitions) {
          for (const keyword of def.keywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, "i");
            const match = regex.exec(remaining);
            if (match && (!bestMatch || match.index < bestMatch.index)) {
              bestMatch = { keyword, match, def };
            }
          }
        }

        if (!bestMatch) break;

        const { keyword, match, def } = bestMatch;
        const before = remaining.slice(0, match.index);
        const anchor = match[0];
        const after = remaining.slice(match.index + anchor.length);

        rebuiltLine += before;
        rebuiltLine += `<span class="anchor-word" data-key="${keyword.toLowerCase()}">${anchor}</span>`;
        remaining = after;
      }

      rebuiltLine += remaining;

      const lineDiv = document.createElement("div");
      lineDiv.className = "paroles-line";
      lineDiv.innerHTML = rebuiltLine;

      const anchors = lineDiv.querySelectorAll(".anchor-word");
      anchors.forEach(anchor => {
        const key = anchor.dataset.key;
        const def = insertionDefinitions.find(d => d.keywords.includes(key));
        if (def) {
          const el = def.create();
          anchor.prepend(el);
        }
      });

      wrapper.appendChild(lineDiv);
      container.appendChild(wrapper);
    });

    return; // fin : on n’affiche pas le mode classique si insertions utilisées
  }

  // Mode classique (neon A/B/C)
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

function parseChordsFile(txt) {
  if (!txt) return [];

  const lines = txt.split("\n").map(l => l.trim()).filter(Boolean);
  const insertions = [];

  lines.forEach(line => {
    const [label, rest] = line.split("=");
    if (!label || !rest) return;

    const chordName = label.trim();
    const keywords = rest.split(",").map(w => w.trim()).filter(Boolean);

    insertions.push({
      keywords,
      create: () => {
        const el = document.createElement("div");
        el.className = "floating-insert";
        el.textContent = chordName;
        return el;
      }
    });
  });

  return insertions;
}
