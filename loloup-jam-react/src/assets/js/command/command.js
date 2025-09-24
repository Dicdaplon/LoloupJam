// chat.js
import { db } from '../firebase/firebase-config.js';
import { ref, push, onChildAdded } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js';
import { get, child } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { loadAllPictures } from '../pictures/pictures.js';

