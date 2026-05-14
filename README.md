<p align="center"><img src="./data/images/banner.svg" alt="Awesome Seedance 2.0" width="860" /></p>

<h3 align="center">Seedance 2.0 Multimodal Video Case Library, Prompt Gallery, Reference Asset Index, and Output Video Catalog</h3>

<p align="center">
  <a href="https://github.com/freestylefly/awesome-seedance2.0"><img src="https://img.shields.io/github/stars/freestylefly/awesome-seedance2.0?style=flat-square&color=176f69" alt="Stars"></a>
  <a href="https://github.com/freestylefly/awesome-seedance2.0"><img src="https://img.shields.io/github/forks/freestylefly/awesome-seedance2.0?style=flat-square&color=c84c32" alt="Forks"></a>
  <a href="https://github.com/freestylefly/awesome-seedance2.0"><img src="https://img.shields.io/badge/Cases-42-d6a23a?style=flat-square" alt="Cases"></a>
  <a href="https://github.com/freestylefly/awesome-seedance2.0"><img src="https://img.shields.io/badge/Media-Pending-lightgrey?style=flat-square" alt="Media status"></a>
</p>

> Seedance 2.0 case collection for prompt study, multimodal reference design, and video generation workflow reuse.

## Project Vision

Seedance 2.0 makes video generation more controllable through mixed inputs: text, images, video, and audio. This repository turns scattered example rows into a structured case library that is easier to browse, search, reproduce, and extend.

The first release focuses on a clean open-source foundation:

- Prompt-first case records with category, duration, source, and full prompt text
- Local slots for reference images, reference videos, and generated output videos
- A static website that can run with no framework or build step
- A repeatable normalization script for future document imports

## Quick Links

- [Open the static site](./index.html)
- [Structured case data](./data/cases.json)
- [Collection status](./docs/collection-status.md)
- [Input media folder](./media/inputs/)
- [Output media folder](./media/outputs/)
- [Source document](https://bytedance.larkoffice.com/wiki/A5RHwWhoBiOnjukIIw6cu5ybnXQ)

## Category Overview

| Category | Cases | Core capability |
|---|---:|---|
| 动作复刻 | 4 | Fight choreography, body motion, weapon/action reference |
| 商业创意 | 5 | Product ads, branded shots, commercial storytelling |
| 多模态案例 | 3 | Mixed image/video/text references in one generation flow |
| 情绪与声音 | 9 | Facial acting, dialogue, voice tone, emotional delivery |
| 视频延长 | 5 | Smooth continuation and follow-up scene generation |
| 视频编辑 | 6 | Role replacement, plot rewrite, object changes |
| 运镜复刻 | 4 | Camera movement, follow shots, push-pull and rotation |
| 镜头连贯 | 3 | One-take continuity and scene transition control |
| 音乐卡点 | 3 | Beat matching, rhythm edits, music-driven cuts |

## Featured Cases

| Case | Category | Output | Duration | Prompt direction |
|---|---|---|---:|---|
| `case-001` | 动作复刻 | 卧虎藏龙 切磋2 | 00:15 | Two female generals fight with image-defined characters, weapons, and video-referenced action rhythm. |
| `case-002` | 视频编辑 | 小猫洗澡后2 | 00:15 | Rewrites a cat bath video into a relaxed, pleasant, healing bath sequence. |
| `case-003` | 商业创意 | 磁吸蝴蝶结 | 00:15 | Korean ad script for magnetic bow accessories across outfit, hair, and bag scenes. |
| `case-005` | 视频延长 | 小狗圆滚滚-后 | 00:10 | Extends a dog clip into a playful rolling-downhill continuation. |
| `case-008` | 镜头连贯 | jimeng-2026-02-05-7710 | 00:13 | One-take spy scene with a red-coat agent, masked watcher, and mansion reveal. |
| `case-015` | 运镜复刻 | 无标题视频 - Clipchamp 制作 | 00:15 | Alarm-clock wakeup scene with dialogue, reaction shots, and voice reference. |

## Repository Layout

```text
.
├── app.js
├── data/
│   ├── cases.json
│   ├── cases.js
│   └── images/banner.svg
├── docs/
│   └── collection-status.md
├── index.html
├── media/
│   ├── inputs/
│   └── outputs/
├── scripts/
│   └── normalize-seedance-rows.mjs
└── styles.css
```

## Local Preview

Open `index.html` directly, or run a tiny static server:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then visit:

```text
http://127.0.0.1:4173/
```

## Data Model

Each case in `data/cases.json` includes:

- `id`: stable case id, such as `case-001`
- `title`: output video label from the source document
- `category`: normalized browsing category
- `duration`: output video duration
- `prompt`: extracted full prompt text
- `inputs.images`: local slots for reference images
- `inputs.videos`: local slots for reference videos
- `output.localPath`: local slot for generated video
- `source`: original Lark document URL
- `caution`: source-document safety note when available

## Media Status

The current import extracted prompts and media labels from the Lark document. Original image and video files still require direct download or export access from Lark.

The local paths are already reserved:

- Reference images: `media/inputs/case-001-image-1.jpg`
- Reference videos: `media/inputs/case-001-video-1.mp4`
- Output videos: `media/outputs/case-001.mp4`

After a media file is added, update its `status` from `pending` to `downloaded` in `data/cases.json`, then regenerate `data/cases.js` if needed.

## Regenerate Data

The current normalization script expects a row list exported from the Lark collection step:

```bash
node scripts/normalize-seedance-rows.mjs /private/tmp/seedance_rows.json data/cases.json
```

This writes both:

- `data/cases.json`
- `data/cases.js`

## Source

Initial source document:

https://bytedance.larkoffice.com/wiki/A5RHwWhoBiOnjukIIw6cu5ybnXQ

## License

MIT
