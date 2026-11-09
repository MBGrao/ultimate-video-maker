# Video generation pipeline (mandatory)

When the user asks to **generate / make / render a video, Reel, Short, ad, explainer or promo**, run this stack. **Remotion is the engine for every video.** The user chose it on 2026-11-05 after comparing a Remotion reel with a /brag one. Use `/brag` or `/brag-slim` only if the user names them.

Quality bar: `projects/localhostlabs-reel-20261105/`. That project has beat-snapped cuts, karaoke captions, real UI and copy from the brand's site, the README playbook structure, a poster baked in as frame 0, and a −14 LUFS mix.

## 0. Brand + format
- Read `config/brand-config.md` → the brand file in `config/brands/`. Use only the claims it lists, and re-check the live site.
- Reels default to 9:16 · 1080×1920 · 30 fps. Explainers (playbook) run 45–60 s and ads 15–30 s.
- Roman Urdu / Hinglish reels follow the playbook: hook → story → "Chalo, … se samjhte hain" → 3 points → punchline → SAVE → FOLLOW.

## 1. Hooks → script → score
1. `viral-hooks` + `ig-reel` (or `cck-hook`): write 3+ hooks, mixing stop-scroll and retention categories.
2. Score them with `instagram-agent-skill/skills/ig-reel/hookscore.py` (it reads English, so score an English gloss of Urdu hooks).
3. Script with `cck-script` or the `ig-reel` beat sheet: one line becomes one on-screen keyword plus one visual.
4. For website/product URLs: `remotion-ad-video` (classify → `ad-brief.json` → harvest assets → storyboard).

## 2. Voice + timing
| Have | Use |
|---|---|
| nothing (free) | Kokoro ONNX (`brag-output/work/kokoro-v1.0.onnx`). English: `am_michael` / `af_heart`. Hindi/Urdu: `hm_psi` reading a **Devanagari** copy of the Roman line. |
| `ELEVENLABS_API_KEY` | **Set up (2026-11-06)**, key in `/Users/mbgrao/Desktop/brag/.env.local`. Run with `node --env-file=/Users/mbgrao/Desktop/brag/.env.local`. Model `eleven_v3`. Urdu voice **A-Xee** `kD4dEWy2fbcyXlge6iHh` reading Urdu script; English **Liam** `TX3LPaxmHKxFdv7VOQHJ`. Use `convertWithTimestamps` for exact word timing. Reusable: `projects/localhostlabs-30day-20261106/work/tts.mjs`. Also use ElevenLabs Music (`music.compose`) and SFX for licence-clean beds. |
| `AZURE_SPEECH_KEY` + region | Azure neural `ur-PK-AsadNeural` / `ur-PK-UzmaNeural`: a true Pakistani Urdu accent |
| `OPENAI_API_KEY` | `gpt-4o-mini-tts` (a fair Urdu/Hindi read, cheap) |
Without ElevenLabs, word timing comes from local Whisper (`small`, word timestamps). The Python with openai-whisper installed is `/Applications/Xcode.app/Contents/Developer/usr/bin/python3`. Reuse `projects/localhostlabs-reel-20261105/work/{vo,align,timeline}.py`.

## 3. Visual assets (optional paid upgrades)
| Need | Free path | Paid upgrade (key in `config/.env.local`) |
|---|---|---|
| Mascot / 3D character / objects | Code-drawn SVG/CSS (see the munshi mascot in the reference reel) | `OPENAI_API_KEY` gpt-image · `GEMINI_API_KEY` Nano Banana / Imagen · `FAL_KEY` Flux · `IDEOGRAM_API_KEY` (text in image) |
| Background removal | `rembg` (local) | `REMOVE_BG_API_KEY` / Photoroom |
| B-roll / generated video shots | Remotion motion, Pexels/Pixabay stock (free keys) | `GEMINI_API_KEY` Veo · `FAL_KEY` Kling / Seedance / Wan / Veo · `RUNWAY_API_KEY` · `MINIMAX_API_KEY` Hailuo · `LUMA_API_KEY` |
| Talking avatar / presenter | none | `HEYGEN_API_KEY` |
| Music | bundled ende.app tracks (check licence for ads) · Pixabay | ElevenLabs Music · Stability Stable Audio |
| SFX | Kenney pack (bundled with /brag), synth whooshes | ElevenLabs SFX |
Before any paid call, write the provider and rough cost in the plan, in one line. Keys are read only from `config/.env.local` (`source scripts/load_env.sh`).

## 4. Remotion craft
- `remotion-best-practices` → `remotion-markup` → `remotion-captions` → `remotion-render`.
- New project: copy the `video/` scaffold from the reference reel (`cp -cR` keeps node_modules as an APFS clone). Put tokens in `brand.ts`, shared pieces in `parts.tsx` and scenes in `scenes.tsx`. Make every frame a pure function of `t`.
- **Chrome fix (all Remotion projects on this Mac):** Remotion 4.0.53x's Chrome 157 crashes, so pin `Config.setBrowserExecutable('/Users/mbgrao/Desktop/brag/ai-video-skills/_browsers/chrome-headless-shell-149/chrome-headless-shell')`. Use Node 22: `export PATH=/opt/homebrew/opt/node@22/bin:$PATH`.
- QA: render stills of every scene and mid-transition (`stills.mjs` bundles once), fix overflow and collisions, then do the full render.

## 5. Mix + deliver
- `mixlib.py` + `audio.py`: music ducked under the voice, motion-matched SFX, `loudnorm` to −14 LUFS.
- Mux and bake the poster as frame 0: `overlay=0:0:enable='eq(n,0)'`.
- Deliverables: MP4, `poster.jpg`, `captions.srt`, `share-copy.txt` (the playbook caption template with a keyword block, de-slopped with `ig-human`), `README.md` (hooks, beat sheet, facts, re-render).
- Output folder: `projects/<slug>-YYYYMMDD/`.

## 6. Specialist skills: the catalog (419 repos)
The full [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) list is cloned under `catalog/` (see `CATALOG.md`). Use it when a job needs something special: avatars, music videos, editing raw footage, Manim/math, Lottie, 3D, Chinese/Arabic text, etc.
```bash
python3 scripts/find_skill.py lottie logo            # search by words
python3 scripts/find_skill.py --kind editing --free  # by category, free only
python3 scripts/find_skill.py --provider heygen      # skills that use a given paid API
```
Read the chosen skill's `SKILL.md` and follow it. Keep the output in Remotion where it can be a component, an asset or a clip. Install that repo's dependencies only when you first use it, and never run `install.sh` / `setup.sh` without reading it. Repos in `catalog/_caution/` were graded CAUTION by Agent Skills Hub: ask the user before running them.

## Motion graphics pack (already set up)
See `motion-graphics/README.md` (Node 22, per-skill caveats): kinetic-typography, pixel2motion, logo-intro, html-motion-graphics, text-to-lottie, remotion-motion-graphics, anidoodle, claude-gif, geomotion, manim, live-panel, archscribe, arabic-motion-graphics (Urdu needs Nastaliq), and more.

## Long-form → Shorts
Shortcast (`shortcast/`, a Mac app), only when the source is an existing long video.
