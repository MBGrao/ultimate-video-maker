# Brand Configuration: Localhost Labs

Measured from [localhostlabs.tech](https://localhostlabs.tech) CSS on 2026-11-05. The reference reel is `projects/localhostlabs-reel-20261105/`.

## 1. Colours (light theme first; dark section + lime for contrast scenes)

```ts
export const C = {
  page: '#f3efe4', paper: '#ece7da', paper2: '#e4dfd1', card: '#faf7ef',
  ink: '#1b1914', ink2: '#5c574c', ink3: '#8e887c',
  acc: '#f24d18',  accInk: '#c43710', accDeep: '#241910',   // orange accent, marquee text #241910
  dark: '#12110e', dark2: '#1c1a15', darkInk: '#f4f0e6', darkInk2: '#b9b3a6',
  lime: '#cff55a', limeDeep: '#1c2700',                     // dark-theme accent
  ok: '#22a35a',
};
```

## 2. Typography (all Google Fonts, free)
- Display: **Bricolage Grotesque** 800, uppercase, letter-spacing −0.045em (site hero: weight 520, −0.075em, opsz 96)
- Accent word: **Instrument Serif italic**, the brand's "labs" style. Use it for one word per headline ("*system*", "*khaata*").
- UI / body: **Instrument Sans** 500–700 · labels, logs: **JetBrains Mono** 500/700

## 3. Logo
An orange square `#f24d18` rotated −8° with "ll" in JetBrains Mono 700 (`#241910`), then "localhost" in Bricolage 600 and "labs" in Instrument Serif italic. It's rebuilt in CSS (see `projects/localhostlabs-reel-20261105/video/src/parts.tsx`: `Mark`, `Logo`).

## 4. Product truth (do not invent)
- Custom software & business automation studio, Multan, Pakistan. Also white-label engineering for agencies.
- Services: web apps (Next.js/React), mobile (Flutter/RN), UI/UX, SaaS, AI solutions, automation tools, CRM & ERP, API integrations, maintenance.
- Process: Free 30-min qualification call → paid fixed-fee Discovery & technical planning (scope, milestones, fixed cost in writing) → milestone-based development. No hourly billing. NDA by default. Reply within one business day. Weekly demos.
- Typical initial project: USD 3k–15k+ (only use this if the video is about price).
- Site UI to reuse: "automations.log" rows (09:21 Stock below 20 units → WhatsApp alert sent ✓ …), "Operations · live" panel (Orders 128 / Open invoices 3 / Stock alerts 2), "How we work" mess cards, the orange marquee tape, and the strike-through on "manual work".
- Contact: info@localhostlabs.tech · WhatsApp +92 302 0176377 · Instagram **@localhostlabs**

## 5. Voice / tone
Roman Urdu / Hinglish for Pakistani small-business owners (README playbook, `/Users/mbgrao/Desktop/brag` reel playbook), with a soft CTA: "DM karo, baat karte hain". English for agencies and international clients.

## 6. Defaults
| Item | Value |
|---|---|
| Format | 9:16 · 1080×1920 · 45–60 s explainer (playbook) |
| Voice | free: Kokoro `hm_psi` reading a Devanagari copy · paid: ElevenLabs multilingual or Azure `ur-PK` neural voice for a true Urdu accent |
| CTA | Free 30-min call · DM karo · localhostlabs.tech |
