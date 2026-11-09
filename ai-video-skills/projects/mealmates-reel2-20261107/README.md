# MealMates Reel 2: "This is not a love story."

**Output:** `mealmates-reel2-not-a-love-story.mp4` · 51.3 s · 1080×1920 · 30 fps · −13 LUFS · poster `.jpg` (baked as frame 0) · `.srt` · caption `.caption.txt` (ig-caption lint READY, ig-human 76.8 PASS)
**Brief:** the user's own words: "use ur own script and design … best reel for mealmatesapp.com in English, all music and voice both, surprise me". Original script, not the 5-ad doc.

## The idea
A romantic movie trailer that turns out to be an ad. It has letterbox bars, film grain, Cinzel title cards, a deep trailer narrator and swelling strings. Two strangers lock eyes across a crowded restaurant in Lahore… and both want the **Pizza Deal for 2**. A record scratch freezes the frame: *"You're not falling in love. You're splitting a pizza deal for two."* On the bass drop the letterbox flies off and the reel turns into a bright orange MealMates app demo.

## Beats
| Time | Shot | On screen | Audio |
|---|---|---|---|
| 0.0–6.5 | Blurred restaurant, letterbox | THIS IS NOT A LOVE STORY / …SAVE UP TO **FIFTY PERCENT** EATING OUT | heartbeat, tension strings, **Narrator** |
| 6.5–10.4 | The restaurant (Badshahi Mosque in the window) | TWO STRANGERS. ONE CROWDED RESTAURANT. | strings swell, crowd |
| 10.4–16.1 | Ayesha close-up / Zain close-up | movie subtitles | **Ayesha:** "Is he… looking at me?" **Zain:** "Is she… thinking what I'm thinking?" |
| 16.1–20.0 | Over the shoulder: the menu reads *Pizza Deal for 2*, then a crash zoom | subtitles | **Ayesha:** "The Pizza Deal for two?" **Zain:** "The Pizza Deal for two!" at full orchestral climax |
| 20.0–24.6 | **Record scratch.** The frame freezes and goes grey | YOU'RE NOT FALLING IN LOVE. / YOU'RE SPLITTING A **PIZZA DEAL FOR TWO.** | dead silence, **Narrator**, riser |
| 24.6–33.6 | Bars fly off, beat drops, phone on orange | Deals near you → tap → Matching… → *Found your food buddy! 🤝* Zain ✓ Verified → chat → Split & Save, ½ bill each, *50% off for both!* | desi-pop drop, pops, match chime, cash register. **Narrator:** "MealMates matches you…", "Verified users only. Chat, meet up, and split the bill." |
| 33.6–37.9 | The two of them at the table, a dashed line drawn through the fries | 50 / 50 🍟 | **Zain:** "So… half the fries are mine?" **Ayesha:** "Strictly half." then a loud crunch |
| 37.9–51.3 | End card | MealMates / Split bills, share meals, save money together. / Launching soon · Lahore · Multan / Join the waitlist → / mealmatesapp.com | **Narrator:** tagline and "Launching soon in Lahore and Multan. Join the waitlist at mealmatesapp.com" |

## How it was made
- **Voices:** ElevenLabs `eleven_v3` with acting tags.
  - **Narrator:** David (movie-trailer narrator).
  - **Ayesha:** Maya. **Zain:** Abrash.
  - There are 14 voiced lines, and every line on screen is spoken. Whisper reads all 14 back word for word from the final mix.
- **Music:** ElevenLabs `music_v1`.
  - The romance cue was composed to the trailer with a **composition plan**: tension for 6.4 s, then "two strangers" for 6.3 s, then a swell for 7.3 s. The record scratch hard-cuts it at the climax.
  - The second half is a 112 BPM desi-pop track. Its first downbeat lands exactly on the drop, and the app cuts after the drop are snapped to its beat grid.
- **SFX:** ElevenLabs heartbeat, crunch and big whoosh, plus the pop, notification, cash, scratch, riser, ding and crowd sounds from Ad 1.
- **Mix:**
  - Every line is levelled to the same loudness, with a presence lift and a limiter on the voice bus.
  - During speech the music ducks to sit 17 dB under the voice. Between lines it comes back up to full level.
  - The final mix is −13 LUFS.
- **Pictures:** OpenAI `gpt-image-2.6-sunburst`.
  - Two character references were generated first, then 5 scenes were edited from them, so Ayesha and Zain look the same in every shot.
  - The menu banner was generated blank, and "Pizza Deal for 2" is typeset over it in perspective. That means the text is always spelled correctly.
- **Motion and UI:** Remotion. Every frame is a function of time. The app screens use the site's own copy.

## Claims (checked against mealmatesapp.com)
- **From the site:** "Verified users only", "50% off for both!", "Split Bills, Share Meals, Save Money Together", "Launching soon", Lahore and Multan.
- **Inferred:** "save up to fifty percent" is our reading of "50% off for both".
- **The CTA is the waitlist,** because the app isn't live yet.
- **Made up for the demo:** the names Ayesha and Zain, the "Burger / Karahi Deal for 2" rows, and the chat messages.

## Hook (hookscore.py)
- **Used:** "This is not a love story. This is how you save up to 50% eating out." scores 63.7 (OK).
- **The twist line,** "You're not falling in love. You're splitting a pizza deal.", scores **77.8 (STRONG)**. It is already the poster and thumbnail.
- **Worth an A/B test:** a cold-open cut that starts on the twist.

## Files
- `mealmates-reel2-not-a-love-story.mp4 / .jpg / .srt / .caption.txt`
- `work/`: the script (`scripts.json`), voices, TTS, prep, images, music (`music2.mjs`), mix (`mix.py`).
- `video/`: the Remotion project (`src/scenes.tsx`, `src/timeline.json`).
