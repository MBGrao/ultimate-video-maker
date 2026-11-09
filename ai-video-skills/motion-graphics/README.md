# Motion graphics pack

Free, local motion-graphics skills from the **Motion graphics** section of [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills#type-motion). 20 of the 26 repos are installed here. The other 6 are skipped (see the end of this file). Each folder is a shallow git clone, so `git pull` updates it.

## Before you run anything: use Node 22

Your default `node` is v18. Several of these packages need Node 20 or 22. Put Node 22 first **for that command only**, so Shopify and Angular keep Node 18:

```bash
export PATH=/opt/homebrew/opt/node@22/bin:$PATH   # Node v22.22.2
```

Python tools use the default `python3` (pyenv 3.11). Manim has its own venv in `awesome-skills_manim-skill/.venv`.

## Pick a skill

| Ask | Skill (link name) | Folder | Engine |
|---|---|---|---|
| Animate a headline, kinetic type, lyric video | `kinetic-typography` | `iart-ai_kinetic-typography-skills` | HTML/GSAP or Remotion |
| Frame-exact logo animation, titles, brand clip as one HTML file → MP4 | `html-motion-graphics` | `acelera-agency_html-animation` | HTML + Playwright + ffmpeg |
| Raster logo (PNG/JPG) → clean SVG → animated logo | `pixel2motion` | `nolangz_pixel2motion` | Python + Chrome |
| WebGL logo intro from an SVG logo | `logo-intro` | `CJ10110425_logo-intro` | WebGL + Playwright |
| Lottie JSON (icons, loaders, logo/type loops) | `text-to-lottie` | `diffusionstudio_lottie` | Skia Skottie player (Vite) |
| Title cards, lower thirds, stat reveals as real video (alpha for Premiere/FCP) | `remotion-motion-graphics` | `fernandokaraka_remotion-motion-graphics-skill` | Remotion |
| Researched, brand-accurate motion graphics with a QA gate | `motion-graphics` + `cinematic-camera`, `terminal-inserts`, `article-highlights` | `Liamrjohnston_remotion-motion-graphics-skill` | Remotion |
| Code-drawn illustration, loops, explainer films in 32 styles | `anidoodle` | `alexgreensh_anidoodle` | own engine + Chromium + ffmpeg |
| Personal/brand intro synced to a beat | `personal-ip-brand-intro` | `toufuim_personal-ip-brand-intro-skill` | Remotion (or Hyperframes) |
| YouTube intro/outro, logo sting, end screen | `youtube-intro-outro` | `iart-ai_youtube-video-skills` | Remotion |
| Podcast audiogram (waveform video) | `audiogram` | `iart-ai_youtube-video-skills` | Remotion |
| GIFs (from video, Remotion, SVG), optimize/edit GIFs | `claude-gif` (+ `-create`, `-convert`, `-optimize`, `-edit`) | `AgriciDaniel_claude-gif` | ffmpeg + gifsicle |
| Hand-drawn morphing line animation → SVG / Lottie / HTML | `geomotion` | `hacimertgokhan_geomotion` | zero-dependency JS |
| Math, algorithm or technical explainer animation | `manim` | `awesome-skills_manim-skill` | Manim CE (own venv) |
| Animated architecture diagram, terminal style, always running | `live-panel` | `ythx-101_live-panel-skill` | Python + Chrome |
| Hand-drawn architecture/process diagram (Excalidraw + GIF/MP4) | `archscribe` | `lazypay_Archscribe` | Python + Playwright |
| Arabic (RTL) reels, explainers, logo reveals | `arabic-motion-graphics` | `sudadom_arabic-motion-graphics-skill` | Remotion |
| Chinese brief → motion reel (HUD, particles, 3D point clouds) | `ruic-motion-reel` | `HRuiCcc_RuiC-motion-reel` | Python engine or Remotion |
| Chinese: in-scene MG built from simple shapes | `orca-motion` | `zhenwusw_orca-motion-skill` | GSAP + Chrome capture |
| Chinese: Riso two-colour info B-roll from a talking-head script | `eian-riso-broll` | `YIAN6557_eian-riso-broll` | HTML + Chrome |
| Chinese copy → short Remotion motion cards | `ll-video-motion` | `liuliu-66-create_ll-video-motion` | Remotion |

## Known issue: Remotion's newest Chrome crashes on this Mac

Remotion **4.0.53x** downloads **Chrome 157** (headless shell), which crashes on start (`icu_util.cc: Check failed` → `Target closed`). Chrome 149 (Remotion 4.0.484) works. A working copy is kept at:

```
/Users/mbgrao/Desktop/brag/ai-video-skills/_browsers/chrome-headless-shell-149/chrome-headless-shell
```

For **any** Remotion project (new `create-video@latest` projects included), add this to `remotion.config.ts`:

```ts
Config.setBrowserExecutable('/Users/mbgrao/Desktop/brag/ai-video-skills/_browsers/chrome-headless-shell-149/chrome-headless-shell');
```

Or pass `--browser-executable=<that path>` to `npx remotion render|still|compositions`. This is already applied in `arabic-motion-graphics/templates/remotion`. Remove it once a newer Remotion ships a Chrome that starts.

## Per-skill notes

- **text-to-lottie:** the skill drives the player app in `diffusionstudio_lottie/`. Start it with `cd diffusionstudio_lottie && npm run dev` (Node 22) and work inside that folder. Don't let it `npx degit` a new copy. `npm run build` fails an upstream type check inside `@kobalte/core`. That is harmless: `npx vite build` and the dev server both work.
- **kinetic-typography / audiogram / youtube-intro-outro:** helper scripts (`seek-shot.sh`, `contact-sheet.sh`, `probe-mp4.sh`) live in the repo-root `scripts/` folder, not in the skill folder. Instead of `npx -y playwright` (unpinned) for screenshots, use `python3 -m playwright screenshot …`.
- **claude-gif:** the link must be named exactly `claude-gif`, because the sub-skills hardcode `~/.claude/skills/claude-gif/`. Its Python is `~/.video-skill/bin/python3` (venv created, with Pillow and numpy). `gifsicle` is installed. **Never run `scripts/setup.sh`** without `--check-only`, because it calls `sudo apt`. `claude-gif-generate` is **not linked**: it needs Veo (paid Gemini API), and its script isn't in the repo.
- **geomotion:** the skill says `npx -y github:hacimertgokhan/geomotion`, which runs whatever is on GitHub. Use the local copy instead: `node motion-graphics/hacimertgokhan_geomotion/src/node/cli.js render <name> --formats svg,lottie,html --out <dir>`.
- **personal-ip-brand-intro:** its default engine is Hyperframes, which isn't installed. Ask for `"engine":["remotion"]` to stay on the free path. It writes `$imagegen` (Codex image generation, paid); skip that and use its SVG illustrations.
- **html-motion-graphics:** copy `scripts/` into the project before exporting. Otherwise `export.js` writes frames into the skill folder.
- **anidoodle:** narration via Gemini, OpenAI or ElevenLabs is **paid and optional**. Use macOS `say` or the local Kokoro model (`brag-output/work/kokoro-v1.0.onnx`). The 233–373 MB sound pack is optional, and the skill asks before downloading it. It writes `~/.anidoodle/`.
- **Liam's four skills:** each project needs its own Remotion app: `npx create-video@latest --yes --blank --no-tailwind <name>` (Node 22). The other three skills depend on `motion-graphics`. **Don't run its `install.sh`.**
- **orca-motion:** single scenes work. Joining scenes into a film needs the sibling repo `zhenwusw/orca-transition-skill`, which is not installed. Its dependencies were installed from registry.npmjs.org; the lockfile pins npmmirror.com, which was overridden.
- **eian-riso-broll:** licensed for **personal, non-commercial use only**; commercial use needs the author's written permission. It writes projects to `~/eian-riso-broll-projects` unless `RISO_PROJECTS_DIR` is set. The `quote` (金句) template's preview and QA steps hang with headless Chrome, though its MP4 renders fine. The other templates (e.g. `number`) work end to end. If a step sits at 0% CPU, stop it and skip that step.
- **anidoodle tests:** 2 of 2,031 unit tests fail. Both compare exact audio checksums, which differ across CPUs. Rendering works.
- **arabic-motion-graphics for Urdu:** the rules carry over (RTL, whole-word animation), but you need to:
  - add `@fontsource/noto-nastaliq-urdu`
  - change `lang="ar"` to `lang="ur"` in 5 components
  - raise line-height to about 2.0–2.2
  - use the ۰-۹ digits (Extended Arabic-Indic, U+06F0)
- **manim:** run it with `motion-graphics/awesome-skills_manim-skill/.venv/bin/python -m manim …`. LaTeX isn't installed, so use `Text` or Typst; `MathTex` needs TeX.
- **ruic-motion-reel:** its SKILL.md suggests `h264_nvenc`, an NVIDIA-only encoder. On a Mac, `build.py` falls back to libx264 automatically.
- **Remotion license:** free for individuals and companies of up to 3 people. Larger companies need a paid company license (see https://www.remotion.dev/docs/license).

## Skipped (not installed)

| Repo | Why |
|---|---|
| pyang5166/gbro-collage-broll | Needs a paid Gemini API key (`gemini-omni-flash` video) **and** Codex image generation, which Claude Code doesn't have |
| MegaTroll222/VOX-COLLAGE-BROLL | Every call goes through MaxFusion, a hosted paid service with an account login |
| rock3r/cav | Needs the Cavalry desktop app (proprietary) running, plus the `cav` binary in `~/.local/bin` |
| dillydog580/animate-roblox-characters | Needs Blender 4.5, Blender MCP, and Roblox rigs |
| zz41354899/mografy | Its install writes a launcher into `/opt/homebrew/bin` and `~/.mografy`, and it auto-updates from GitHub (the awesome list rates it CAUTION) |
| luminexlabs-io/antigravity-remotion-skill | Built for Google Antigravity, and duplicates the Remotion skills you already have |

Any of these can be added later if you want them.

## Skill links

`_links.txt` lists `link-name  relative-path` for the 28 skills. `link-skills.sh` creates the links in `../../.claude/skills/` (this project) and, with `--global`, in `~/.claude/skills/`. It skips any name that already exists.

## Update

```bash
cd ai-video-skills/motion-graphics
for d in */; do [ -d "$d/.git" ] && (cd "$d" && git pull --ff-only); done
```

After a pull, re-run that package's install (`npm ci` / `uv sync`) if its lockfile changed.
