// assets/js/pictures/pictures.js
import { getStorage, ref as storageRef, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// Charge toutes les images du dossier Firebase Storage "Pictures/"
export function loadAllPictures(callback) {
  const storage = getStorage();
  const folderRef = storageRef(storage, 'Pictures/');

  listAll(folderRef)
    .then((res) => {
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          callback(url);
        });
      });
    })
    .catch((error) => {
      console.error("Erreur chargement des images Firebase:", error);
    });
}

function setCameraHeightToViewport() {
  const vh = window.innerHeight * 0.01;
  const container = document.getElementById("camera-container");

  if (container) {
    container.style.height = `${vh * 100}px`;
  }
}

// Exécuter au chargement et sur resize/orientation
window.addEventListener("DOMContentLoaded", setCameraHeightToViewport);
window.addEventListener("resize", setCameraHeightToViewport);
window.addEventListener("orientationchange", setCameraHeightToViewport);