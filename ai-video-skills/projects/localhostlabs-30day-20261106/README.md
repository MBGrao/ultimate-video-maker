# Localhost Labs 30-day plan: Day 1 + Day 2 (PK + EN)

| File | Reel | Length |
|---|---|---|
| `day01-pk-website-app-software.mp4` | `> explain()` Website, App ya Software? (Roman Urdu) | 56.8 s |
| `day01-en-website-app-software.mp4` | `> explain()` Website vs App vs Software (English) | 51.4 s |
| `day02-pk-who-owns-your-code.mp4` | `> scam.alert` Code aapka hai… ya developer ka? (Roman Urdu) | 54.1 s |
| `day02-en-who-owns-your-code.mp4` | `> scam.alert` Your developer owns your business (English) | 47.7 s |

Each reel has a `.jpg` poster (also baked in as frame 0), a `.srt` (Roman Urdu / English) and a `.caption.txt` written in the playbook caption template. Specs: 1080×1920, 30 fps, H.264 + AAC, about −14.5 LUFS. Post times from the plan: PK 8:30 PM PKT, EN 12:00 AM PKT.

## How it was made
- **Script:** plan cards Day 1 and Day 2, in the README playbook structure. The hooks open on a quoted line or a scene (the swipe-file finding from @ecotechdoc_sriraj), and the comment triggers ask the viewer to pick one option.
- **Voice (ElevenLabs, `eleven_v3`):** Urdu is **A-Xee** (Pakistani-American, native Urdu), chosen over 3 other Pakistani voices by Whisper read-back. It reads **Urdu script** while the screen shows the Roman words, with a 1:1 word map (`work/scripts.json`). English is **Liam** (social-media creator voice). Per-word timing comes from ElevenLabs' character timestamps (`work/tts.mjs`), so captions and on-screen keywords are exact.
- **Music + SFX (ElevenLabs):** two instrumental beds at 112 BPM (`work/music/`), beat grid from librosa. Every scene cut lands on a beat. 10 custom SFX (key turn, door, call end, stamp…) plus the Kenney pack.
- **Visuals (Remotion 4.0.540):** brand kit from the plan: Inter Tight 900, Instrument Serif italic, JetBrains Mono, green `#00C27A`, red-orange `#FF4D2E`, terminal series label with a blinking cursor, `{ }` sparkles, subtitle pill, end card.
  - Day 1 uses look A (Apple-minimal white cards, line-art icons that draw on).
  - Day 2 uses look C (retro editorial paper, door scene, evidence cards, terminal `whoami`, keys turning in locks).
- **ElevenLabs usage:** 4,171 of 131,000 monthly characters (Creator plan).
- **OpenAI images:** not used in these two reels (no funded OpenAI key was available yet). With a funded key in your env file, `node --env-file=<your .env> work/gen_images.mjs` generates the art, and the `Art` component in `video/src/parts.tsx` swaps it in.

## Re-render
```bash
cd ai-video-skills/projects/localhostlabs-30day-20261106/work
export PATH=/opt/homebrew/opt/node@22/bin:$PATH
node --env-file=/Users/mbgrao/Desktop/brag/.env.local tts.mjs d1_pk kD4dEWy2fbcyXlge6iHh eleven_v3   # voice (also d2_pk; EN: Liam TX3LPaxmHKxFdv7VOQHJ)
python3 timeline.py                                  # beat-snapped timelines -> ../video/src/timelines.json
cd ../video && npx remotion studio                   # preview all 4 compositions
npx remotion render Day01-PK-WebsiteAppSoftware out/d1_pk_noaudio.mp4 --props='{"vid":"d1_pk"}' --muted
cd ../work && python3 mix.py d1_pk                   # -> mix/d1_pk.wav, then mux + poster as in the project history
```
To make Day 3 onward: add scripts to `work/scripts.json`, a scene file like `video/src/day1.tsx`, and a composition in `Root.tsx`.
