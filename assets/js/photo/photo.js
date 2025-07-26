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
  const upload = document.getElementById("upload");

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

  // ✅ Capture sécurisée une fois que la vidéo est prête
  snap.addEventListener("click", () => {
    if (video.readyState < 2) {
      alert("📷 La caméra n’est pas encore prête !");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      imageBlob = blob;
      upload.disabled = false;
      alert("📸 Photo capturée !");
    }, "image/jpeg", 1.0);
  });

  // ✅ Upload original + compressé
  upload.addEventListener("click", async () => {
    if (!imageBlob) {
      alert("Aucune image capturée.");
      return;
    }

    const timestamp = Date.now();
    const originalRef = ref(storage, `originals/photo-${timestamp}.jpg`);
    const compressedRef = ref(storage, `compressed/photo-${timestamp}.jpg`);

    try {
      await uploadBytes(originalRef, imageBlob);
      console.log("✅ Originale uploadée :", originalRef.fullPath);

      const compressedBlob = await createCompressedBlob(canvas, 0.5);
      await uploadBytes(compressedRef, compressedBlob);
      console.log("✅ Comprimée uploadée :", compressedRef.fullPath);

      alert("✅ Les deux versions ont été envoyées !");
    } catch (err) {
      console.error("❌ Erreur upload :", err);
      alert("Erreur lors de l’envoi : " + err.message);
    }
  });

  // ✅ Compression d’image
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
