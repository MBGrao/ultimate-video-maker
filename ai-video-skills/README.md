# AI Video Skills Toolkit

Everything Claude Code needs to make videos, in one repo. **Remotion is the engine.** Around it sit the core packages (hooks, Instagram research, Remotion skills, ads, content kit) and the **full [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) catalog: 419 repos, 1,509 skills**, free and paid.

Ask Claude Code: *"make a 45-second Roman Urdu reel for localhostlabs.tech"*. The `ai-video-pipeline` skill routes the request through `PIPELINE.md`.

| File | What it is |
|---|---|
| [`PIPELINE.md`](PIPELINE.md) | The mandatory order for any video request, with the free choice and the paid upgrade at each step |
| [`CATALOG.md`](CATALOG.md) | All 419 catalog repos by category, with cost (🆓 free / 🔑 free key / 💳 paid API), skills and local path |
| [`PAID-APIS.md`](PAID-APIS.md) | Buying guide plus every paid provider the repos use: env var names, key links, pricing links |
| [`config/`](config) | `brand-config.md` → `brands/*.md` (Localhost Labs), `instagram-voice.md`, `.env.example` |
| [`projects/`](projects) | Finished videos with full sources. `localhostlabs-reel-20261105` is the reference build. |
| [`scripts/`](scripts) | `find_skill.py`, `enable_skill.sh`, `load_env.sh`, `catalog_sync.py`, `catalog_scan.py`, `restore.sh` |

## Setup

```bash
cd ai-video-skills
./scripts/restore.sh                       # fresh machine: core packages + whole catalog (shallow clones, ~28 GB)
cp config/.env.example config/.env.local   # add only the keys you buy (see PAID-APIS.md)
source scripts/load_env.sh                 # export the keys into a shell, for running a skill's own scripts by hand
export PATH=/opt/homebrew/opt/node@22/bin:$PATH   # Remotion and most JS skills want Node 22
```

The global skill link already exists: `~/.claude/skills/ai-video-pipeline → this folder`. Core skills (hooks, `ig-*`, `cck-*`, `remotion-*`) are linked one by one in `~/.claude/skills/`.

## Using the catalog

```bash
python3 scripts/find_skill.py avatar lip sync          # search
python3 scripts/find_skill.py --kind music --free      # one category, free only
python3 scripts/find_skill.py --provider elevenlabs    # what a paid key unlocks
scripts/enable_skill.sh <skill-name>                   # make one catalog skill global in Claude Code
```

Catalog skills are **not** all linked into `~/.claude/skills`. There are over a thousand of them, and every linked skill's description is loaded into every Claude session, which would crowd the context and make skill choice worse. The pipeline finds the right one on demand instead. Enable a few favourites with `enable_skill.sh`.

**Safety:** Agent Skills Hub grades every repo. The 12 graded CAUTION live in `catalog/_caution/` and can't be enabled by script. No repo's install script was run: install a skill's dependencies when you first use it, and read any `install.sh`/`setup.sh` first.

## Paid APIs

Every paid option is installed and switched off until you add a key. Buy in the order of the guide in [`PAID-APIS.md`](PAID-APIS.md): ElevenLabs → fal.ai → OpenAI → Gemini → Azure Speech → HeyGen. With no key, everything still runs on free local tools: Kokoro voice, Whisper, Remotion, FFmpeg.

## Keeping it current

```bash
python3 scripts/catalog_sync.py              # clone anything new in catalog/awesome-skills.json
python3 scripts/catalog_sync.py --update     # git pull every catalog repo
python3 scripts/catalog_scan.py              # rebuild CATALOG.md, PAID-APIS.md, config/.env.example
```
To pick up repos added to the awesome list, first refresh `catalog/awesome-skills.json`:
`gh api repos/zhuyansen/awesome-claude-video-skills/contents/data/skills.json --jq .download_url | xargs curl -sL -o catalog/awesome-skills.json`

## What's in git

This repo tracks only our own files: pipeline, configs, scripts, catalog index and lock, patches, and project sources. Third-party clones, `node_modules`, renders and keys are git-ignored. `core-packages.json` and `catalog/lock.json` pin every repo to a commit, and `patches/` keeps our local fixes, so `scripts/restore.sh` rebuilds the same toolkit anywhere.

## Licences
- Catalog repos: mostly MIT, plus Apache-2.0, AGPL-3.0 (9 repos) and some with no licence stated. Check `CATALOG.md` and each repo before client work.
- **Remotion** is free for individuals and companies of up to 3 people; larger teams need a [company licence](https://www.remotion.dev/docs/license).
- The music bundled with /brag (ende.app) needs a licence check before paid ads.
