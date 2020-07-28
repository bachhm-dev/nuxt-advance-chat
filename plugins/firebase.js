// Your web app's Firebase configuration
import firebase from 'firebase'
const firebaseConfig = {
  apiKey: 'AIzaSyAfOvetF_9OUqrYra8lFVCMkJf9GnkzDaM',
  authDomain: 'fir-chat-b5217.firebaseapp.com',
  databaseURL: 'https://fir-chat-b5217.firebaseio.com',
  projectId: 'fir-chat-b5217',
  storageBucket: 'fir-chat-b5217.appspot.com',
  messagingSenderId: '485837392671',
  appId: '1:485837392671:web:0da90a37b7225dea3e7e2a',
  measurementId: 'G-1YD3681LRK',
}
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
