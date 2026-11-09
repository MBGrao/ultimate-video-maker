# Media

This repo keeps **code only**. The showcase media (final videos, posters, voice takes, music, SFX and generated images) is hosted on the media server:

**Base URL:** `https://localhostlabs.tech/uvm/` + the file's repo path

For example, `ai-video-skills/projects/localhostlabs-noapp-20261109/localhostlabs-you-dont-need-an-app.mp4` is at
https://localhostlabs.tech/uvm/ai-video-skills/projects/localhostlabs-noapp-20261109/localhostlabs-you-dont-need-an-app.mp4

## Get the media back into the repo
```bash
scripts/fetch-media.sh                                                   # everything (~280 MB, 227 files)
scripts/fetch-media.sh ai-video-skills/projects/mealmates-reel2-20261107   # one project
```
Every file is checked against the SHA-256 in [`media-manifest.tsv`](media-manifest.tsv). Once fetched, each project re-renders without paying for the voices, music or images again.

`UVM_MEDIA_BASE=https://your-mirror/path scripts/fetch-media.sh` points the script at a mirror.

## Licence
The media is shown as examples. It belongs to its owners (localhostlabs, MealMates) and is not covered by the code's MIT licence.
