import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Platform } from 'react-native';
// 1. Import Firestore
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFFWd82UPzjT8EspAp_RViH8skt8Ls99s",
  authDomain: "flightscope777-66c64.firebaseapp.com",
  projectId: "flightscope777-66c64",
  storageBucket: "flightscope777-66c64.firebasestorage.app",
  messagingSenderId: "664420358609",
  appId: "1:664420358609:web:4ac500fb2fe59707a768f0"
};

const app = initializeApp(firebaseConfig);

// 2. Initialize Firestore
const db = getFirestore(app);

let auth: Auth;

if (Platform.OS === 'ios' || Platform.OS === 'android') {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  auth = getAuth(app);
}

// 3. Export db along with app and auth
export { app, auth, db };
