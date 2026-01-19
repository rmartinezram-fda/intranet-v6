import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// ¡IMPORTANTE! Sustituye esto por tu ID real de la consola de Google
const GOOGLE_CLIENT_ID = "1034265686318-fpkn3ml2cm7bg59p7igt01jtbe1im8qc.apps.googleusercontent.com"; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)