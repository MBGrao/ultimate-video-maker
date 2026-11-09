## Buying guide: which keys to get first (for Roman Urdu reels and ads)

Buy in this order and stop when the videos are good enough. Each one switches on automatically once its key is in `config/.env.local`.

| # | Buy | Unlocks | Why for you |
|---|---|---|---|
| 1 | **ElevenLabs** (`ELEVENLABS_API_KEY`) | Natural voiceover, your own cloned voice, SFX, music | The biggest quality jump over Kokoro. Its newest model (v3) covers Urdu and Hindi; check the voice library for a Pakistani voice or clone yours. Most catalog repos already support it. |
| 2 | **fal.ai** (`FAL_KEY`) | One key for Kling, Veo, Seedance, Wan (AI b-roll), Flux/Recraft (images), background removal | The cheapest way to try every video model without five accounts. Use it for the playbook's 3D characters and shop/office b-roll. |
| 3 | **OpenAI** (`OPENAI_API_KEY`) | gpt-image (mascots, 3D Pixar-style characters), TTS fallback, transcription | Steady character art for the T2 "3D Character Pop" template. |
| 4 | **Google Gemini** (`GEMINI_API_KEY`) | Veo (video with sound), Nano Banana (keeps the same character across edits), Gemini TTS | Best for consistent mascots across many reels, and for Veo shots. |
| 5 | **Azure Speech** (`AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`) | `ur-PK` neural voices (Asad, Uzma) | The cheapest true Pakistani-Urdu accent. Azure has a monthly free tier. |
| 6 | **HeyGen** (`HEYGEN_API_KEY`) | Talking avatar presenters, video translation | Only if you want a face on camera without filming. |

Free keys worth getting today: **Pexels**, **Pixabay** (stock video and music), **Freesound** (SFX), **Hugging Face** (open models).

Spending rule for the agent: name the provider and rough cost in the plan before the first paid call in a run. With no key, the free path is used.
