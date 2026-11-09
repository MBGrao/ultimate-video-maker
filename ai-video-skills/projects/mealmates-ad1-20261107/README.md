# MealMates Ad 1: "Deal 2 ki, banda 1"

**Output:** `mealmates-ad1-deal-2-ki.mp4` · 35 s · 1080×1920 · 30 fps · −14 LUFS · poster `.jpg` (frame 0) · `.srt` · caption `.caption.txt` (ig-caption lint READY)
**Brief:** "MealMates — 5 Instagram Ad Scripts", Ad 1 (Nov 7, 2026). Built from the brief's beats, with the changes listed below.

## Beats
| Time | Shot | On screen | Audio |
|---|---|---|---|
| 0.0–2.2 | Menu board, crash zoom | DEAL FOR 2 · 2 PERSONS ONLY / "Jab deal 2 ki ho… …aur aap 1 ho" | "dhoom" hit |
| 2.2–6.5 | The talking pizza (mouth lip-synced to the voice's loudness) | subtitle | **Pizza (Eman):** "Bhai, main do logon ke liye bani hoon. Aadha mujhe kaun khaye ga?" |
| 6.5–9.4 | Waiter "na" / the cat runs / the mirror | Hamza's chat bubbles, ATTEMPT 1-3: FAILED | tsk, cat yowl, buzzers |
| 9.4–15.2 | Split-screen call | "Ammi, pizza? 🥺", ATTEMPT 4: FAILED | **Ammi (Reva):** "Mera roza hai. Aur tumhara bhi hona chahiye, kamaate kuch ho nahi." |
| 15.2–19.8 | The bench, slow motion, rain | | record scratch, sad violin, **Narrator (Saira):** "Jab saari umeedein toot jaayen…" |
| 19.8–23.5 | The MealMates app | "Match seconds mein ⚡", Deals near you, then Matching…, then "Found your food buddy! 🤝 Bilal · 1.2 km" | **Narrator:** "…MealMates kholo.", match chime |
| 23.5–27.3 | The table | 50% off for both!, "Bill? 🤔" / "Aadha aadha. ✌️" | **Pizza:** "Ab hui na baat!", cash register |
| 27.3–35.0 | End card | Deal 2 ki hai. / Dost hum de dein ge. / Waitlist join karo → / mealmatesapp.com / Launching soon · Lahore · Multan | **Narrator:** "Deal 2 ki hai. Dost hum de dein ge. Waitlist join karo." |

## How it was made
- **Voices:** all spoken audio is female, as requested. ElevenLabs `eleven_v3` with acting tags ([sassy], [annoyed], [dramatic], [warm]), reading **Urdu script** while the screen shows Roman Urdu.
  - Saira (Urdu storyteller) is the narrator; Eman (Pakistani) is the pizza; Reva (Urdu) is Ammi.
  - Each was picked from auditions by Whisper read-back: Eman 1.00, Reva 1.00, Saira 0.95.
  - The boys' lines ("Ammi, pizza?", "Bill?", "Aadha aadha") are on-screen chat bubbles.
- **Pictures:** OpenAI `gpt-image-2.6-sunburst`, 11 images, about $2.50.
  - Two character references (Hamza, Bilal) were generated first. Every scene was then edited from them, so the cast stays the same across shots.
- **Music and SFX:** ElevenLabs. A desi comedy bed (dhol, sitar, pizzicato), a melodramatic violin sting, and dhoom / tsk / cat / buzzer / ring / record scratch / rain / restaurant crowd / match chime.
- **Motion and app UI:** Remotion. The pizza's mouth moves with the loudness of its voice, frame by frame. The app screens use the site's own copy and style.

## Changes from the brief (all deliberate)
- **CTA is "Waitlist join karo".** The live site still says "Launching Soon · Expected Launch: Q1 2026 · Join the Waitlist", and the app isn't downloadable yet.
- **"Match in 8 seconds" became "Match seconds mein".** The site says "Get matched within seconds"; "8 seconds" isn't a site claim.
- **Length is 35 s, not 25.** The dialogue (the pizza, Ammi, the narrator) needs that time to land naturally.
- **The bubbles and the bench are AI-generated stills with camera moves**, not phone footage and Higgsfield clips (no footage was shot). Swap in real clips later if wanted.
- **Hook A/B (`hookscore.py`, English glosses):** "When the deal is for 2 and you are just 1" scores 54.8 (used). "Being single isn't expensive. Eating single is" scores 39.2. "The pizza deal asked me: where is your partner?" scores 37.8.
- **Illustrative UI:** "Bilal · 1.2 km" and the "Burger / Karahi Deal for 2" rows are made up for the demo. "50% off for both!" and "Found your food buddy!" are the site's own copy.

---

# v2: "every line has a voice" (`mealmates-ad1-v2-all-voices.mp4`)

**What changed, as asked:** male voices, every on-screen line voiced (and every voiced line on screen), and the voice much louder.

- **Cast (ElevenLabs `eleven_v3`, Urdu script; auditioned and Whisper-checked):**
  - Narrator **Naqsh** (deep Urdu documentary voice, male).
  - Hamza **Ashar** (young, expressive, male); the mirror reflection is Ashar too, deadpan.
  - Bilal **Ghulam Shabbir** (male); waiter **Aakif** (male).
  - Game-show announcer **Hassan** (male), 25% faster so "Attempt one… FAIL!" snaps.
  - The pizza (**Eman**) and Ammi (**Reva**) stay female: the script has the pizza say "bani hoon", the feminine form.
- **22 voiced lines.** New ones:
  - "Bhai, pizza share karo ge?" → "Na." → "Attempt 1, FAIL!"
  - "Billo, pizza?" → cat → "Attempt 2, FAIL!"
  - "Tu hi aa ja yaar." → "Main bhi tu hi hoon." → "Attempt 3, FAIL!"
  - "Ammi, pizza khaane chalein?"
  - "Aur food buddy seconds mein haazir!"
  - "Bill?" → "Aadha aadha kar lete hain!" → "Dono ke liye fifty percent off!"
  - "Waitlist join karo, mealmatesapp dot com par."
- **Voice level:**
  - Every line is levelled to the same loudness, with a presence lift and a limiter on the voice bus.
  - The music ducks 17 dB under dialogue. The voice now sits about 21 dB above the music (v1 was about 4–8 dB).
  - The final mix is −13 LUFS. Whisper transcribes all 22 lines from the final mix.
- **Lines are placed by where the voice really is** (measured from the audio), because ElevenLabs timestamps drift on one-word lines ("Na.", "Bill?").
- **Redesign:**
  - Speaker-tagged karaoke speech cards (a coloured name chip per character).
  - Four ❤️ "lives" that break 💔 on every FAIL.
  - A FAIL! stamp exactly on the announcer's word.
  - Kinetic narrator text on the hook and end card.
  - Comic burst wipes, and a dip to black into the rain.
  - Unvoiced labels removed ("Menu ka pizza", "SLOW MOTION", the 1/4 counter, the "Launching soon" pill).
- **Length 51.9 s** (v1 was 35 s); more voiced lines need more time.
- **Files:** `mealmates-ad1-v2-all-voices.mp4 / .jpg / .srt / .caption.txt`. v1 is kept alongside.
