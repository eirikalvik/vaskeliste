# Vaskeliste for Kollektivet

En moderne, elegant og roterende vaskeplan bygget for bofellesskap og kollektiv.

## Funksjoner
- **Roterende vaskeansvar:** Automatisk beregning av ISO-uker og hvem som har vaskeansvar (helt ut uke 52 med mulighet for å utvide til neste år).
- **Flere kollektiv:** Logg inn med adresse eller kollektivnavn uten passord. Flere kollektiv kan bruke samme nettside uavhengig av hverandre.
- **Dypvask og sjeldnere oppgaver:** Registrer fullføring med dato og notat, enten i kortvisning eller i full kalendervisning.
- **PWA (Progressive Web App):** Kan installeres rett på Hjem-skjermen på iPhone og Android som en app.
- **Sky-synkronisering (Valgfritt):** Støtte for sanntidsdeling via Google Firebase Firestore slik at alle beboere ser oppdateringer umiddelbart.

---

## Publisering på GitHub (GitHub Pages)

### Trinn 1: Gjør repoet Public
GitHub Pages for gratis-kontoer krever at repoet er offentlig (Public):
1. Gå til innstillingene for repoet på GitHub (**Settings**).
2. Scroll ned til **Danger Zone** nederst på siden.
3. Klikk på **Change repository visibility** og velg **Make public**.

### Trinn 2: Skru på GitHub Pages
1. Gå til **Settings** -> **Pages** i venstremenyen.
2. Under **Branch**, velg `main` og mappen `/(root)`.
3. Klikk **Save**.
4. Etter et par minutter er nettsiden tilgjengelig på:  
   `https://eirikalvik.github.io/vaskeliste/`

---

## Sky-synkronisering (Firebase Cloud Sync)
Hvis du vil at avkryssinger skal oppdateres direkte på romkameratenes telefoner i sanntid:
1. Gå til [console.firebase.google.com](https://console.firebase.google.com) med din Google-konto.
2. Opprett et prosjekt (f.eks. `vaskeliste-kollektivet`).
3. Gå til **Build** -> **Firestore Database** -> **Create database** (start i *Test mode*).
4. Gå til **Prosjektinnstillinger** -> **Dine apper** -> Web-ikonet (`</>`).
5. Kopier `firebaseConfig`-blokken og lim den inn i `firebase-config.js` under `DEFAULT_FIREBASE_CONFIG`.
6. Gjør en git commit og push til GitHub. Alle brukere kobles da automatisk til skyen.

---

## Installasjon som app på telefon (PWA)
- **iPhone (Safari):** Åpne nettsiden, trykk på Del-knappen (firkant med pil opp) og velg **Legg til på Hjem-skjerm**.
- **Android (Chrome):** Åpne nettsiden, trykk på menyknappen (tre prikker) og velg **Legg til på startsiden** eller **Installer app**.

---

## Deling med romkamerater og venner
- **Eget kollektiv for venner:** Venner kan gå inn på nettsiden og skrive inn sin egen adresse (f.eks. `Elvegata 4`). De får en helt egen vaskeplan som aldri blander seg med din.
- **Direkte delelenke:** Inne i kollektivet kan man trykke på **Del lenke** i toppmenyen. Lenken får formatet `?kollektiv=ditt_kollektiv` og tar beboere rett inn i kollektivet uten å måtte skrive inn navn.

---

## Utvikler- og administratorvisning
For administratorer finnes det et dedikert utvikler-dashbord:
- Tilgjengelig via lenken nederst på innloggingssiden.
- Beskyttet med administrator-PIN.
- Gir overblikk over aktive kollektiv, dataflyt og inspeksjon.
