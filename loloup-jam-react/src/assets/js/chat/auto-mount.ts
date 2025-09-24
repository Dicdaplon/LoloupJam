import { mountNeonClock, type ClockOptions } from "./NeonClock";

const els = document.querySelectorAll<HTMLElement>("[data-jam-clock]");
for (const el of els) {
  let opts: ClockOptions = {};
  try { if (el.dataset.jamClock) opts = JSON.parse(el.dataset.jamClock); } catch {}
  if (!el.style.width) el.style.width = "280px";
  if (!el.style.height) el.style.height = "110px";
  if (!el.style.pointerEvents) el.style.pointerEvents = "none";
  await mountNeonClock(el, opts); // TLA ok avec Vite
}
