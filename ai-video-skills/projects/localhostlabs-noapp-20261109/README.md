# localhostlabs: "You Probably Don't Need an App"

**Output:** `localhostlabs-you-dont-need-an-app.mp4` · 42.7 s · 1080×1920 · 30 fps · −14 LUFS
- **Poster:** `.jpg`, the cover from the brief ("YOU DON'T NEED AN APP" across the top third), baked in as frame 0.
- **Subtitles:** `.srt`, and also burned into the video.
- **Caption:** `.caption.txt`, ig-caption lint READY.

**Brief:** "Reel Script — You Probably Don't Need an App" (Nov 9, 2026). The words are the script's own, beat for beat.

## What changed from the brief, and why
**There is no talking head or screen recording to cut,** so:
- The voice is ElevenLabs **Liam**, the same English voice as the earlier localhostlabs reels.
- All the B-roll is rebuilt as animated UI in Remotion. That covers the sheet filling itself, the copy-paste by hand, the phone app vs the dashboard, the cluttered screen, and the hand-drawn one-page plan.
- The brief says the first frame must have "your face, the text and motion". Here it has text and motion: a client's "I need an app." message, with an inbox of similar requests drifting behind it.
- **No AI face was generated to stand in for the team.** That would misrepresent who you are.

**If you film the A-roll later,** the voice track and every effect timing can stay. Only the background of the hook, stay and CTA beats would change.

## Beats and effects (each one lands on its word)
| Time | Beat | On screen | Effect | SFX |
|---|---|---|---|---|
| 0.0–2.8 | Hook | "I need an app." from a new client, inbox drifting behind | Punch-in 100→125% over 4 frames on **"app"**, I NEED / AN APP. slam, 2 white impact frames, 6-frame shake | notification, **bass hit on "app"** |
| 2.8–5.8 | Contradict | I NEED AN APP crossed out → **YOU NEED AUTOMATION.** + orders.xlsx filling itself (AUTO-SYNC) | Strikethrough on **"don't"** (5 frames). **Blade slice** on "They": a 20° cut, both halves slide off and reveal the sheet | **record scratch on "don't"** (music cuts out), **sword swish** on the slice |
| 5.8–9.7 | Stay | **3** QUESTIONS to tell · three locked question cards · budget bar draining to 0% on "die" | Counter **0/3** appears top-right and stays to the end | soft tick |
| 9.7–16.7 | Q1 | Split screen: CUSTOMERS → APP (shop app) / TEAM → TOOL (ops dashboard) · INTERNAL TOOL ✓ · ~~App Store listing~~ | Split enters. On **"team"** the top half slides away and the dashboard takes the frame. Counter 1/3 | whoosh, **click on "team"** |
| 16.7–25.9 | Q2 | IT REPEATS? · Mon–Fri, the same 3 jobs · copy-paste from WhatsApp to the sheet by hand (Ctrl C / Ctrl V) · **AUTOMATE IT.** | **Speed ramp** 1× → 8× on "pulling", with a spinning clock and a time-spent counter. Hard cut to the **clone-row** sheet (one row every 2 frames). Counter 2/3 | **fast typing**, fast clock, **one ding on "automate"** |
| 25.9–34.0 | Q3 | Overhead desk: "Can you draw it on one page?" and a 3-box flow, **written on by a marker** · red scribble + DON'T BUILD YET · cluttered half-built project | **Paper tear** in. **Write-on** handwriting, with the pen following the line. **Layer explode** on "explode": 4 layers fly apart. Counter 3/3 | **paper rip, pen scratch, low boom on "explode"** |
| 34.0–42.7 | CTA | The finished page, stamped SCOPED ✓ → "// lines of code written: 0" · COMMENT · **SCOPE** comment bubble · "…and I'll DM you our one-page scope checklist." · logo lower third with localhostlabs.tech | **Rack focus** from the paper to the CTA. **Comment drop** with overshoot and settle. Logo lower third for the last 2 s | stamp, **notification pop** on the bubble |

## How it was made
- **Voice:** ElevenLabs `eleven_v3`, Liam, sped up 7% with pitch kept, so the 115 words land at 40 s of speech.
  - The q2 take was regenerated once, because the first take sounded like "Type 2".
  - Whisper reads every line back word for word from the final mix.
- **Music:** ElevenLabs `music_v1`, composed with a plan cut to the reel's own beats: cold open, then groove, then tension under question 3, then resolve. It drops out on "don't" and comes back on the blade slice.
- **SFX:** ElevenLabs bass hit, sword, tick, click, fast clock, paper rip, pen and boom, plus earlier packs (notification, scratch, typing, ding, stamp, pop, swoosh).
- **Mix:** the voice is levelled per line and sits 16.5 dB above the music while it speaks. The music returns between lines. The final mix is −14 LUFS.
- **Images:** OpenAI `gpt-image-2.6-sunburst` for the overhead desk with a blank page, and `gpt-image-1.5` for a transparent marker-pen cut-out. Two images in total.
- **Motion:** Remotion. Every effect is a pure function of time and pinned to word timestamps (`video/src/timeline.json`). The cover is its own still composition, `Cover`.

## Hook score (hookscore.py)
- "Every client walks in saying: 'I need an app.' Most of them don't." scores **55.8 (OK)**. Its weakest signal is FRONTLOAD.
- The contradiction lands at 3.2 s, which is what carries the hook. The scripted cover ("YOU DON'T NEED AN APP") is the thumbnail.

## Illustrative data
- The bakery orders, the customer names, "Fresh Bakes" and `ops.freshbakes.internal` are invented demo data, not client work. So no permission or blurring is needed.

## Before you post (from the brief, still on you)
- [ ] **Write the one-page SCOPE checklist.** The reel promises it.
- [ ] Set up an auto-DM for **SCOPE**, or reply by hand within a few hours.
- [ ] Post it as a **trial reel** first. After 48 h, check the retention dips at 0:03 and 0:10.
- [ ] The caption is yours, with one edit: Q1 now reads "customers (maybe an app) or your team (an internal tool)?", so "internal tool" is searchable. It passes the lint. ig-human scores it 62.9 (REVIEW); the numbered list makes the sentence rhythm very even.

---

# Hindi version (`localhostlabs-you-dont-need-an-app-hindi.mp4`)

**Output:** 52.8 s · 1080×1920 · −14 LUFS · same cover as frame 0 · `.srt` in Roman Hindi · Hinglish caption `.caption.txt` (lint READY)

**The visuals are the same as the English version.** Every effect, card and piece of on-screen English text is unchanged. Only the voice and the subtitles change.

- **Voice:** ElevenLabs `eleven_v3`, **Raunak M** (a native Hindi reel voice), sped up 8% with pitch kept.
  - Raunak was chosen over Bunty, Shyam and Abhishek by audition. His takes were the tightest, and Whisper picked up his English tech words cleanly.
  - The script is Hinglish: the TTS reads Devanagari, with the English words left in English (app, spreadsheet, team, internal tool, automate, build, explode, scope, checklist). The screen shows matching Roman Hindi, word for word.
- **Effects follow the Hindi words:**
  - The slam is on "app", the scratch and strike on "nahi", and the slice on "Unhe". The 3 question cards come in on "sawaal", Q3 is flagged on "Teesra", and the budget dies on "dam".
  - The split happens on "team" and the 8× ramp on "reports". "Automate" gets the ding.
  - Hindi says "draw" late in the question, so the page draws from the top of the line and finishes before "Agar nahi". The explosion is on "explode", and the SCOPE bubble drops on the spoken "SCOPE".
- **Music:** a new ElevenLabs cue, composed with the same plan to the Hindi timing.
- **Why it's longer than the English (52.8 s vs 42.7 s):** the same script takes more syllables in Hindi. Pushing the tempo further would sound rushed.
- **Checks:** Whisper (Hindi) reads every line back from the final mix. The voice sits 18.4 dB above the music.

## Re-render
```bash
cd work && python3 timeline.py hi && python3 mix.py hi       # timeline_hi.json + mix_hi.wav
cd ../video && npx remotion render build NoApp out/video_hi_muted.mp4 --props='{"lang":"hi"}' --muted
```
The English version renders the same way, without `--props` (`timeline.py en`, `mix.py en`).
