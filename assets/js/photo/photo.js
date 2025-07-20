import { storage } from '../firebase/firebase-config.js';
import { ref as sRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js';

const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const snapBtn = document.getElementById('snap');

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    alert('Erreur caméra : ' + err);
  });

let lastUploadTime = 0;

snapBtn.addEventListener('click', async () => {
  const now = Date.now();
  if (now - lastUploadTime < 30000) {
    alert("Attends un peu avant de reprendre une photo !");
    return;
  }
  lastUploadTime = now;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  canvas.toBlob(uploadPhoto, 'image/jpeg');
});

async function uploadPhoto(blob) {
  const filename = `photo_${Date.now()}.jpg`;
  const fileRef = sRef(storage, 'photos/' + filename);

  try {
    await uploadBytes(fileRef, blob);
    const url = await getDownloadURL(fileRef);
    console.log('📸 Upload terminé :', url);
    alert("Photo uploadée !");
  } catch (err) {
    console.error('Erreur upload :', err);
    alert("Échec de l’upload");
  }
}