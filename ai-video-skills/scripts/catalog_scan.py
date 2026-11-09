#!/usr/bin/env python3
"""Scan every cloned catalog repo: list its skills (SKILL.md), the API keys it reads, and the
paid / free-key providers behind them. Writes:
  catalog/catalog.json   one record per repo (machine-readable, used by find_skill.py)
  CATALOG.md             human index by category
  PAID-APIS.md           provider -> env var -> signup / pricing link -> which repos use it
  config/.env.example    every key, grouped by provider (values empty)
usage: python3 scripts/catalog_scan.py
"""
import json, os, re, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT = os.path.join(ROOT, 'catalog')
TEXT_EXT = {'.md', '.py', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.sh', '.toml', '.yaml', '.yml', '.example', '.env', '.txt', '.rb', '.go', '.rs', '.swift'}
SKIP_DIRS = {'node_modules', '.git', 'dist', 'build', '.next', 'out', '.venv', 'venv', '__pycache__', 'vendor', '.cache', 'site-packages'}
ENV_RE = re.compile(r'\b([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*_(?:API_KEY|APIKEY|KEY|TOKEN|SECRET|SECRET_KEY|ACCESS_KEY|ACCESS_KEY_ID|APP_ID|APPID|AK|SK))\b')
IGNORE_VARS = {'NODE_AUTH_TOKEN', 'GITHUB_TOKEN', 'GH_TOKEN', 'NPM_TOKEN', 'API_KEY', 'SECRET_KEY', 'YOUR_API_KEY', 'MY_API_KEY', 'PUBLIC_KEY', 'PRIVATE_KEY',
               'SSH_KEY', 'SORT_KEY', 'CACHE_KEY', 'LICENSE_KEY', 'REMOTION_LICENSE_KEY', 'STORAGE_KEY', 'PRIMARY_KEY', 'ACCESS_TOKEN', 'REFRESH_TOKEN', 'ID_TOKEN',
               'CSRF_TOKEN', 'SESSION_SECRET', 'JWT_SECRET', 'AUTH_SECRET', 'NEXTAUTH_SECRET', 'WEBHOOK_SECRET', 'ENCRYPTION_KEY', 'MASTER_KEY', 'SIGNING_KEY'}

# provider table: (label, regex on env var, cost class, signup/keys url, pricing url)
PROVIDERS = [
    ('ElevenLabs (voice, SFX, music)', r'ELEVEN', 'paid', 'https://elevenlabs.io/app/settings/api-keys', 'https://elevenlabs.io/pricing/api'),
    ('OpenAI (GPT, gpt-image, TTS, Whisper API, Sora)', r'^OPENAI|^AZURE_OPENAI', 'paid', 'https://platform.openai.com/api-keys', 'https://openai.com/api/pricing/'),
    ('Google Gemini / Veo / Imagen / Nano Banana', r'GEMINI|^GOOGLE_(?:GENAI|AI|API)|^GOOGLE_CLOUD|^VERTEX|^GOOGLE_APPLICATION', 'paid', 'https://aistudio.google.com/apikey', 'https://ai.google.dev/gemini-api/docs/pricing'),
    ('Anthropic (Claude API)', r'^ANTHROPIC|^CLAUDE_API', 'paid', 'https://console.anthropic.com/settings/keys', 'https://www.anthropic.com/pricing#api'),
    ('fal.ai (Kling, Veo, Flux, Seedance, Wan… one key)', r'^FAL', 'paid', 'https://fal.ai/dashboard/keys', 'https://fal.ai/pricing'),
    ('Replicate (many open models, one key)', r'^REPLICATE', 'paid', 'https://replicate.com/account/api-tokens', 'https://replicate.com/pricing'),
    ('HeyGen (avatars, video translation)', r'^HEYGEN', 'paid', 'https://app.heygen.com/settings?nav=API', 'https://www.heygen.com/api-pricing'),
    ('Runway (Gen-4 video)', r'^RUNWAY', 'paid', 'https://dev.runwayml.com/', 'https://docs.dev.runwayml.com/guides/pricing/'),
    ('Kling AI (video)', r'^KLING', 'paid', 'https://app.klingai.com/global/dev', 'https://app.klingai.com/global/dev/document-api/productBilling/prePaidResourcePackage'),
    ('MiniMax / Hailuo (video, speech, music)', r'^MINIMAX|^HAILUO', 'paid', 'https://www.minimax.io/platform', 'https://www.minimax.io/price'),
    ('Luma (Ray video)', r'^LUMA', 'paid', 'https://lumalabs.ai/api/keys', 'https://lumalabs.ai/api/pricing'),
    ('Pika', r'^PIKA', 'paid', 'https://pika.art/api', 'https://pika.art/api'),
    ('Stability AI', r'^STABILITY', 'paid', 'https://platform.stability.ai/account/keys', 'https://platform.stability.ai/pricing'),
    ('Black Forest Labs (Flux)', r'^BFL|^FLUX', 'paid', 'https://api.bfl.ai/', 'https://bfl.ai/pricing'),
    ('Ideogram', r'^IDEOGRAM', 'paid', 'https://ideogram.ai/manage-api', 'https://ideogram.ai/features/api-pricing'),
    ('Recraft', r'^RECRAFT', 'paid', 'https://www.recraft.ai/profile/api', 'https://www.recraft.ai/docs#pricing'),
    ('Suno / Udio (music)', r'^SUNO|^UDIO', 'paid', 'https://suno.com', 'https://suno.com/pricing'),
    ('Cartesia (voice)', r'^CARTESIA', 'paid', 'https://play.cartesia.ai/keys', 'https://cartesia.ai/pricing'),
    ('Fish Audio (voice clone, many languages)', r'^FISH', 'paid', 'https://fish.audio/app/api-keys/', 'https://fish.audio/plan/'),
    ('Deepgram (speech-to-text / TTS)', r'^DEEPGRAM', 'paid', 'https://console.deepgram.com/', 'https://deepgram.com/pricing'),
    ('AssemblyAI (speech-to-text)', r'^ASSEMBLY', 'paid', 'https://www.assemblyai.com/app/api-keys', 'https://www.assemblyai.com/pricing'),
    ('Azure Speech', r'^AZURE_(?:SPEECH|TTS)|^SPEECH_KEY', 'paid', 'https://portal.azure.com/', 'https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/'),
    ('AWS (Polly, Bedrock, S3)', r'^AWS', 'paid', 'https://console.aws.amazon.com/iam/', 'https://aws.amazon.com/polly/pricing/'),
    ('Alibaba DashScope (Qwen, Wan video, CosyVoice)', r'^DASHSCOPE|^ALIBABA|^QWEN|^ALIYUN|^WAN_', 'paid', 'https://bailian.console.alibabacloud.com/?apiKey=1', 'https://www.alibabacloud.com/help/en/model-studio/billing-for-model-studio'),
    ('ByteDance Volcengine / Ark (Seedance, Seedream, Doubao TTS)', r'^VOLC|^ARK_|^DOUBAO|^SEEDANCE|^SEEDREAM|^BYTEPLUS', 'paid', 'https://console.volcengine.com/ark', 'https://www.volcengine.com/pricing'),
    ('Zhipu GLM / CogVideo', r'^ZHIPU|^GLM|^BIGMODEL', 'paid', 'https://open.bigmodel.cn/usercenter/apikeys', 'https://open.bigmodel.cn/pricing'),
    ('Moonshot Kimi', r'^MOONSHOT|^KIMI', 'paid', 'https://platform.moonshot.ai/console/api-keys', 'https://platform.moonshot.ai/docs/pricing'),
    ('DeepSeek', r'^DEEPSEEK', 'paid', 'https://platform.deepseek.com/api_keys', 'https://api-docs.deepseek.com/quick_start/pricing'),
    ('SiliconFlow (open models, CN)', r'^SILICON', 'paid', 'https://cloud.siliconflow.cn/account/ak', 'https://siliconflow.cn/pricing'),
    ('OpenRouter (many LLMs, one key)', r'^OPENROUTER', 'paid', 'https://openrouter.ai/keys', 'https://openrouter.ai/models'),
    ('Groq (fast Whisper / LLM)', r'^GROQ', 'paid', 'https://console.groq.com/keys', 'https://groq.com/pricing'),
    ('xAI Grok (Aurora image / video)', r'^XAI|^GROK', 'paid', 'https://console.x.ai/', 'https://docs.x.ai/docs/models'),
    ('Tavily / Exa / Serper / Brave (web search for research)', r'^TAVILY|^EXA_|^SERPER|^SERPAPI|^BRAVE|^FIRECRAWL|^JINA|^PERPLEXITY', 'paid', 'https://app.tavily.com/', 'https://tavily.com/#pricing'),
    ('Hugging Face (models, Spaces)', r'^HF_(?:TOKEN|API|HUB|ACCESS)|^HUGGING', 'free-key', 'https://huggingface.co/settings/tokens', 'https://huggingface.co/pricing'),
    ('Pexels (stock video/photos)', r'^PEXELS', 'free-key', 'https://www.pexels.com/api/new/', 'https://www.pexels.com/api/'),
    ('Pixabay (stock video/photos/music)', r'^PIXABAY', 'free-key', 'https://pixabay.com/api/docs/', 'https://pixabay.com/api/docs/'),
    ('Unsplash (photos)', r'^UNSPLASH', 'free-key', 'https://unsplash.com/oauth/applications', 'https://unsplash.com/developers'),
    ('Freesound (SFX)', r'^FREESOUND', 'free-key', 'https://freesound.org/apiv2/apply/', 'https://freesound.org/docs/api/'),
    ('Giphy / Tenor', r'^GIPHY|^TENOR', 'free-key', 'https://developers.giphy.com/dashboard/', 'https://developers.giphy.com/'),
    ('YouTube / Google Data API', r'^YOUTUBE|^YT_', 'free-key', 'https://console.cloud.google.com/apis/credentials', 'https://developers.google.com/youtube/v3/getting-started#quota'),
    ('Modal / RunPod (GPU cloud)', r'^MODAL|^RUNPOD', 'paid', 'https://modal.com/settings/tokens', 'https://modal.com/pricing'),
    ('Cloudinary / Mux (video hosting)', r'^CLOUDINARY|^MUX', 'paid', 'https://console.cloudinary.com/', 'https://cloudinary.com/pricing'),
    ('Social posting (Meta/IG, TikTok, X, Buffer, Upload-Post)', r'^META_|^INSTAGRAM|^FACEBOOK|^FB_|^TIKTOK|^TWITTER|^X_API|^BUFFER|^UPLOAD_POST|^AYRSHARE', 'paid', 'https://developers.facebook.com/apps/', 'https://developers.facebook.com/docs/instagram-platform'),
    ('Notion / Airtable / Slack (workflow)', r'^NOTION|^AIRTABLE|^SLACK', 'free-key', 'https://www.notion.so/my-integrations', 'https://www.notion.so/pricing'),
]
PROV_RE = [(label, re.compile(rx), cls, signup, price) for label, rx, cls, signup, price in PROVIDERS]

def provider_of(var):
    for label, rx, cls, signup, price in PROV_RE:
        if rx.search(var): return label, cls
    return None, None

def frontmatter(path):
    try: s = open(path, encoding='utf-8', errors='ignore').read(6000)
    except Exception: return {}
    m = re.match(r'---\s*\n(.*?)\n---', s, re.S)
    if not m: return {'name': os.path.basename(os.path.dirname(path)), 'description': ''}
    fm = {}
    for key in ('name', 'description'):
        mm = re.search(rf'^{key}:\s*(.+?)(?=^\w[\w-]*:|\Z)', m.group(1), re.S | re.M)
        if mm: fm[key] = ' '.join(mm.group(1).strip().strip('"\'>|').split())
    return fm

def scan_repo(path):
    skills, env, files = [], collections.Counter(), 0
    for dp, dn, fn in os.walk(path):
        dn[:] = [d for d in dn if d not in SKIP_DIRS]
        for f in fn:
            fp = os.path.join(dp, f)
            if f == 'SKILL.md':
                fm = frontmatter(fp)
                skills.append({'name': fm.get('name') or os.path.basename(dp), 'description': (fm.get('description') or '')[:400], 'path': os.path.relpath(fp, ROOT)})
            ext = os.path.splitext(f)[1].lower() if not f.startswith('.env') else '.env'
            if ext in TEXT_EXT or f in ('.env.example', '.env.sample', '.env.template', 'Dockerfile'):
                try:
                    if os.path.getsize(fp) > 400_000: continue
                    s = open(fp, encoding='utf-8', errors='ignore').read()
                except Exception: continue
                files += 1
                for v in ENV_RE.findall(s):
                    if v not in IGNORE_VARS and not v.startswith(('YOUR_', 'MY_', 'EXAMPLE_', 'TEST_')): env[v] += 1
    # the same skill is often mirrored in .claude/skills, .agents/skills, .codex/skills… keep one copy per name
    pref = lambda sk: (0 if '/skills/' in sk['path'] and '/.' not in sk['path'].split(os.path.basename(path))[-1] else 1, len(sk['path']))
    best = {}
    for sk in sorted(skills, key=pref):
        best.setdefault(sk['name'], sk)
    return list(best.values()), env

def main():
    meta = {s['repo_full_name']: s for s in json.load(open(os.path.join(CAT, 'awesome-skills.json')))['skills']}
    lock = json.load(open(os.path.join(CAT, 'lock.json')))
    recs, prov_use = [], collections.defaultdict(lambda: {'vars': collections.Counter(), 'repos': set()})
    op = os.path.join(CAT, 'overrides.json'); OVR = json.load(open(op)) if os.path.exists(op) else {}
    for name in sorted(lock, key=lambda n: -meta.get(n, {}).get('stars', 0)):
        info = lock[name]; m = meta.get(name, {}); p = os.path.join(ROOT, info['path'])
        if not os.path.isdir(p): continue
        skills, env = scan_repo(p)
        provs, classes = {}, set()
        for v in env:
            label, cls = provider_of(v)
            if label:
                provs.setdefault(label, []).append(v); classes.add(cls)
                prov_use[label]['vars'][v] += 1; prov_use[label]['repos'].add(name)
        cost = 'paid-api' if 'paid' in classes else 'free-key' if 'free-key' in classes else 'free'
        ov = OVR.get(name, {})
        for label, how in ov.get('add_providers', {}).items():
            provs.setdefault(label, []).extend(how); prov_use[label]['vars'].update(how); prov_use[label]['repos'].add(name)
        cost = ov.get('cost', cost)
        recs.append({'repo': name, 'url': f'https://github.com/{name}', 'kind': m.get('kind'), 'grade': m.get('security_grade'), 'stars': m.get('stars'),
                     'license': m.get('license'), 'language': m.get('language'), 'description': m.get('description'), 'path': info['path'],
                     'commit': info.get('commit'), 'cost': cost, 'note': OVR.get(name, {}).get('note'), 'providers': {k: sorted(set(v)) for k, v in provs.items()}, 'skills': skills})
    json.dump({'generated_from': 'https://github.com/zhuyansen/awesome-claude-video-skills', 'repos': recs}, open(os.path.join(CAT, 'catalog.json'), 'w'), indent=1, ensure_ascii=False)

    # ---------- CATALOG.md ----------
    kinds = json.load(open(os.path.join(CAT, 'awesome-skills.json')))['kinds']
    tot_sk = sum(len(r['skills']) for r in recs)
    c = collections.Counter(r['cost'] for r in recs)
    L = ['# Video skills catalog', '',
         f'Every repo from [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills), cloned locally: **{len(recs)} repos, {tot_sk} skills**. '
         f'Cost: **{c["free"]} free**, **{c["free-key"]} need a free key**, **{c["paid-api"]} can use a paid API** (see [PAID-APIS.md](PAID-APIS.md)).', '',
         'Find one: `python3 scripts/find_skill.py <words> [--kind promo] [--free|--paid]`. Enable one as a global Claude skill: `scripts/enable_skill.sh <skill-name>`.', '',
         'Legend: 🆓 free & local · 🔑 free API key · 💳 paid API (key in `config/.env.local`) · ⚠️ graded CAUTION, cloned to `catalog/_caution/`, not enabled', '']
    icon = {'free': '🆓', 'free-key': '🔑', 'paid-api': '💳'}
    for k in kinds:
        rs = [r for r in recs if r['kind'] == k['id']]
        if not rs: continue
        L += [f"## {k['icon']} {k['en']} ({len(rs)})", '', '| Repo | ★ | Cost | Skills | What it does | Path |', '|---|---:|---|---:|---|---|']
        for r in rs:
            warn = ' ⚠️' if r['grade'] != 'safe' else ''
            prov = ', '.join(p.split(' (')[0] for p in r['providers']) if r['providers'] else ''
            desc = (r['description'] or '').replace('|', '/')[:120] + (f" <br>*Note: {r['note']}*" if r.get('note') else '')
            L.append(f"| [{r['repo']}]({r['url']}){warn} | {r['stars']:,} | {icon[r['cost']]} {prov} | {len(r['skills'])} | {desc} | `{r['path']}` |")
        L.append('')
    open(os.path.join(ROOT, 'CATALOG.md'), 'w').write('\n'.join(L))

    # ---------- PAID-APIS.md + .env.example ----------
    table = {label: (cls, signup, price) for label, rx, cls, signup, price in PROVIDERS}
    for l in prov_use: table.setdefault(l, ('paid', 'https://maxfusion.ai' if 'MaxFusion' in l else 'https://cavalry.studio' if 'Cavalry' in l else '', 'https://maxfusion.ai' if 'MaxFusion' in l else 'https://cavalry.studio/pricing' if 'Cavalry' in l else ''))
    order = sorted(prov_use, key=lambda l: (table[l][0] != 'paid', -len(prov_use[l]['repos'])))
    P = ['# Paid and keyed APIs used by the catalog', '',
         'Every key below is optional. Without it the pipeline stays on free local tools (Kokoro voice, Whisper, Remotion, FFmpeg). '
         'Put keys in `config/.env.local` (git-ignored); `scripts/load_env.sh` exports them for any skill.', '',
         'Prices change often, so this file links each provider\'s own pricing page instead of quoting numbers.', '']
    g = os.path.join(ROOT, 'config', 'paid-buying-guide.md')
    if os.path.exists(g): P += [open(g).read().strip(), '', '## Every provider the catalog repos read keys for', '']
    P += [
         '| Provider | Type | Env vars seen in the repos | Repos using it | Get a key | Pricing |', '|---|---|---|---:|---|---|']
    E = ['# ai-video-skills: every API key the catalog can use. Copy to .env.local and fill only what you buy.',
         '# cp config/.env.example config/.env.local    (never commit .env.local)', '',
         '# ===== Core keys PIPELINE.md switches on (see PAID-APIS.md buying guide) =====',
         'ELEVENLABS_API_KEY=', 'FAL_KEY=', 'OPENAI_API_KEY=', 'GEMINI_API_KEY=', 'AZURE_SPEECH_KEY=', 'AZURE_SPEECH_REGION=', 'HEYGEN_API_KEY=',
         'REPLICATE_API_TOKEN=', 'RUNWAY_API_KEY=', 'REMOVE_BG_API_KEY=', 'PEXELS_API_KEY=', 'PIXABAY_API_KEY=', 'FREESOUND_API_KEY=', 'HF_TOKEN=', '',
         '# ===== Everything else the catalog repos read (same key names they expect) =====', '']
    core = {'ELEVENLABS_API_KEY', 'FAL_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY', 'AZURE_SPEECH_KEY', 'AZURE_SPEECH_REGION', 'HEYGEN_API_KEY',
            'REPLICATE_API_TOKEN', 'RUNWAY_API_KEY', 'REMOVE_BG_API_KEY', 'PEXELS_API_KEY', 'PIXABAY_API_KEY', 'FREESOUND_API_KEY', 'HF_TOKEN'}
    for l in order:
        cls, signup, price = table[l]; u = prov_use[l]
        vars_ = [v for v, _ in u['vars'].most_common(8)]
        P.append(f"| {l} | {'💳 paid' if cls == 'paid' else '🔑 free key'} | `{'`, `'.join(vars_)}` | {len(u['repos'])} | [keys]({signup}) | [pricing]({price}) |")
        E.append(f'# --- {l} ({"paid" if cls == "paid" else "free key"}) · keys: {signup} · pricing: {price}')
        E += [f'{v}=' if re.fullmatch(r'[A-Z0-9_]+', v) else f'# {v}' for v in vars_[:4] if v not in core] + ['']
    P += ['', '## Which repos use which provider', '']
    for l in order:
        rs = sorted(prov_use[l]['repos'], key=lambda n: -meta.get(n, {}).get('stars', 0))
        P.append(f"- **{l}** ({len(rs)}): " + ', '.join(f'[{n}](https://github.com/{n})' for n in rs[:30]) + (' …' if len(rs) > 30 else ''))
    open(os.path.join(ROOT, 'PAID-APIS.md'), 'w').write('\n'.join(P) + '\n')
    open(os.path.join(ROOT, 'config', '.env.example'), 'w').write('\n'.join(E) + '\n')
    print(f'{len(recs)} repos, {tot_sk} skills, cost {dict(c)}, {len(prov_use)} providers')

if __name__ == '__main__':
    main()
