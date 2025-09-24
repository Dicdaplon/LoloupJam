import { Application, Text, BlurFilter } from "pixi.js";

export type ClockOptions = {
  windows?: string[];                        // "HH:MM-HH:MM"
  colorInside?: number;                      // rouge dans plage
  colorOutside?: number;                     // cyan hors plage
  behavior?: "toggle-color" | "hide-outside";
  width?: number; height?: number;
  fontFamily?: string; fontSize?: number;
  pulseInside?: boolean;
};

type Range = { start: number; end: number };

function clamp(min: number, max: number, v: number) { return Math.max(min, Math.min(max, v)); }
function parseRange(s: string): Range | null {
  const m = s.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const sMin = +m[1]*60 + +m[2], eMin = +m[3]*60 + +m[4];
  return { start: clamp(0,1439,sMin), end: clamp(0,1439,eMin) };
}
function inAnyWindow(mins: number, ranges: Range[]) {
  for (const {start,end} of ranges) {
    if (start <= end ? (mins>=start && mins<end) : (mins>=start || mins<end)) return true;
  }
  return false;
}

export async function mountNeonClock(container: HTMLElement, opts: ClockOptions = {}) {
  const {
    windows = ["21:00-23:59","00:00-02:00"],
    colorInside = 0xff2d55,
    colorOutside = 0xa1ffea,
    behavior = "toggle-color",
    width = 280, height = 110,
    fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize = 48,
    pulseInside = true,
  } = opts;

  const ranges = windows.map(parseRange).filter(Boolean) as Range[];

  // Taille initiale
  const rect = container.getBoundingClientRect();
  const initW = Math.round(rect.width || width);
  const initH = Math.round(rect.height || height);

  // v8: Application async + app.canvas
  const app = new Application();
  await app.init({
    width: initW, height: initH,
    antialias: true, backgroundAlpha: 0,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
  });
  app.canvas.style.width = `${initW}px`;
  app.canvas.style.height = `${initH}px`;
  app.canvas.style.pointerEvents = "none";
  app.canvas.style.display = "block";
  container.appendChild(app.canvas);

  // Style texte (objet, pas besoin de new TextStyle en v8)
  const baseStyle = {
    fontFamily, fontSize, fontWeight: "800" as const,
    fill: colorOutside,
    letterSpacing: 2,
    dropShadow: { color: "#000000", blur: 6, distance: 0 },
  };

  // v8: nouveau constructeur
  const textGlow = new Text({ text: "--:--", style: baseStyle, anchor: 0.5 });
  const textMain = new Text({ text: "--:--", style: baseStyle, anchor: 0.5 });
  textGlow.position.set(initW/2, initH/2);
  textMain.position.set(initW/2, initH/2);

  // Glow (deux flous)
  textGlow.filters = [new BlurFilter(8), new BlurFilter(20)];
  textGlow.alpha = 0.6;

  app.stage.addChild(textGlow, textMain);

  const label = new Text({
    text: "Clock",
    style: { fontFamily, fontSize: 14, fill: 0xffffff }
  });
  label.position.set(6, 6);
  label.alpha = 0.85;
  app.stage.addChild(label);

  const nowMinutesLocal = () => {
    const d = new Date(); return d.getHours()*60 + d.getMinutes();
  };
  const timeStr = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  };

  let lastSec = -1;
  app.ticker.add(() => {
    const sec = new Date().getSeconds();

    // rafraîchir chaque seconde
    if (sec !== lastSec) {
      lastSec = sec;
      const inWin = inAnyWindow(nowMinutesLocal(), ranges);
      const visible = behavior === "toggle-color" ? true : inWin;
      const c = inWin ? colorInside : colorOutside;

      textGlow.style.fill = c;
      textMain.style.fill = c;

      const ts = timeStr();
      textGlow.text = ts;
      textMain.text = ts;

      app.canvas.style.visibility = visible ? "visible" : "hidden";
    }

    // petit pulse si dans la plage
    if (pulseInside && inAnyWindow(nowMinutesLocal(), ranges)) {
      const t = performance.now()/1000;
      const s = 1 + Math.sin(t*2)*0.02;
      textGlow.scale.set(s);
      textMain.scale.set(s);
    } else {
      textGlow.scale.set(1);
      textMain.scale.set(1);
    }
  });

  // Resize si le conteneur change
  const ro = new ResizeObserver(() => {
    const r2 = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(r2.width || initW));
    const h = Math.max(1, Math.round(r2.height || initH));
    app.renderer.resize(w, h); // v8: resize(width, height)
    textGlow.position.set(w/2, h/2);
    textMain.position.set(w/2, h/2);
    label.position.set(6, 6);
  });
  ro.observe(container);

  // Pause quand onglet caché
  const onVis = () => { document.hidden ? app.ticker.stop() : app.ticker.start(); };
  document.addEventListener("visibilitychange", onVis);

  return {
    destroy() {
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      app.destroy(true);
      container.innerHTML = "";
    },
  };
}
