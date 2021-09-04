import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: 'AIzaSyAvgwq7sDHa8PDFifKxbz8S-WKq1JloY78',
  authDomain: 'sk-chat-app.firebaseapp.com',
  projectId: 'sk-chat-app',
  storageBucket: 'sk-chat-app.appspot.com',
  messagingSenderId: '1009227718392',
  appId: '1:1009227718392:web:d7e96760f961685f86a50d',
  measurementId: 'G-0DJ3HZSECK',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
