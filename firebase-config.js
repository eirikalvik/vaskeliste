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
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
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
