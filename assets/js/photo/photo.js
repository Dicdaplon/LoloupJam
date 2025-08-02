import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { storage } from "../firebase/firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const snap = document.getElementById("snap");

  let imageBlob = null;

  // ✅ Fonction pour initialiser la caméra avec fallback
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

      // ✅ Log de la résolution réelle quand chargée
      video.onloadedmetadata = () => {
        console.log("🎥 Résolution réelle :", video.videoWidth + "x" + video.videoHeight);
      };
    } catch (err) {
      console.warn("⚠️ HD non dispo, fallback :", err.message);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
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

  // 📸 Lancer la caméra au chargement
  startCamera();

snap.addEventListener("click", () => {
  if (video.readyState < 2) {
    alert("📷 La caméra n’est pas encore prête !");
    return;
  }

  snap.disabled = true;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const flash = document.createElement("div");
flash.style.position = "fixed";
flash.style.top = 0;
flash.style.left = 0;
flash.style.width = "100vw";
flash.style.height = "100vh";
flash.style.background = "white";
flash.style.opacity = "0.7";
flash.style.zIndex = 9999;
flash.style.transition = "opacity 0.4s ease";

document.body.appendChild(flash);
setTimeout(() => {
  flash.style.opacity = "0";
  setTimeout(() => flash.remove(), 400);
}, 50);

  canvas.toBlob(async (blob) => {
    if (!blob) {
      alert("Erreur lors de la capture de l'image.");
      snap.disabled = false;
      return;
    }

    const timestamp = Date.now();
    const originalRef = ref(storage, `originals/photo-${timestamp}.jpg`);
    const compressedRef = ref(storage, `compressed/photo-${timestamp}.jpg`);

    try {
      // ✅ Upload originale
      await uploadBytes(originalRef, blob);
      console.log("✅ Originale uploadée :", originalRef.fullPath);

      // ✅ Créer et uploader la version compressée
      const compressedBlob = await createCompressedBlob(canvas, 0.5);
      await uploadBytes(compressedRef, compressedBlob);
      console.log("✅ Comprimée uploadée :", compressedRef.fullPath);

      alert("📸 Photo prise et envoyée !");
    } catch (err) {
      console.error("❌ Erreur upload :", err);
      alert("Erreur lors de l’envoi : " + err.message);
    } finally {
      snap.disabled = false;
    }
  }, "image/jpeg", 1.0);
});

  async function createCompressedBlob(canvas, quality = 0.5) {
    return new Promise((resolve) => {
      const tempCanvas = document.createElement("canvas");
      const maxWidth = 800;
      const ratio = maxWidth / canvas.width;

      tempCanvas.width = maxWidth;
      tempCanvas.height = canvas.height * ratio;

      const ctx = tempCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

      tempCanvas.toBlob(blob => resolve(blob), "image/jpeg", quality);
    });
  }
});