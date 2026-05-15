import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const jsonOut = resolve('data/cases.json');
const jsOut = resolve('data/cases.js');
const coverDir = resolve('media/covers');
const larkSource = 'https://bytedance.larkoffice.com/wiki/A5RHwWhoBiOnjukIIw6cu5ybnXQ';
const githubSource =
  'https://github.com/makesupday/Awesome-Seedance-2.0-Prompt-and-Examples';
const githubReadme =
  'https://github.com/makesupday/Awesome-Seedance-2.0-Prompt-and-Examples#readme';

const categoryCoverMap = new Map([
  ['动作复刻', 'media/covers/ai/case-001.png'],
  ['视频编辑', 'media/covers/ai/case-004.png'],
  ['商业创意', 'media/covers/ai/case-003.png'],
  ['视频延长', 'media/covers/ai/case-005.png'],
  ['运镜复刻', 'media/covers/ai/category-camera.png'],
  ['镜头连贯', 'media/covers/ai/case-071.png'],
  ['多模态案例', 'media/covers/ai/category-multimodal.png'],
  ['情绪与声音', 'media/covers/ai/category-audio.png'],
  ['音乐卡点', 'media/covers/ai/category-audio.png'],
  ['人物与写实', 'media/covers/ai/case-043.png'],
  ['社媒短片', 'media/covers/ai/category-social.png'],
  ['多镜头叙事', 'media/covers/ai/case-055.png'],
  ['风格与特效', 'media/covers/ai/category-style-vfx.png'],
  ['声音与口型', 'media/covers/ai/case-064.png'],
  ['运镜技巧', 'media/covers/ai/category-camera.png']
]);

const localOutputs = new Map([
  [
    'case-050',
    {
      label: 'Food & Beverage Commercial',
      duration: '00:08',
      localPath: 'media/outputs/case-050.mp4',
      status: 'collected'
    }
  ]
]);

const localVideoCovers = new Map([
  ['case-050', 'media/covers/video/case-050.png']
]);

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
  ['#13293d', '#38b2ac', '#f6ad55'],
  ['#261447', '#ff5c8a', '#ffd166'],
  ['#0f172a', '#3b82f6', '#f8fafc'],
  ['#1f2937', '#10b981', '#f59e0b'],
  ['#2d1b69', '#00d4ff', '#ff9f1c'],
  ['#2f1b12', '#f97316', '#fde68a'],
  ['#111827', '#ef4444', '#f9fafb'],
  ['#073b4c', '#06d6a0', '#ffd166']
];

function categoryTheme(item, index) {
  const category = item.category || '';
  if (/动作|武侠/.test(category)) return ['#1a120b', '#b91c1c', '#fbbf24'];
  if (/商业/.test(category)) return ['#111827', '#2563eb', '#facc15'];
  if (/声音|情绪|音乐/.test(category)) return ['#171717', '#db2777', '#22d3ee'];
  if (/运镜|镜头/.test(category)) return ['#0f172a', '#14b8a6', '#f8fafc'];
  if (/风格|特效/.test(category)) return ['#210124', '#7c3aed', '#22d3ee'];
  if (/社媒/.test(category)) return ['#131313', '#f97316', '#fef3c7'];
  if (/叙事/.test(category)) return ['#172554', '#c2410c', '#f8fafc'];
  if (/编辑|延长/.test(category)) return ['#0f172a', '#84cc16', '#fefce8'];
  if (/人物/.test(category)) return ['#1f2937', '#e11d48', '#fdf2f8'];
  return palettes[index % palettes.length];
}

function sceneArt(item, index) {
  const category = item.category || '';
  const title = item.title || '';
  const prompt = item.prompt || '';
  const text = `${category} ${title} ${prompt}`;

  if (/动作复刻/.test(category) || (!category && /动作|武侠|打斗|对战|剑/.test(text))) {
    return `<g transform="translate(666 168)">
    <circle cx="250" cy="152" r="122" fill="#fbbf24" opacity="0.5"/>
    <path d="M74 340 C174 276 302 276 452 340" fill="none" stroke="#fff" stroke-width="5" opacity="0.38"/>
    <g fill="#f8fafc" stroke="#111827" stroke-width="5">
      <circle cx="178" cy="156" r="30"/>
      <path d="M154 190 C132 238 128 284 114 344 L180 344 C188 280 204 234 228 196 Z"/>
      <circle cx="350" cy="154" r="29"/>
      <path d="M320 194 C350 238 368 284 384 344 L316 344 C306 282 286 234 266 198 Z"/>
    </g>
    <path d="M210 205 L420 82" stroke="#fef3c7" stroke-width="10" stroke-linecap="round"/>
    <path d="M306 208 L90 72" stroke="#fef3c7" stroke-width="10" stroke-linecap="round"/>
    <path d="M96 110 C150 90 228 92 280 134" fill="none" stroke="#fff" stroke-width="3" opacity="0.52"/>
    <path d="M306 98 C376 92 442 116 484 166" fill="none" stroke="#fff" stroke-width="3" opacity="0.52"/>
  </g>`;
  }

  if (
    /商业创意/.test(category) ||
    (!category && /商业|商品|广告|product|brand|coffee|smartphone|蝴蝶结|零食|包/.test(text))
  ) {
    return `<g transform="translate(678 126)">
    <ellipse cx="282" cy="424" rx="232" ry="42" fill="#020617" opacity="0.25"/>
    <rect x="152" y="190" width="260" height="226" rx="34" fill="#f8fafc" opacity="0.96"/>
    <rect x="184" y="222" width="196" height="56" rx="18" fill="#2563eb" opacity="0.88"/>
    <rect x="202" y="306" width="160" height="82" rx="20" fill="#facc15" opacity="0.92"/>
    <path d="M146 168 C188 76 370 76 420 168" fill="none" stroke="#fff" stroke-width="10" opacity="0.74"/>
    <path d="M58 126 L204 214 M512 126 L366 214" stroke="#fff" stroke-width="4" opacity="0.45"/>
    <circle cx="78" cy="118" r="34" fill="#facc15" opacity="0.7"/>
    <circle cx="502" cy="118" r="34" fill="#60a5fa" opacity="0.7"/>
  </g>`;
  }

  if (
    /情绪与声音|声音与口型|音乐卡点/.test(category) ||
    (!category && /声音|情绪|音乐|口型|dialogue|Audio|voice|lip/.test(text))
  ) {
    return `<g transform="translate(672 122)">
    <circle cx="250" cy="188" r="106" fill="#fdf2f8" opacity="0.95"/>
    <path d="M168 170 C190 126 310 126 332 170" fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round"/>
    <circle cx="214" cy="190" r="10" fill="#111827"/>
    <circle cx="292" cy="190" r="10" fill="#111827"/>
    <path d="M226 238 C248 256 282 256 304 238" fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round"/>
    <g fill="#22d3ee" opacity="0.86">
      <rect x="48" y="366" width="22" height="70" rx="11"/>
      <rect x="88" y="322" width="22" height="114" rx="11"/>
      <rect x="128" y="350" width="22" height="86" rx="11"/>
      <rect x="382" y="330" width="22" height="106" rx="11"/>
      <rect x="422" y="292" width="22" height="144" rx="11"/>
      <rect x="462" y="354" width="22" height="82" rx="11"/>
    </g>
    <path d="M44 478 C144 420 236 516 332 456 S474 420 540 476" fill="none" stroke="#fff" stroke-width="5" opacity="0.58"/>
  </g>`;
  }

  if (
    /运镜复刻|运镜技巧/.test(category) ||
    (!category && /运镜|镜头|Camera|tracking|dolly|crane|handheld|环绕|跟拍/.test(text))
  ) {
    return `<g transform="translate(650 124)">
    <rect x="52" y="84" width="458" height="296" rx="34" fill="#0b1220" opacity="0.78" stroke="#fff" stroke-opacity="0.28" stroke-width="4"/>
    <rect x="102" y="132" width="160" height="100" rx="18" fill="#14b8a6" opacity="0.86"/>
    <rect x="294" y="132" width="150" height="100" rx="18" fill="#f8fafc" opacity="0.82"/>
    <circle cx="218" cy="310" r="46" fill="#f8fafc" opacity="0.96"/>
    <circle cx="218" cy="310" r="20" fill="#0f172a"/>
    <path d="M70 454 C178 398 298 514 478 416" fill="none" stroke="#facc15" stroke-width="10" stroke-linecap="round"/>
    <path d="M462 414 L426 396 M462 414 L436 448" stroke="#facc15" stroke-width="10" stroke-linecap="round"/>
  </g>`;
  }

  if (
    /风格与特效/.test(category) ||
    (!category && /风格|特效|VFX|cyberpunk|anime|vintage|style/.test(text))
  ) {
    return `<g transform="translate(650 118)">
    <rect x="68" y="88" width="420" height="318" rx="36" fill="#0b1020" opacity="0.72"/>
    <path d="M68 406 L218 226 L306 318 L374 232 L488 406 Z" fill="#22d3ee" opacity="0.78"/>
    <path d="M68 88 L488 88 L488 406 Z" fill="#a855f7" opacity="0.38"/>
    <path d="M128 138 L430 352" stroke="#fff" stroke-width="8" opacity="0.62"/>
    <circle cx="180" cy="164" r="42" fill="#facc15" opacity="0.86"/>
    <g stroke="#fff" stroke-width="3" opacity="0.45">
      <path d="M104 472 H468"/>
      <path d="M160 444 V500"/>
      <path d="M270 432 V512"/>
      <path d="M382 444 V500"/>
    </g>
  </g>`;
  }

  if (
    /社媒短片/.test(category) ||
    (!category && /社媒|meme|TikTok|Instagram|montage|transformation|cat/.test(text))
  ) {
    return `<g transform="translate(720 86)">
    <rect x="78" y="48" width="292" height="520" rx="52" fill="#111827" opacity="0.94"/>
    <rect x="108" y="94" width="232" height="420" rx="34" fill="#fff7ed"/>
    <circle cx="224" cy="302" r="72" fill="#f97316" opacity="0.88"/>
    <path d="M182 282 L154 238 L206 252 Z" fill="#f97316"/>
    <path d="M266 282 L294 238 L242 252 Z" fill="#f97316"/>
    <circle cx="198" cy="302" r="8" fill="#111827"/>
    <circle cx="250" cy="302" r="8" fill="#111827"/>
    <path d="M200 338 C218 350 232 350 250 338" fill="none" stroke="#111827" stroke-width="7" stroke-linecap="round"/>
    <path d="M24 174 H116 M28 414 H116 M336 188 H484 M336 426 H464" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.58"/>
  </g>`;
  }

  if (
    /多镜头叙事/.test(category) ||
    (!category && /多镜头|叙事|story|Scene|Shot|Act/.test(text))
  ) {
    return `<g transform="translate(650 122)">
    <rect x="52" y="62" width="204" height="150" rx="22" fill="#f8fafc" opacity="0.92"/>
    <rect x="286" y="62" width="204" height="150" rx="22" fill="#f97316" opacity="0.88"/>
    <rect x="52" y="250" width="204" height="150" rx="22" fill="#60a5fa" opacity="0.9"/>
    <rect x="286" y="250" width="204" height="150" rx="22" fill="#f8fafc" opacity="0.92"/>
    <path d="M128 166 C164 118 204 118 230 166 M350 166 C386 118 426 118 452 166 M126 354 C162 306 202 306 228 354 M350 354 C386 306 426 306 452 354" fill="none" stroke="#111827" stroke-width="7" opacity="0.8"/>
    <path d="M256 136 H286 M256 324 H286 M154 212 V250 M388 212 V250" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.7"/>
  </g>`;
  }

  if (
    /视频编辑|视频延长|镜头连贯/.test(category) ||
    (!category && /编辑|延长|transition|first frame|last frame|替换|换成|补充/.test(text))
  ) {
    return `<g transform="translate(650 132)">
    <rect x="54" y="86" width="180" height="236" rx="26" fill="#f8fafc" opacity="0.9"/>
    <rect x="328" y="86" width="180" height="236" rx="26" fill="#bef264" opacity="0.9"/>
    <path d="M236 202 C278 154 302 154 328 202" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
    <path d="M320 170 L330 202 L298 194" fill="#fff"/>
    <g fill="#111827" opacity="0.82">
      <rect x="92" y="360" width="382" height="22" rx="11"/>
      <rect x="112" y="402" width="92" height="18" rx="9"/>
      <rect x="226" y="402" width="134" height="18" rx="9"/>
      <rect x="382" y="402" width="72" height="18" rx="9"/>
    </g>
    <path d="M152 136 L136 196 L198 174 L108 272" fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
  </g>`;
  }

  if (
    /人物与写实/.test(category) ||
    (!category && /人物|portrait|professional|woman|figure/.test(text))
  ) {
    return `<g transform="translate(684 104)">
    <circle cx="260" cy="166" r="104" fill="#fdf2f8" opacity="0.96"/>
    <path d="M158 432 C178 324 342 324 362 432 Z" fill="#111827" opacity="0.9"/>
    <circle cx="260" cy="178" r="78" fill="#fce7f3"/>
    <path d="M190 164 C218 96 308 96 334 164 C300 132 224 132 190 164 Z" fill="#111827" opacity="0.86"/>
    <path d="M88 168 L28 118 M432 168 L518 118" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.52"/>
    <circle cx="28" cy="118" r="38" fill="#fb7185" opacity="0.8"/>
    <circle cx="518" cy="118" r="38" fill="#f8fafc" opacity="0.76"/>
  </g>`;
  }

  return `<g transform="translate(664 132)">
    <rect x="56" y="92" width="166" height="196" rx="24" fill="#f8fafc" opacity="0.9"/>
    <rect x="252" y="70" width="204" height="242" rx="26" fill="#22d3ee" opacity="0.82"/>
    <circle cx="354" cy="191" r="58" fill="#111827" opacity="0.84"/>
    <path d="M336 160 L336 222 L390 191 Z" fill="#fff"/>
    <path d="M84 356 H464 M114 398 H406" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.58"/>
  </g>`;
}

function coverSvg(item, index) {
  const palette = categoryTheme(item, index);
  const lines = wrapWords(item.title, /[\u4e00-\u9fff]/.test(item.title) ? 12 : 28, 2);
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
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#000000" flood-opacity="0.24"/>
    </filter>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect width="1280" height="720" fill="url(#light)"/>
  <rect width="1280" height="720" filter="url(#grain)" opacity="0.32"/>
  <g opacity="0.22" fill="none" stroke="#fff" stroke-width="2">
    <path d="M80 582 C260 442 360 662 540 522 S850 412 1180 542"/>
    <path d="M120 120 C320 40 470 180 640 110 S940 0 1160 120"/>
  </g>
  <g filter="url(#softShadow)">
    ${sceneArt(item, index)}
  </g>
  <rect x="64" y="62" width="1152" height="596" rx="38" fill="none" stroke="#fff" stroke-opacity="0.2"/>
  <rect x="88" y="84" width="226" height="48" rx="24" fill="#020617" opacity="0.5"/>
  <text x="116" y="116" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="850" letter-spacing="1.3">${escapeXml(item.sourcePlatform || 'Seedance')}</text>
  <rect x="88" y="144" width="310" height="46" rx="23" fill="#ffffff" opacity="0.18"/>
  <text x="116" y="174" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="760">${escapeXml(item.category)} · ${escapeXml(item.duration || 'video')}</text>
  <path d="M64 430 C310 386 502 430 684 462 C856 492 1036 492 1216 438 V658 H64 Z" fill="#020617" opacity="0.52"/>
  <rect x="86" y="446" width="750" height="174" rx="28" fill="#020617" opacity="0.34"/>
  ${lines
    .map(
      (line, lineIndex) =>
        `<text x="118" y="${520 + lineIndex * 58}" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="850">${escapeXml(line)}</text>`
    )
    .join('\n  ')}
  <text x="118" y="604" fill="#ffffff" opacity="0.78" font-family="Inter, Arial, sans-serif" font-size="22">${escapeXml(tags)}</text>
  <circle cx="1120" cy="560" r="68" fill="#ffffff" opacity="0.94"/>
  <path d="M1104 522 L1104 598 L1168 560 Z" fill="#111827"/>
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

function preferredCover(id, category = '') {
  const aiPath = `media/covers/ai/${id}.png`;
  if (existsSync(resolve(aiPath))) {
    return {
      path: aiPath,
      status: 'ai-generated'
    };
  }

  const videoCoverPath = localVideoCovers.get(id);
  if (videoCoverPath && existsSync(resolve(videoCoverPath))) {
    return {
      path: videoCoverPath,
      status: 'video-frame'
    };
  }

  const categoryPath = categoryCoverMap.get(category);
  if (categoryPath && existsSync(resolve(categoryPath))) {
    return {
      path: categoryPath,
      status: 'ai-category'
    };
  }

  return {
    path: `media/covers/${id}.svg`,
    status: 'generated'
  };
}

function enrichLarkCase(item, index) {
  const id = item.id || `case-${String(index + 1).padStart(3, '0')}`;
  const cover = preferredCover(id, item.category);
  return {
    ...item,
    id,
    sourcePlatform: item.sourcePlatform || 'Lark Document',
    sourceUrl: item.sourceUrl || item.source || larkSource,
    author: item.author || 'ByteDance Seedance 2.0 document',
    sourceLicense: item.sourceLicense || 'Source document attribution',
    coverImage: cover.path,
    coverStatus: cover.status,
    collectedAt: item.collectedAt || '2026-05-14T15:58:05.489Z',
    tags: inferTags(item),
    promptLanguage: item.promptLanguage || promptLanguage(item.prompt),
    source: item.source || item.sourceUrl || larkSource
  };
}

function externalCase(entry, nextId, existing) {
  const id = `case-${String(nextId).padStart(3, '0')}`;
  const cover = preferredCover(id, entry.category);
  const output = localOutputs.get(id);
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
    coverImage: cover.path,
    coverStatus: cover.status,
    collectedAt: existing?.collectedAt || new Date().toISOString(),
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
    output: output || {
      label: entry.title,
      duration: entry.duration,
      localPath: '',
      status: 'not-collected'
    },
    source: `${githubSource}#${entry.anchor || slug(entry.title)}`
  };
}

const current = JSON.parse(readFileSync(jsonOut, 'utf8'));
const currentByPrompt = new Map(
  current.cases.map((item) => [normalizePrompt(item.prompt), item])
);
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
  cases.push(externalCase(entry, cases.length + 1, currentByPrompt.get(key)));
}

mkdirSync(coverDir, { recursive: true });
for (const [index, item] of cases.entries()) {
  if (item.coverImage.endsWith('.svg')) {
    writeFileSync(resolve(item.coverImage), coverSvg(item, index));
  }
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
  collectedAt: current.collectedAt || new Date().toISOString(),
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
