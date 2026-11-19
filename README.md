# 🧙‍♂️ Blood on the Clocktower — Pocket Grimoire (MVP)

[![CI](https://github.com/IvanK-9/grimoire/actions/workflows/ci.yml/badge.svg)](https://github.com/IvanK-9/grimoire/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ivank-9.github.io/grimoire/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com/)
[![Oxlint](https://img.shields.io/badge/linter-oxlint-orange)](https://oxc.rs/)

> En kompakt, snabb och mobilanpassad webbassistent för berättaren (Storyteller) i brädspelet **Blood on the Clocktower**. Optimerad för riktiga spel runt bordet och för att användas från en smartphone i mörker.

🌐 **Livedemo (GitHub Pages):** [https://ivank-9.github.io/grimoire/](https://ivank-9.github.io/grimoire/)

---

## 🎯 Varför det här projektet?

Befintliga digitala assistenter har centrala UX-problem när man leder spel på plats:
1. **[botc.games/play](https://botc.games/play):** Opraktiskt UX för ett fysiskt bord — kräver att man först skriver in alla spelares namn och först därefter tilldelar roller.
2. **BOTCH (Google Play):** Föråldrat och överbelastat gränssnitt.
3. **Ingen mekanik för Fyllot (Drunk):** Ingen av de populära apparna låter berättaren redan när påsen sätts ihop välja den falska stadsbo-polett (*Townsfolk disguise*) som fysiskt läggs i påsen i stället för fyllots polett.

**BotC Pocket Grimoire** löser just dessa problem: berättaren sätter ihop påsen, väljer fyllots förklädnad och fördelar sedan rollerna på platserna med ett tryck, i takt med att spelarna fysiskt drar poletter.

---

## ✨ Implementerade funktioner (MVP)

- 📜 **Stöd för officiella skript:**
  - Den klassiska utgåvan **Trouble Brewing** (22 roller) är inbyggd.
  - Knappen **Ladda JSON** stöder import av skript direkt från den officiella editorn [script.bloodontheclocktower.com](https://script.bloodontheclocktower.com/) (både listor med ID:n och objekt med metadata stöds).
- 🎒 **1. Påse (sätta ihop påsen):**
  - Snabbt val av roller, färggrupperade efter lag (*Stadsbor, Utbölingar, Hantlangare, Demoner*).
  - **Automatisk kontroll av Fyllot (Drunk):** om Fyllo väljs kräver appen att man väljer en stadsbo som inte är med i spelet som fysisk förklädnad i påsen.
  - Indikator för antal spelare och om påsen är klar.
- 🪑 **2. Platser (placering med ett tryck):**
  - Platser skapas automatiskt utifrån antalet roller i påsen.
  - Den dragna poletten tilldelas med ett klick via ett smidigt modalfönster.
  - Spelarnamn är valfria — de kan anges direkt eller fyllas i senare.
  - Berättaren ser den verkliga rollen: när fyllots förklädnad dras visas etiketten **FYLLO**.
  - Lista i realtid över de poletter som ännu inte tilldelats och ligger kvar i påsen.
  - Knappen **👁️ Visa** på en tilldelad plats visar den dragna poletten, med förmåga och lag, som ett kort med stor text för spelaren. Fyllot får se sin förklädnad, aldrig att den är fyllot.
- 🌙 **3. Kort (nattläge / stor text):**
  - Gör det möjligt för berättaren att kommunicera helt tyst under natten, utan ljud som kan avslöja något.
  - Nås via fliken **3. Kort** eller via 🌙-knappen i sidhuvudet.
  - Varje kort visas i helskärm med svart bakgrund, hög kontrast och mycket stor text, så att det går att läsa på 1–1,5 meters avstånd i mörker. Tryck var som helst på skärmen för att stänga kortet.
  - **Eget meddelande:** skriv valfri text och visa den stort med **Visa stort**.
  - **Snabbsvar och antal:** **JA**, **NEJ** och siffrorna **0–3**.
  - **Officiella nattinstruktioner:** färdiga kort, bland annat ”Välj en spelare”, ”Peka på 2 spelare”, ”Välj en karaktär”, ”Detta är dina hantlangare”, ”Detta är din demon”, ”Blunda”, ”Nominerade du i dag?” och ”Röstade du i dag?”.
  - **Visa karaktärspolett:** visar en karaktär med ikon, lag och förmåga. Listan innehåller rollerna i påsen, eller hela skriptet om påsen är tom.
- 📶 **Offlineläge (PWA):**
  - Appen är en Progressive Web App och kan installeras på telefonens hemskärm. Den öppnas då i helskärm utan webbläsarens adressfält.
  - Efter första besöket sparas alla filer i telefonen av en service worker, så appen fungerar helt utan nätverk, t.ex. i källare, på barer och i lokaler utan mottagning.
  - Nya versioner hämtas och installeras automatiskt nästa gång appen öppnas med nätverk.
- 💾 **Spelet sparas på enheten:**
  - Valt skript, påsens innehåll, fyllots förklädnad, platser med spelarnamn och utdelade poletter samt aktiv flik sparas automatiskt i webbläsarens `localStorage`.
  - Om appen stängs, telefonen låses eller sidan laddas om fortsätter spelet där det var.
  - Inget konto eller inloggning behövs, och ingen data skickas till någon server.
  - Knappen **↺ Återställ** rensar pågående spel (påse, fyllots förklädnad och platser). Det inlästa skriptet behålls.

---

## 🛠 Teknikstack

* **Frontend:** [React 19](https://react.dev/)
* **Bundler & dev-server:** [Vite 8](https://vite.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
* **Linter:** [Oxlint](https://oxc.rs/) (ultrasnabb linter skriven i Rust)
* **PWA / offline:** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (service worker via Workbox, webbappmanifest)
* **CI/CD:** GitHub Actions (automatisk kontroll med `oxlint` + `build` vid varje push/PR) + `gh-pages`

---

## 🚀 Snabbstart

### Krav
* [Node.js](https://nodejs.org/) v20+ (v22+ rekommenderas)
* npm v10+

### Installation och körning

```bash
# Klona repot
git clone https://github.com/IvanK-9/grimoire.git
cd grimoire

# Installera beroenden
npm install

# Starta dev-servern med HMR
npm run dev

# Kör lintern (Oxlint)
npm run lint

# Bygg produktionspaketet
npm run build

# Förhandsgranska produktionsbygget lokalt
npm run preview
```

### Installera på telefonen (offline)
1. Öppna [livedemon](https://ivank-9.github.io/grimoire/) (eller din egen driftsatta version) i telefonens webbläsare medan du har nätverk.
2. **Android (Chrome):** öppna menyn ⋮ och välj **Installera app** eller **Lägg till på startskärmen**.
   **iPhone (Safari):** tryck på dela-knappen och välj **Lägg till på hemskärmen**.
3. Starta appen från hemskärmen en gång med nätverk. Därefter fungerar den offline.

> **Obs!** Sparad speldata ligger i den webbläsare och på den enhet där appen används. Om du rensar webbläsarens webbplatsdata, eller avinstallerar appen, försvinner sparade spel.

### Testa offlineläget lokalt
Utvecklingsservern (`npm run dev`) registrerar ingen service worker. Bygg och förhandsgranska i stället produktionsversionen:
```bash
npm run build
npm run preview
```
Öppna `http://localhost:4173/grimoire/`, ladda sidan en gång och slå sedan på **Offline** under fliken **Network** i webbläsarens utvecklarverktyg (F12). Ladda om sidan — appen ska fortfarande fungera.

### Driftsättning
Driftsätt produktionsbygget på GitHub Pages:
```bash
npm run deploy
```

---

## 📁 Projektstruktur

```text
grimoire/
├── .github/
│   └── workflows/
│       └── ci.yml               # CI-pipeline (oxlint-linter + vite build)
├── public/                      # PWA-ikoner och favicon
├── human_input/                 # ⚠️ STRIKT READ-ONLY FÖR AI (mänskliga krav)
│   └── requirements.md          # Teamets fastslagna beslut och krav på MVP:n
├── src/
│   ├── assets/                  # Grafik och ikoner
│   ├── components/
│   │   └── NightFlashcards.jsx  # Nattläget: kort med stor text i helskärm, snabbsvar, nattinstruktioner
│   ├── App.jsx                  # Applogik (Påse, Platser, Fyllo, JSON-inläsning, sparning i localStorage)
│   ├── index.css                # Inkludering av Tailwind CSS v4
│   └── main.jsx                 # Ingångspunkt för React
├── AGENTS.md                    # Instruktioner för AI-agenter (skydd av human_input)
├── index.html                   # HTML-stomme
├── package.json                 # Beroenden och skript
└── vite.config.js               # Konfiguration av Vite, Tailwind v4 och PWA (manifest + service worker)
```

---

## 👥 Regler för arbete med kraven (`human_input/`)

Projektet har en strikt gräns mellan kod och mänskliga krav:
* Mappen [`human_input/`](./human_input/) innehåller de ursprungliga formuleringarna, teamets beslut och begränsningar.
* I filen [`AGENTS.md`](./AGENTS.md) slås regeln fast: **alla AI-assistenter (Gemini, Claude, Copilot) är förbjudna att ändra eller skriva över filer i den här katalogen**. Mänskliga överenskommelser förblir oförändrade.

---

## 🩺 Logg över åtgärdade brister (Post-Mortem & Fixes)

Vid den första granskningen av projektet hittades följande tekniska brister, som alla har åtgärdats:

| Före (problem) | Efter (lösning) |
|---|---|
| **Två driftsättningssystem:** `package.json` innehöll `gh-pages`, samtidigt som en trasig `.gitlab-ci.yml` låg bredvid. | Den döda `.gitlab-ci.yml` togs bort. En fullständig GitHub Actions-CI (`.github/workflows/ci.yml`) sattes upp och driftsättningen låstes till GitHub Pages. |
| **CI utan kontroller:** Lintern kördes inte i pipelinen. | Ett obligatoriskt steg `npm run lint` (Oxlint) före bygget lades till i CI-pipelinen. |
| **Skräp i roten:** Slumpmässigt genererade filer `gemini-code-*.yaml` och `gemini-code-*.js`. | Alla tillfälliga artefakter togs bort från repot. |
| **Osynkade beroenden (`npm ls`-fel):** Versionerna av `@vitejs/plugin-react` (^4.3.4) och `oxlint` (^0.15.0) orsakade `ELSPROBLEMS` med Vite 8 installerat. | Beroendena i `package.json` synkades med de faktiska (`@vitejs/plugin-react@^6.2.1`, `oxlint@^1.91.0`). `npm ls` avslutas med kod 0 utan fel. |
| **Onödiga paket:** `@types/react`, `@types/react-dom` (trots att TS inte används) samt oanvända `common-tags`. | De onödiga paketen togs bort från `devDependencies`. |
| **Tom README:** Standardmallen från Vite. | En utförlig, produktionsklar README skrevs med beskrivning av projektet, stacken, körning och arkitekturbeslut. |
