// Configuração do Firebase
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAOxZ8VH3FoU5FXB0OYa6VVOLpn_e6yw34",
  authDomain: "quizods-testesoftware.firebaseapp.com",
  projectId: "quizods-testesoftware",
  storageBucket: "quizods-testesoftware.firebasestorage.app",
  messagingSenderId: "471163098971",
  appId: "1:471163098971:web:1fd94a60d767be3e92ec7e",
  measurementId: "G-0GP5VTZCHJ"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar serviços que vamos usar
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app