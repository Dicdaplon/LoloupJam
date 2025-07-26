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

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Erreur caméra : " + err.message);
    });

  let imageBlob = null;

  snap.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      imageBlob = blob;
      upload.disabled = false;
      alert("📸 Photo capturée !");
    }, "image/jpeg", 1.0); // Qualité max
  });

  upload.addEventListener("click", async () => {
    if (!imageBlob) {
      alert("Aucune image capturée.");
      return;
    }

    const timestamp = Date.now();

    // 🔶 Chemins pour upload
    const originalRef = ref(storage, `originals/photo-${timestamp}.jpg`);
    const compressedRef = ref(storage, `compressed/photo-${timestamp}.jpg`);

    try {
      // ✅ Upload version originale
      await uploadBytes(originalRef, imageBlob);
      console.log("✅ Originale uploadée :", originalRef.fullPath);

      // ✅ Création version compressée
      const compressedBlob = await createCompressedBlob(canvas, 0.5); // qualité 50%
      await uploadBytes(compressedRef, compressedBlob);
      console.log("✅ Comprimée uploadée :", compressedRef.fullPath);

      alert("✅ Les deux versions ont été envoyées !");
    } catch (err) {
      console.error("❌ Erreur upload :", err);
      alert("Erreur lors de l’envoi : " + err.message);
    }
  });

  // 📦 Fonction pour compresser une image depuis le canvas
  async function createCompressedBlob(canvas, quality = 0.5) {
    return new Promise((resolve) => {
      const tempCanvas = document.createElement("canvas");
      const maxWidth = 800; // taille cible

      const ratio = maxWidth / canvas.width;
      tempCanvas.width = maxWidth;
      tempCanvas.height = canvas.height * ratio;

      const ctx = tempCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

      tempCanvas.toBlob(blob => {
        resolve(blob);
      }, "image/jpeg", quality);
    });
  }
});
