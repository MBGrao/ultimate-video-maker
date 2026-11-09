# Localhost Labs reel: "Staff nahi, system chahiye"

**Output:** `localhostlabs-reel.mp4` · 53.7 s · 1080×1920 · 30 fps · H.264 + AAC · −14 LUFS
**Poster:** `poster.jpg` (also frame 0 of the video) · **Captions:** `captions.srt` (Roman Urdu) · **Instagram caption:** `share-copy.txt`
**Site:** https://localhostlabs.tech (copy, colours and fonts checked live on 2026-11-05)
**Format:** README playbook, Format B (analogy explainer: khaata + munshi), template T1 (cream grid, UI mockups, orange tape, dark mid-scenes with lime)

## Hooks (viral-hooks formulas, scored with `ig-reel/hookscore.py` on English glosses)

| Score | Hook | Category |
|---|---|---|
| **80.0 STRONG** ✅ | "Ek aur banda rakhne ka soch rahe ho? Ruko. Aapko staff nahi, system chahiye." | Negation |
| 59.6 OK | "Har mahine 4 sheets se ek report?" | Specificity |
| 52.2 OK | "Abhi bhi business copy-paste pe chal raha hai?" | Question |

## Beat sheet (every cut on the 114.84 BPM beat grid)

| Time | Scene | On screen | Voice |
|---|---|---|---|
| 0.0–5.8 | Hook | EK AUR BANDA? with 3 people and a +1, a RUKO. stamp, then ~~STAFF~~ NAHI, *system* CHAHIYE. with CRM / ERP / Automation / Integrations chips | "Ek aur banda rakhne ka soch rahe ho? Ruko. Aapko staff nahi, system chahiye." |
| 5.8–17.4 | Story (dark) | Ahmed bhai's mess, as cards from the site's "How we work" section: orders_final_v7.xlsx, a stock sheet, "Bhai, aaj ka stock bhej do 🙏", "Fwd: Fwd: RE: invoice??", invoice-0931.pdf, "Call supplier!!! (again)", "Monthly report: copy from 4 sheets", plus ⌘C/⌘V runs | s1–s3 |
| 17.4–21.1 | Analogy | CHALO, *khaata* + *munshi*, a red bahi-khata ledger, and the munshi mascot (the logo mark with "ll" eyes) | "Chalo, dukaan ke khaate aur munshi se samajhte hain." |
| 21.1–25.3 | 1 · Ek hi khaata | The site's "Operations · live" panel: Orders 128 · Stock alerts 2 · Open invoices 3, then its 3 ✓ rows | p1 |
| 25.3–32.1 | 2 · Munshi jo sota nahi (dark) | Mascot at night, then a stock counter 26 → 19 that crosses min. 20, a WhatsApp alert on a phone, and the site log row "09:21 Stock below 20 units → WhatsApp alert sent ✓" | p2a, p2b |
| 32.1–36.3 | 3 · Report khud aaye | Inbox with "Daily sales report 09:30", a chart, and the site log row "09:30 Daily sales report → emailed to owners ✓" | p3 |
| 36.3–42.6 | Punchline (orange) | "Excel kaafi hai." bubble, then EXCEL *khaata* HAI. and a MUNSHI NAHI. stamp | pu1, pu2 |
| 42.6–47.4 | SAVE | *save* KAR LO: a phone playing this reel, the bookmark is tapped, and a share sheet sends it to "Dost" | c1 |
| 47.4–53.7 | FOLLOW | FOLLOW *karo*: an Instagram profile mockup, Follow → Following ✓, Message, then the end card "FREE 30-MIN CALL · DM KARO" and localhostlabs.tech | c2 |

The orange ticker tape runs the whole time: Staff nahi, system ✦ Fixed price ✦ 24h reply ✦ NDA by default ✦ CRM · ERP · Automation ✦ Built in Multan.

## Skills and tools used (all free and local)

| Step | Tool |
|---|---|
| Routing | `ai-video-pipeline` → `PIPELINE.md` |
| Hooks + score | `viral-hooks`, `ig-reel/hookscore.py` |
| Script | README playbook structure (hook → story → analogy → 3 points → punchline → SAVE → FOLLOW) |
| Voice | Kokoro ONNX, Hindi voice `hm_psi`. It reads a Devanagari copy of the Roman-Urdu script (same words, same order, see `work/script.json`). |
| Word timing | Local Whisper `small`, word timestamps (`work/align.py`), mapped onto the script words |
| Motion | Remotion 4.0.540 (`video/`), Chrome 149 pinned in `remotion.config.ts` |
| Music / SFX | "Business Moves vol. 9" (ende.app) + Kenney SFX, both bundled with /brag. **Check the ende.app licence before using this in paid ads.** |

## Facts and notes
- Site copy used verbatim: "Operations · live / Orders 128 / Open invoices 3 / Stock alerts 2", the 3 ✓ rows, both automations.log rows, the "How we work" mess cards (orders_final_v7.xlsx, "Bhai, aaj ka stock bhej do 🙏", "Fwd: Fwd: RE: invoice??", invoice-0931.pdf, "Call supplier!!! (again)", "Monthly report / copy from 4 sheets"), Free 30-min call, 24h reply, NDA by default, Multan, @localhostlabs.
- Illustrative only: Ahmed bhai, the "stock (2).xlsx" name, the 26 → 19 counter and the alert wording, the chart bars, and the Instagram profile mockup (no follower numbers shown).
- The voice has a Hindi (Indian) accent, because no free local Urdu voice exists in Kokoro or macOS. Swap in a real voiceover by replacing `work/vo/*.wav` (same names) and re-running `align.py`, `timeline.py` and `audio.py`.

## Re-render
```bash
cd ai-video-skills/projects/localhostlabs-reel-20261105/work
python3 vo.py 1.08 hm_psi                                   # voice lines (Kokoro)
/Applications/Xcode.app/Contents/Developer/usr/bin/python3 align.py   # Whisper word timing
python3 timeline.py happy-beats-business-moves-vol-9-by-ende-dot-app.music-cues.json 2.6
cp vo/timeline.json ../video/src/timeline.json
export PATH=/opt/homebrew/opt/node@22/bin:$PATH
cd ../video && npx remotion studio                          # preview / edit
npx remotion render LocalhostLabsReel out/video_noaudio.mp4 --codec=h264 --crf=17 --muted
cd ../work && python3 audio.py && ffmpeg -y -i mix_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 mix.wav
# mux + bake poster as frame 0 (see brag step 4): overlay=0:0:enable='eq(n,0)'
```
Text, timings and colours live in `video/src/scenes.tsx`, `video/src/parts.tsx` and `video/src/brand.ts`.
