import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { storage, db } from "../firebase/firebase-config.js";
import {
  ref as dbRef,
  push as dbPush
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const snap = document.getElementById("snap");

  // —— Caméra avec fallback
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        console.log("🎥 Résolution réelle :", video.videoWidth + "x" + video.videoHeight);
      };
    } catch (err) {
      console.warn("⚠️ HD non dispo, fallback :", err.message);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = fallbackStream;
        video.onloadedmetadata = () => {
          console.log("🎥 Résolution fallback :", video.videoWidth + "x" + video.videoHeight);
        };
      } catch (finalErr) {
        console.error("Erreur caméra :", finalErr);
        alert("Erreur d’accès caméra : " + finalErr.message);
      }
    }
  }
  startCamera();

  // —— Helpers Blobs
  function canvasToBlob(canvas, type = "image/jpeg", quality = 1.0) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  }

  function createCompressedBlobFromCanvas(canvas, quality = 0.6, maxWidth = 1000) {
    return new Promise((resolve) => {
      const ratio = Math.min(1, maxWidth / canvas.width);
      const w = Math.round(canvas.width * ratio);
      const h = Math.round(canvas.height * ratio);

      const tmp = document.createElement("canvas");
      tmp.width = w;
      tmp.height = h;

      const ctx = tmp.getContext("2d");
      ctx.drawImage(canvas, 0, 0, w, h);

      tmp.toBlob((blob) => resolve(blob), "image/jpeg", quality);
    });
  }

  // —— Capture + uploads + push DB
  snap.addEventListener("click", async () => {
    if (video.readyState < 2) {
      alert("📷 La caméra n’est pas encore prête !");
      return;
    }

    snap.disabled = true;

    // Flash visuel
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.inset = "0";
    flash.style.background = "white";
    flash.style.opacity = "0.7";
    flash.style.zIndex = 9999;
    flash.style.transition = "opacity 0.4s ease";
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 400);
    });

    try {
      // Dessine la frame vidéo dans le canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      // Prépare les deux blobs
      const [originalBlob, compressedBlob] = await Promise.all([
        canvasToBlob(canvas, "image/jpeg", 1.0),          // original plein format
        createCompressedBlobFromCanvas(canvas, 0.6, 1000) // compressé (ajuste qualité/maxWidth si besoin)
      ]);

      if (!originalBlob || !compressedBlob) {
        throw new Error("Impossible de générer les blobs d'image.");
      }

      const ts = Date.now();
      const originalPath = `originals/photo-${ts}.jpg`;
      const compressedPath = `compressed/photo-${ts}.jpg`;
      const originalRef = storageRef(storage, originalPath);
      const compressedRef = storageRef(storage, compressedPath);

      // Uploads en parallèle (plus rapide)
      await Promise.all([
        uploadBytes(originalRef, originalBlob),
        uploadBytes(compressedRef, compressedBlob)
      ]);

      // URL publique de la version compressée
      const compressedUrl = await getDownloadURL(compressedRef);

      // Push DB (seule la compressée intéresse l'écran)
      await dbPush(dbRef(db, "messages"), {
        text: "photo:" + compressedUrl,
        timestamp: Date.now()
      });

      alert("📸 Photo envoyée ! Elle va s’afficher sur l’écran.");
    } catch (err) {
      console.error("❌ Erreur upload :", err);
      alert("Erreur lors de l’envoi : " + err.message);
    } finally {
      snap.disabled = false;
    }
  });
});
