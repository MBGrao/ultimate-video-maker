# Ultimate Video Maker

**Claude Code makes the whole reel: script, hook, voices, music, motion, mix and caption. You post it.**

▶ **Live showcase:** https://mbgrao.github.io/ultimate-video-maker/

Ultimate Video Maker is a set of Claude Code skills and a production pipeline for short vertical videos (Instagram Reels, TikTok, Shorts). It has two engines:

| Engine | Use it for | Where |
|---|---|---|
| **Remotion pipeline** | Ads, explainers and story reels with real voices, composed music and frame-exact motion | [`ai-video-skills/`](ai-video-skills) |
| **/brag** | Fast launch videos made from a project's own code and site (HyperFrames) | [`skills/brag`](skills/brag) · [`BRAG.md`](BRAG.md) |

## Showcase
Every video below was made end to end by Claude Code with this repo. The sources, scripts and timelines are in git. The videos and other media stream from the media server ([`MEDIA.md`](MEDIA.md)).

| Reel | Language | Length | Watch | Project |
|---|---|---|---|---|
| **You Probably Don't Need an App** (localhostlabs) | English | 42.7 s | [▶ watch](https://localhostlabs.tech/uvm/ai-video-skills/projects/localhostlabs-noapp-20261109/localhostlabs-you-dont-need-an-app.mp4) | [`localhostlabs-noapp-20261109`](ai-video-skills/projects/localhostlabs-noapp-20261109) |
| **You Probably Don't Need an App** (Hindi cut, same visuals) | Hindi / Hinglish | 52.8 s | [▶ watch](https://localhostlabs.tech/uvm/ai-video-skills/projects/localhostlabs-noapp-20261109/localhostlabs-you-dont-need-an-app-hindi.mp4) | same project |
| **This is not a love story** (MealMates) | English | 51.3 s | [▶ watch](https://localhostlabs.tech/uvm/ai-video-skills/projects/mealmates-reel2-20261107/mealmates-reel2-not-a-love-story.mp4) | [`mealmates-reel2-20261107`](ai-video-skills/projects/mealmates-reel2-20261107) |
| **Deal 2 ki, banda 1** (MealMates, every line voiced) | Urdu | 51.9 s | [▶ watch](https://localhostlabs.tech/uvm/ai-video-skills/projects/mealmates-ad1-20261107/mealmates-ad1-v2-all-voices.mp4) | [`mealmates-ad1-20261107`](ai-video-skills/projects/mealmates-ad1-20261107) |
| **Deal 2 ki, banda 1** (MealMates, v1) | Urdu | 35.0 s | [▶ watch](https://localhostlabs.tech/uvm/ai-video-skills/projects/mealmates-ad1-20261107/mealmates-ad1-deal-2-ki.mp4) | same project |
| **Staff nahi, system chahiye** (localhostlabs) | Roman Urdu | 53.7 s | [▶ watch](https://localhostlabs.tech/uvm/ai-video-skills/projects/localhostlabs-reel-20261105/localhostlabs-reel.mp4) | [`localhostlabs-reel-20261105`](ai-video-skills/projects/localhostlabs-reel-20261105) |
| **Website vs App vs Software**: Day 1 (localhostlabs) | English + Roman Urdu | 51 / 57 s | [▶ EN](https://localhostlabs.tech/uvm/ai-video-skills/projects/localhostlabs-30day-20261106/day01-en-website-app-software.mp4) · [▶ PK](https://localhostlabs.tech/uvm/ai-video-skills/projects/localhostlabs-30day-20261106/day01-pk-website-app-software.mp4) | [`localhostlabs-30day-20261106`](ai-video-skills/projects/localhostlabs-30day-20261106) |
| **Who owns your code?**: Day 2 (localhostlabs) | English + Roman Urdu | 48 / 54 s | [▶ EN](https://localhostlabs.tech/uvm/ai-video-skills/projects/localhostlabs-30day-20261106/day02-en-who-owns-your-code.mp4) · [▶ PK](https://localhostlabs.tech/uvm/ai-video-skills/projects/localhostlabs-30day-20261106/day02-pk-who-owns-your-code.mp4) | same project |
| localhostlabs launch reel, made with **/brag** | Roman Urdu | 44.2 s | [▶ watch](https://localhostlabs.tech/uvm/examples/localhostlabs-reel/brag.mp4) | [`examples/localhostlabs-reel`](examples/localhostlabs-reel) |

## How a reel gets made
1. **Brief → script.** The script is written to a reel format (hook → turn → points → CTA). Hooks are scored with `hookscore.py` from the Instagram skills, and claims are checked against the live site.
2. **Voices.** ElevenLabs `eleven_v3` with acting tags. Each language gets its own native voice, picked by audition and Whisper read-back. Character timestamps give word-exact timing.
3. **Timeline.** One scene per beat. Every effect is pinned to a spoken word (`timeline.json`): the slam lands on "app", the record scratch on "don't".
4. **Pictures.** OpenAI images for photoreal scenes. Character references keep the cast consistent across shots. Everything else is built as animated UI in **Remotion**, so every frame is a pure function of time.
5. **Music and SFX.** ElevenLabs music is composed with a plan cut to the reel's own sections. SFX land on their words.
6. **Mix and QA.** The voice-first mix levels each line, ducks the music under speech and loudness-normalises to −14 LUFS. Whisper transcribes the final mix, and contact sheets catch layout bugs before the full render.
7. **Deliver.** MP4, a poster baked in as frame 0, an `.srt`, and an Instagram caption that passes the `ig-caption` linter.

See [`ai-video-skills/PIPELINE.md`](ai-video-skills/PIPELINE.md) for the full step order. Each step has a free option and a paid upgrade.

## Quick start
```bash
git clone https://github.com/MBGrao/ultimate-video-maker && cd ultimate-video-maker/ai-video-skills
../scripts/fetch-media.sh                  # optional: showcase videos, voices, music, images (~280 MB)
./scripts/restore.sh                       # clones the pinned third-party skills + the 419-repo catalog (~28 GB)
cp config/.env.example config/.env.local   # add only the keys you buy (ElevenLabs, OpenAI, ...)
export PATH=/opt/homebrew/opt/node@22/bin:$PATH   # Remotion wants Node 22
```
Then ask Claude Code something like *"make a 40-second English reel for my-site.com, voice and music included"*. The `ai-video-pipeline` skill routes the request through `PIPELINE.md`.

To re-render a showcase project (run `scripts/fetch-media.sh <project path>` first, to get its voices, music and images):
```bash
cd ai-video-skills/projects/localhostlabs-noapp-20261109/video && npm install
npx remotion render src/index.ts NoApp out/video_muted.mp4 --muted                     # English
npx remotion render src/index.ts NoApp out/video_hi_muted.mp4 --props='{"lang":"hi"}' --muted   # Hindi
cd ../work && python3 mix.py en   # voice-first mix → mix.wav
```
`remotion.config.ts` in each project points at a local Chrome Headless Shell. Change that path, or delete the line to let Remotion download its own.

**Keys:** they never go in code. Scripts read them from env files (`--env-file`), and every `.env*` except `.env.example` is git-ignored. With no keys, the free tools still run: Kokoro voice, Whisper, Remotion, FFmpeg.

## What's inside
- [`ai-video-skills/`](ai-video-skills): the Remotion pipeline (`PIPELINE.md`, `SKILL.md`), the paid-API buying guide (`PAID-APIS.md`), brand configs, and scripts (`restore.sh`, `find_skill.py`, `enable_skill.sh`, `catalog_sync.py`). It also has `projects/`, where every showcase reel lives with its full sources.
- [`ai-video-skills/CATALOG.md`](ai-video-skills/CATALOG.md): the whole [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) catalog (419 repos, 1,509 skills) indexed by category and cost. The repos are **not** copied here. `restore.sh` clones them at pinned commits, so their authors' licences stay with their code.
- [`skills/`](skills), [`docs/`](docs), [`examples/`](examples): /brag and /brag-slim, from the upstream project.
- Companion skill: [**deck-skill**](https://github.com/MBGrao/deck-skill), for making PowerPoint decks with Claude Code.

## Credits and licence
- **/brag** is by **Shunit Haviv Hakimi** ([latent-spaces/brag](https://github.com/latent-spaces/brag)), used under the MIT licence. Its original README is kept as [`BRAG.md`](BRAG.md).
- The Remotion pipeline uses [Remotion](https://www.remotion.dev). Remotion has its own licence, and companies above a certain size need a paid licence. Check it before commercial use.
- Third-party skills restored by `restore.sh` keep their own licences: mostly MIT, plus Apache-2.0 and AGPL-3.0, and some with none stated. See `ai-video-skills/CATALOG.md`.
- **Code** in this repo is MIT. See [`LICENSE`](LICENSE).
- **The example videos, images, voices and brand names** (localhostlabs, MealMates) are shown as examples. They belong to their owners and are **not** covered by the MIT licence.
