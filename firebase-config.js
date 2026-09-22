/* =========================================================
   Firebase Cloud Sync Configuration
   =========================================================
   For å aktivere gratis sanntidssynkronisering mellom alle telefoner:
   1. Gå til https://console.firebase.google.com (100% gratis Google-konto)
   2. Klikk "Legg til prosjekt" (f.eks. "vaskeliste-kollektivet")
   3. Gå til "Build" -> "Firestore Database" -> "Create database" (start i "Test mode")
   4. Gå til Prosjektinnstillinger -> "Dine apper" -> Web (</>) -> Registrer app
   5. Lim inn config-verdiene nedenfor (eller lim dem inn direkte i appens innstillinger):
*/

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCODLYRzEhOrI4eedw3qYafcCU5zJ29bxY",
  authDomain: "vaskeliste-7f124.firebaseapp.com",
  projectId: "vaskeliste-7f124",
  storageBucket: "vaskeliste-7f124.firebasestorage.app",
  messagingSenderId: "826370211325",
  appId: "1:826370211325:web:7d4fe8c1b915bf24936d94"
};

function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem('vaske_firebase_custom_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.projectId) return parsed;
    }
  } catch (e) {
    console.warn('Could not read custom Firebase config:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

function isFirebaseConfigured() {
  const cfg = getActiveFirebaseConfig();
  return Boolean(cfg && cfg.projectId && (cfg.apiKey || cfg.projectId.length > 2));
}
