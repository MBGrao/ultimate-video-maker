---
name: ai-video-pipeline
description: >-
  Make videos with Remotion using the local AI video toolkit: hooks, script, voice (free Kokoro or paid
  ElevenLabs/Azure/OpenAI), Remotion render, mix, captions and post copy. It also searches a 419-repo catalog of
  video skills (avatars, editing, motion graphics, Lottie, Manim, music videos, AI b-roll via Veo/Kling/fal).
  Use when the user asks to generate/make/render a video, Reel, Short, ad, promo, explainer, animated logo,
  kinetic type, Lottie or GIF, or says "use the video skills".
---

# AI Video Pipeline

**Always start here** for video requests. Remotion is the engine; use /brag only if the user names it.

1. Read `PIPELINE.md` in this folder (the full step order, free vs paid choices).
2. Read `config/brand-config.md` → the brand file in `config/brands/`.
3. Use the reference project `projects/localhostlabs-reel-20261105/` as the quality bar and scaffold.
4. Need a specialist skill? `python3 scripts/find_skill.py <words>` searches `catalog/` (see `CATALOG.md`).
5. Paid APIs only through keys in `config/.env.local` (`PAID-APIS.md`); name the provider and cost before spending.
6. Write outputs under `projects/<slug>-YYYYMMDD/`.
