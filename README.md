# 🧹 Vaskeliste for Kollektivet

En moderne, elegant og roterende vaskeplan bygget for bofellesskap og kollektiv.

## ✨ Funksjoner
- **Roterende vaskeansvar:** Automatisk beregning av ISO-uker og hvem som har vaskeansvar (helt ut uke 52 med mulighet for å utvide til neste år).
- **Flere kollektiv:** Logg inn med adresse eller kollektivnavn uten passord. Flere kollektiv kan bruke samme nettside uavhengig av hverandre.
- **Dypvask og sjeldnere oppgaver:** Registrer fullføring med dato og notat, enten i kortvisning eller i full kalendervisning.
- **PWA (Progressive Web App):** Kan installeres rett på Hjem-skjermen på iPhone og Android som en ekte app.
- **Sky-synkronisering (Valgfritt & Gratis):** Støtte for sanntidsdeling via Google Firebase Firestore slik at alle beboere ser oppdateringer umiddelbart.

---

## 🚀 Slik publiserer du på GitHub (GitHub Pages)

### Trinn 1: Opprett et nytt repo på GitHub
1. Gå til [github.com/new](https://github.com/new) og logg inn.
2. Gi repoet et navn, for eksempel: `vaskeliste`
3. La det være **Public** (slik at GitHub Pages er gratis).
4. Ikke huk av for README eller .gitignore (vi har allerede laget det).
5. Klikk **Create repository**.

### Trinn 2: Koble til og push fra terminalen
Kjør disse kommandoene i terminalen i denne mappen:

```bash
git add .
git commit -m "Initial commit av vaskeliste"
git remote add origin https://github.com/DITT-BRUKERNAVN/vaskeliste.git
git branch -M main
git push -u origin main
```
*(Bytt ut `DITT-BRUKERNAVN` med ditt faktiske GitHub-brukernavn).*

### Trinn 3: Skru på GitHub Pages
1. Gå inn på repoet ditt på GitHub.
2. Klikk på **Settings** (tannhjulet øverst til høyre).
3. I menyen til venstre, klikk på **Pages**.
4. Under **Branch**, velg `main` og mappen `/(root)`, og klikk **Save**.
5. Etter ca. 1 minutt er nettsiden din live på:  
   `https://DITT-BRUKERNAVN.github.io/vaskeliste/`

---

## ☁️ Slik aktiverer du gratis deling mellom alle mobiler (Firebase)
Hvis du vil at avkryssinger skal oppdateres direkte på romkameratenes telefoner i sanntid:
1. Gå til [console.firebase.google.com](https://console.firebase.google.com) med din vanlige Google-konto (100% gratis).
2. Klikk **Legg til prosjekt** (kall det f.eks. `vaskeliste-kollektivet`).
3. Gå til **Build** -> **Firestore Database** -> **Create database** (start i *Test mode*).
4. Gå til **Prosjektinnstillinger** -> **Dine apper** -> Web-ikonet (`</>`).
5. Kopier `firebaseConfig`-blokken.
6. Åpne vaskelisten i nettleseren, trykk på **Lokal**-knappen i toppmenyen, lim inn koden og trykk **Lagre og koble til**.
*(Du kan også lime den inn i `firebase-config.js`).*

---

## 📱 Slik legger du til som App på telefonen
- **iPhone (Safari):** Åpne nettsiden, trykk på Del-knappen (firkant med pil opp) og velg **«Legg til på Hjem-skjerm»**.
- **Android (Chrome):** Åpne nettsiden, trykk på de tre prikkene øverst til høyre og velg **«Legg til på startsiden»** eller **«Installer app»**.

---

## 🔗 Deling med romkamerater og venner
- **Eget kollektiv for venner:** Venner kan gå inn på nettsiden og skrive inn sin egen adresse (f.eks. `Elvegata 4`). De får en helt egen vaskeplan som aldri blander seg med din.
- **Direkte delelenke:** Inne i kollektivet ditt kan du trykke på **«Del lenke»** i toppmenyen. Lenken får formatet `?kollektiv=ditt_kollektiv` og tar romkameratene dine rett inn i kollektivet uten å måtte skrive inn navn!

---

## 🛠️ Utvikler-dashbord (Developer Mode)
Som administrator og utvikler kan du se og administrere alle kollektiv:
1. Klikk på **«Utvikler / Admin-modus»** nederst på innloggingssiden (eller skriv `admin` som kollektivnavn).
2. Skriv inn utvikler-passordet: **`admin`** eller **`eirik`**.
3. I dashbordet kan du:
   - Se alle opprettede kollektiv (både fra skyen og lokalt)
   - Se antall beboere og ukens fremgang for hvert kollektiv
   - Gå direkte inn og inspisere et kollektiv
   - Se rådata (JSON) eller rydde opp test-kollektiv.
