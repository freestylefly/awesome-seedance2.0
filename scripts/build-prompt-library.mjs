import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const jsonOut = resolve('data/cases.json');
const jsOut = resolve('data/cases.js');
const coverDir = resolve('media/covers');
const larkSource = 'https://bytedance.larkoffice.com/wiki/A5RHwWhoBiOnjukIIw6cu5ybnXQ';
const githubSource =
  'https://github.com/makesupday/Awesome-Seedance-2.0-Prompt-and-Examples';
const githubReadme =
  'https://github.com/makesupday/Awesome-Seedance-2.0-Prompt-and-Examples#readme';

const externalCases = [
  {
    title: 'Professional Portrait',
    category: '人物与写实',
    duration: '00:04',
    prompt:
      'A professional woman in her 30s, wearing a tailored navy blazer, sitting in a modern office. She looks directly at camera with a confident smile. Soft natural light from a large window. Slow dolly-in focusing on her face.\n\nCamera: Medium close-up, 85mm lens feel, slow dolly-in over 4 seconds\nStyle: Corporate headshot, warm professional lighting, shallow depth of field',
    tags: ['portrait', 'dolly-in', 'corporate'],
    anchor: '11-professional-portrait'
  },
  {
    title: 'Dramatic Character Reveal',
    category: '人物与写实',
    duration: '00:06',
    prompt:
      'A mysterious figure emerges from shadows into golden hour light. Long black coat billowing slightly. They pause, turn to face camera with intense eyes.\n\nCamera: Start wide shot, then slow dolly-in to close-up\nStyle: Cinematic, high contrast, film noir meets modern thriller\nLighting: Dramatic rim light, golden hour warmth on face',
    tags: ['character', 'reveal', 'cinematic'],
    anchor: '12-dramatic-character-reveal'
  },
  {
    title: 'Athletic Action Shot',
    category: '动作复刻',
    duration: '00:06',
    prompt:
      'An athlete in a professional tracksuit. Legs alternate rapidly, arms swing powerfully, sprinting with all his strength on the field. After crossing the finish line, the audience erupts in cheers.\n\nCamera: Tracking shot following the runner, 24fps cinematic\nStyle: Sports documentary, high dynamic range',
    tags: ['sports', 'tracking-shot', 'action'],
    anchor: '13-athletic-action-shot'
  },
  {
    title: 'Brand Mascot Journey',
    category: '商业创意',
    duration: '00:12',
    prompt:
      'Show a brand mascot interacting with multiple environments, such as a park, office, and home, without changing its color palette or expressions. Reference @Image1 for mascot design.\n\nCamera switch: Park to Office to Home, smooth transitions between scenes\nConsistency: Maintain exact color palette #FF5733, expression style, movement characteristics',
    tags: ['brand', 'mascot', 'consistency'],
    anchor: '22-brand-mascot-journey'
  },
  {
    title: 'Character Dialogue Scene',
    category: '情绪与声音',
    duration: '00:08',
    prompt:
      'Reference @Image1 for the character\'s face. Apply camera movement from @Video1. Match the pacing to @Audio1. Modern office setting, professional lighting.\n\nThe character speaks naturally with realistic lip movements. [Dialogue: "Welcome to our new product launch. Let me show you something amazing."]\n\nCamera: Medium shot, slight push-in during key dialogue moments',
    tags: ['dialogue', 'lip-sync', 'reference'],
    anchor: '23-character-dialogue-scene'
  },
  {
    title: 'Product Unboxing',
    category: '商业创意',
    duration: '00:10',
    prompt:
      'Show a product unboxing with close-up shots, animated text highlighting features, and smooth panning to focus on brand logos. Premium product on white background.\n\nCamera: Start top-down, transition to 45-degree angle, end with close-up on logo\nStyle: Clean, minimalist, Apple-style product photography\nLighting: Soft studio lighting, subtle reflections',
    tags: ['product', 'unboxing', 'studio'],
    anchor: '31-product-unboxing'
  },
  {
    title: 'Lifestyle Product Integration',
    category: '商业创意',
    duration: '00:15',
    prompt:
      'Create a lifestyle ad showing people using the product in different daily scenarios, keeping brand colors and logo visible. Morning coffee, afternoon work, evening relaxation.\n\nCamera: Handheld documentary style, natural movements\nStyle: Warm, authentic, lifestyle brand aesthetic\nDuration: 15 seconds, 3 distinct scenes',
    tags: ['lifestyle', 'ad', 'multi-scene'],
    anchor: '32-lifestyle-product-integration'
  },
  {
    title: 'Food & Beverage Commercial',
    category: '商业创意',
    duration: '00:08',
    prompt:
      'A steaming cup of premium coffee on a rustic wooden table. Cream pours slowly into the dark coffee, creating beautiful swirling patterns. Morning light streams through window.\n\nCamera: Macro close-up, slow motion pour at 120fps feel\nStyle: Warm, cozy, coffee commercial aesthetic\nAudio: Gentle pouring sound, ambient morning atmosphere',
    tags: ['food', 'macro', 'slow-motion'],
    anchor: '33-food--beverage-commercial'
  },
  {
    title: 'Tech Product Demo',
    category: '商业创意',
    duration: '00:08',
    prompt:
      'A sleek smartphone rotates on a reflective surface. The screen lights up showing app interface. Holographic UI elements appear around the device.\n\nCamera: 360-degree orbit around product, slow and smooth\nStyle: Futuristic, premium tech, dark background with accent lighting\nVFX: Subtle particle effects, holographic overlays',
    tags: ['tech', 'orbit', 'vfx'],
    anchor: '34-tech-product-demo'
  },
  {
    title: 'Meme-Style Comedy',
    category: '社媒短片',
    duration: '00:08',
    prompt:
      'Create a fast-paced video of a cat knocking over objects with exaggerated reactions, meme-style captions, and quick zooms for comedic effect.\n\nCamera: Quick cuts, sudden zoom-ins on reactions\nStyle: Meme aesthetic, bold text overlays, exaggerated motion\nPacing: Fast-paced, comedic timing, 5-second intervals',
    tags: ['meme', 'comedy', 'quick-zoom'],
    anchor: '41-meme-style-comedy'
  },
  {
    title: 'Morning Routine Montage',
    category: '社媒短片',
    duration: '00:12',
    prompt:
      'Show a morning routine of a college student with upbeat background music, jump cuts between scenes, and text overlays highlighting key moments.\n\nCamera: Jump cuts every 2-3 seconds, mix of angles\nStyle: TikTok/Instagram aesthetic, bright and energetic\nAudio reference: @Audio1 for upbeat rhythm',
    tags: ['montage', 'jump-cuts', 'social'],
    anchor: '42-morning-routine-montage'
  },
  {
    title: 'Before & After Transformation',
    category: '社媒短片',
    duration: '00:10',
    prompt:
      'Split-screen transformation showing fitness journey. Left side shows starting point, right side shows result. Dramatic reveal at the end.\n\nCamera: Static framing, synchronized movements on both sides\nStyle: Motivational content, high contrast, inspiring\nTransition: Dramatic reveal with light flash effect',
    tags: ['transformation', 'split-screen', 'social'],
    anchor: '43-before--after-transformation'
  },
  {
    title: 'CEO Revenge Story',
    category: '多镜头叙事',
    duration: '00:15',
    prompt:
      'Style: Modern corporate, revenge fantasy, power dynamics, designer suits\n\nSetup: Open-plan luxury office, floor-to-ceiling windows, city skyline\n\nScene 1: Humble employee receives dismissal letter, colleagues smirk\n[Dialogue: "You\'re fired. Security will escort you out."]\n\nScene 2: 6 months later. Same employee returns in designer suit, buys the company. Former boss\'s face turns pale.\n[Dialogue: "I believe you\'re sitting in MY chair."]\n\nScene 3: Employee sits in CEO chair, spins around dramatically. Former colleagues bow. Smirk.\n[Dialogue: "Meeting in 5 minutes. Don\'t be late."]\n\nCamera: Power shots from below, dramatic reveals, reaction close-ups\nLighting: Golden hour through windows, dramatic shadows\nDuration: 15 seconds',
    tags: ['short-drama', 'dialogue', 'corporate'],
    anchor: '46-ceo-revenge-story-'
  },
  {
    title: 'Cyberpunk Transformation',
    category: '风格与特效',
    duration: '00:10',
    prompt:
      'Transform a daytime city street into a neon-illuminated cyberpunk environment with rain reflections, animated signs, and moving vehicles. Reference @Video1 for original footage.\n\nStyle transfer: Day to Night, natural to cyberpunk neon\nVFX: Add rain, reflections, animated holographic signs\nColor grade: High contrast, teal and orange, neon accents',
    tags: ['style-transfer', 'cyberpunk', 'vfx'],
    anchor: '51-cyberpunk-transformation'
  },
  {
    title: 'Anime Style Application',
    category: '风格与特效',
    duration: '00:10',
    prompt:
      'Transform realistic footage into anime style while maintaining motion and composition. Reference @Video1 for source, @Image1 for anime style guide.\n\nStyle: Anime cell-shading, bold outlines, stylized expressions\nMaintain: Original motion, camera work, scene composition\nColor: Vibrant anime palette, clean gradients',
    tags: ['anime', 'style-transfer', 'reference'],
    anchor: '53-anime-style-application'
  },
  {
    title: 'Vintage Film Look',
    category: '风格与特效',
    duration: '00:10',
    prompt:
      'Apply vintage 1960s film aesthetic to modern footage. Add film grain, color shift, light leaks, and period-appropriate color grading.\n\nStyle: Vintage Kodachrome, nostalgic warmth\nVFX: Film grain, subtle light leaks, vignette\nColor: Faded highlights, warm shadows, reduced saturation',
    tags: ['film-look', 'color-grade', 'vfx'],
    anchor: '54-vintage-film-look'
  },
  {
    title: 'Chase Scene Sequence',
    category: '多镜头叙事',
    duration: '00:15',
    prompt:
      'Storyboard a chase scene in a busy city with multiple camera angles, dynamic character movements, and realistic environmental interactions.\n\nShot 1: Wide establishing - city street, target spotted\nCamera switch to Shot 2: Close-up pursuer\'s determined face, starts running\nCamera switch to Shot 3: POV shot weaving through crowd\nCamera switch to Shot 4: Aerial drone view of the chase\n\nMaintain: Character consistency, spatial continuity, escalating tension',
    tags: ['storyboard', 'chase', 'multi-shot'],
    anchor: '61-chase-scene-sequence'
  },
  {
    title: 'Product Story Arc',
    category: '多镜头叙事',
    duration: '00:15',
    prompt:
      'Tell a product story in 3 acts:\n\nAct 1 (Problem): Person struggling with traditional solution, frustrated expression\nCamera switch to Act 2 (Solution): Product introduction, amazed reaction, demonstration\nCamera switch to Act 3 (Result): Happy user, lifestyle improvement, call to action\n\nCharacter lock: Same person throughout, consistent wardrobe\nDuration: 30 seconds total, 10 seconds per act',
    tags: ['product-story', 'three-act', 'ad'],
    anchor: '62-product-story-arc'
  },
  {
    title: 'Emotional Mini-Drama',
    category: '多镜头叙事',
    duration: '00:15',
    prompt:
      'A touching reunion scene between parent and child at airport:\n\nShot 1: Child waiting anxiously, checking time, wide shot of arrivals\nCamera switch to Shot 2: Parent appears in doorway, freeze moment of recognition\nCamera switch to Shot 3: Slow motion run towards each other\nCamera switch to Shot 4: Embrace, close-up on emotional faces\n\nAudio: Swelling emotional music, synchronized with visual beats\nLip-sync: [Dialogue: "I missed you so much"]',
    tags: ['drama', 'emotion', 'multi-shot'],
    anchor: '63-emotional-mini-drama'
  },
  {
    title: 'Multilingual Dialogue',
    category: '声音与口型',
    duration: '00:10',
    prompt:
      'Business meeting with multilingual conversation:\n\nCharacter 1 speaks: [English: "Let me present our quarterly results."]\nCharacter 2 responds: [Mandarin: "数据看起来很不错。"]\nCharacter 3 adds: [Japanese: "はい、素晴らしい成長ですね。"]\n\nReference @Audio1 for timing and rhythm\nLip-sync: Phoneme-level accuracy for each language\nScene: Modern conference room, professional lighting',
    tags: ['multilingual', 'lip-sync', 'audio'],
    anchor: '71-multilingual-dialogue'
  },
  {
    title: 'Music Video Sync',
    category: '音乐卡点',
    duration: '00:10',
    prompt:
      'Create a smooth video using @Image1 as the main reference. Add natural head, eye, and ear movements. Sync expressions with the playful music rhythm.\n\nReference @Audio1 for BGM timing\nMovement: Hit the beat with subtle body movements\nExpression: Match emotional tone of music\nCamera: Dynamic but synchronized with music beats',
    tags: ['music-sync', 'audio', 'beat'],
    anchor: '72-music-video-sync'
  },
  {
    title: 'Sound Effect Integration',
    category: '声音与口型',
    duration: '00:06',
    prompt:
      'A glass falls from table in slow motion. Impact with floor, shattering into pieces. Dual-branch audio generation for realistic sound.\n\nAudio:\n- Build-up: Tense silence as glass tips\n- Impact: Crisp shatter sound perfectly synced\n- Aftermath: Tinkling of settling pieces\n\nCamera: High-speed slow motion, focus pull from glass to shards',
    tags: ['sound-effects', 'slow-motion', 'audio'],
    anchor: '73-sound-effect-integration'
  },
  {
    title: 'Voice-Over Commercial',
    category: '声音与口型',
    duration: '00:08',
    prompt:
      'Product showcase with professional voice-over:\n\n[Voice-over English: "Introducing the next generation of innovation."]\n\nVisual: Product reveal with dramatic lighting\nAudio: Voice-over synced with visual reveals\nTiming: Key features appear as mentioned in voice-over\nBackground: Subtle ambient music @Audio1',
    tags: ['voice-over', 'commercial', 'audio'],
    anchor: '74-voice-over-commercial'
  },
  {
    title: 'Dolly Movement',
    category: '运镜技巧',
    duration: '00:04',
    prompt:
      'Slow dolly-in on character\'s face capturing emotional reaction. Start medium shot, end close-up over 4 seconds. Draw audience into the moment.\n\nCamera: Slow dolly-in, 1-2 feet movement\nSpeed: Gradual acceleration towards end\nLens feel: 50mm natural perspective',
    tags: ['dolly-in', 'camera', 'close-up'],
    anchor: '81-dolly-movements'
  },
  {
    title: 'Compound Camera Movement',
    category: '运镜技巧',
    duration: '00:06',
    prompt:
      'Start: Slow dolly-in establishing the scene\nThen: Gentle pan right for the final 2 seconds\n\nNote: Structure compound moves as beats for better control. Seedance respects the sequence better than jamming both into one clause.',
    tags: ['compound-camera', 'pan', 'dolly'],
    anchor: '82-compound-camera-movement'
  },
  {
    title: 'Tracking Shot',
    category: '运镜技巧',
    duration: '00:08',
    prompt:
      'Camera follows runner through urban environment. Parallel tracking maintaining consistent distance. Subject stays in frame center.\n\nCamera: Side tracking shot, gimbal-smooth movement\nSpeed: Match subject\'s running pace\nFocus: Shallow depth of field on subject',
    tags: ['tracking-shot', 'gimbal', 'runner'],
    anchor: '83-tracking-shot'
  },
  {
    title: 'Crane Movement',
    category: '运镜技巧',
    duration: '00:06',
    prompt:
      'Start low near ground level, crane up revealing cityscape. Dramatic scale change from intimate to epic.\n\nCamera: Crane up from ground to aerial view\nDuration: 6 seconds\nStyle: Cinematic establishing shot\nReference @Video1 for crane movement pattern',
    tags: ['crane', 'camera', 'establishing'],
    anchor: '84-crane-movement'
  },
  {
    title: 'Handheld Documentary',
    category: '运镜技巧',
    duration: '00:08',
    prompt:
      'Authentic documentary feel following subject through daily activities. Natural camera shake, reactive framing.\n\nCamera: Handheld, organic movement, slight shake\nStyle: Verite documentary, authentic moments\nFocus: Reactive focus pulls on action',
    tags: ['handheld', 'documentary', 'camera'],
    anchor: '85-handheld-documentary'
  },
  {
    title: 'Frame-to-Frame Transition',
    category: '镜头连贯',
    duration: '00:08',
    prompt:
      'A smooth, natural video transition between first and last frame showing [subject]. The [character type] gently moves, blinks, and smiles with soft, realistic facial expressions.\n\nReference @Image1 as first frame\nReference @Image2 as last frame\nTransition: Organic morph maintaining subject identity',
    tags: ['transition', 'first-frame', 'last-frame'],
    anchor: 'frame-to-frame-transitions'
  }
];

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function promptLanguage(prompt) {
  return /[\u4e00-\u9fff]/.test(prompt) ? 'mixed' : 'en';
}

function normalizePrompt(prompt) {
  return prompt
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .slice(0, 160);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapWords(value, maxLength = 28, maxLines = 3) {
  const words = String(value).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);
  return lines.slice(0, maxLines);
}

const palettes = [
  ['#102a43', '#2ec4b6', '#f6d365'],
  ['#251605', '#f46036', '#2e294e'],
  ['#203a43', '#70e1f5', '#ffd194'],
  ['#1f1c2c', '#928dab', '#f5af19'],
  ['#2b5876', '#4e4376', '#ffb88c'],
  ['#0f2027', '#ff512f', '#dd2476'],
  ['#283048', '#859398', '#f6f7d7'],
  ['#141e30', '#0cebeb', '#fefefe']
];

function coverSvg(item, index) {
  const palette = palettes[index % palettes.length];
  const lines = wrapWords(item.title, /[\u4e00-\u9fff]/.test(item.title) ? 12 : 26, 3);
  const tags = (item.tags || []).slice(0, 3).join(' / ') || item.category;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-label="${escapeXml(item.title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette[0]}"/>
      <stop offset="55%" stop-color="${palette[1]}"/>
      <stop offset="100%" stop-color="${palette[2]}"/>
    </linearGradient>
    <radialGradient id="light" cx="65%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.12"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect width="1280" height="720" fill="url(#light)"/>
  <rect width="1280" height="720" filter="url(#grain)" opacity="0.32"/>
  <g opacity="0.34" fill="none" stroke="#fff" stroke-width="2">
    <path d="M80 560 C260 420 360 640 540 500 S850 390 1180 520"/>
    <path d="M120 150 C320 70 470 210 640 140 S940 30 1160 150"/>
  </g>
  <rect x="70" y="74" width="1140" height="572" rx="34" fill="#0b0f12" opacity="0.28" stroke="#fff" stroke-opacity="0.24"/>
  <text x="104" y="132" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="2">${escapeXml(item.sourcePlatform || 'Seedance')}</text>
  <text x="104" y="178" fill="#ffffff" opacity="0.82" font-family="Inter, Arial, sans-serif" font-size="24">${escapeXml(item.category)} · ${escapeXml(item.duration || 'video')}</text>
  ${lines
    .map(
      (line, lineIndex) =>
        `<text x="104" y="${312 + lineIndex * 72}" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="800">${escapeXml(line)}</text>`
    )
    .join('\n  ')}
  <text x="104" y="574" fill="#ffffff" opacity="0.78" font-family="Inter, Arial, sans-serif" font-size="24">${escapeXml(tags)}</text>
  <circle cx="1090" cy="538" r="72" fill="#ffffff" opacity="0.92"/>
  <path d="M1072 500 L1072 576 L1138 538 Z" fill="#111827"/>
</svg>
`;
}

function inferTags(item) {
  const tags = new Set(item.tags || []);
  if (/@视频|video/i.test(item.prompt)) tags.add('video-reference');
  if (/@图片|@Image|image/i.test(item.prompt)) tags.add('image-reference');
  if (/音|dialogue|Dialogue|Audio|voice|lip/i.test(item.prompt)) tags.add('audio');
  if (/镜头|Camera|tracking|dolly|shot/i.test(item.prompt)) tags.add('camera');
  if (/广告|product|brand|commercial/i.test(item.prompt)) tags.add('commercial');
  return [...tags].slice(0, 6);
}

function enrichLarkCase(item, index) {
  const id = item.id || `case-${String(index + 1).padStart(3, '0')}`;
  return {
    ...item,
    id,
    sourcePlatform: item.sourcePlatform || 'Lark Document',
    sourceUrl: item.sourceUrl || item.source || larkSource,
    author: item.author || 'ByteDance Seedance 2.0 document',
    sourceLicense: item.sourceLicense || 'Source document attribution',
    coverImage: item.coverImage || `media/covers/${id}.svg`,
    coverStatus: item.coverStatus || 'generated',
    collectedAt: item.collectedAt || '2026-05-14T15:58:05.489Z',
    tags: inferTags(item),
    promptLanguage: item.promptLanguage || promptLanguage(item.prompt),
    source: item.source || item.sourceUrl || larkSource
  };
}

function externalCase(entry, nextId) {
  const id = `case-${String(nextId).padStart(3, '0')}`;
  return {
    id,
    title: entry.title,
    category: entry.category,
    duration: entry.duration,
    prompt: entry.prompt,
    sourcePlatform: 'GitHub',
    sourceUrl: `${githubSource}#${entry.anchor || slug(entry.title)}`,
    author: 'makesupday/Awesome-Seedance-2.0-Prompt-and-Examples contributors',
    sourceLicense: 'MIT',
    coverImage: `media/covers/${id}.svg`,
    coverStatus: 'generated',
    collectedAt: new Date().toISOString(),
    tags: inferTags(entry),
    promptLanguage: promptLanguage(entry.prompt),
    caution: entry.caution || '',
    inputs: {
      images: /@Image|@图片/.test(entry.prompt)
        ? [
            {
              label: 'Reference image',
              localPath: '',
              status: 'source-reference'
            }
          ]
        : [],
      videos: /@Video|@视频/.test(entry.prompt)
        ? [
            {
              label: 'Reference video',
              localPath: '',
              status: 'source-reference'
            }
          ]
        : []
    },
    output: {
      label: entry.title,
      duration: entry.duration,
      localPath: '',
      status: 'not-collected'
    },
    source: `${githubSource}#${entry.anchor || slug(entry.title)}`
  };
}

const current = JSON.parse(readFileSync(jsonOut, 'utf8'));
const larkCases = current.cases
  .filter((item) => {
    const sourceUrl = item.sourceUrl || item.source || '';
    return sourceUrl.includes('larkoffice.com') || item.sourcePlatform === 'Lark Document';
  })
  .map(enrichLarkCase);

const seen = new Set(larkCases.map((item) => normalizePrompt(item.prompt)));
const cases = [...larkCases];
for (const entry of externalCases) {
  const key = normalizePrompt(entry.prompt);
  if (seen.has(key)) continue;
  seen.add(key);
  cases.push(externalCase(entry, cases.length + 1));
}

mkdirSync(coverDir, { recursive: true });
for (const [index, item] of cases.entries()) {
  writeFileSync(resolve(item.coverImage), coverSvg(item, index));
}

const payload = {
  name: 'Awesome Seedance 2.0',
  description:
    'Open Seedance 2.0 prompt case library with source attribution and video-style cover cards.',
  sourceDocument: larkSource,
  sourceCollections: [
    {
      platform: 'Lark Document',
      url: larkSource,
      status: 'prompt-extracted'
    },
    {
      platform: 'GitHub',
      url: githubReadme,
      license: 'MIT',
      status: 'prompt-collected'
    }
  ],
  collectedAt: new Date().toISOString(),
  extractionStatus:
    'Prompt library mode: every listed case includes a complete prompt, source attribution, and a cover image. Original videos are optional and only added when legal download access is available.',
  totalCases: cases.length,
  categories: [...new Set(cases.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b, 'zh-Hans-CN')
  ),
  cases
};

mkdirSync(dirname(jsonOut), { recursive: true });
writeFileSync(jsonOut, `${JSON.stringify(payload, null, 2)}\n`);
writeFileSync(jsOut, `window.SEEDANCE_CASE_DATA = ${JSON.stringify(payload, null, 2)};\n`);

console.log(`Built prompt library with ${cases.length} cases.`);
