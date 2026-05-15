import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const [sourcePath = '/private/tmp/seedance_rows.json', jsonOut = 'data/cases.json'] =
  process.argv.slice(2);
const jsOut = jsonOut.replace(/\.json$/i, '.js');

const sourceDocument = 'https://bytedance.larkoffice.com/wiki/A5RHwWhoBiOnjukIIw6cu5ybnXQ';
const rows = JSON.parse(readFileSync(resolve(sourcePath), 'utf8'));

const promptSignals = [
  '@图片',
  '@图',
  '@视频',
  '镜头',
  '画面',
  '主体',
  '参考',
  '延长',
  '生成',
  '0-',
  '秒',
  '视频',
  '图片'
];

function clean(value = '') {
  return value
    .replace(/\u200b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isCaseRow(row) {
  const text = clean(row);
  if (text.length < 90) return false;
  if (!/00:\d{2}/.test(text)) return false;
  if (/^(jimeng|okI|oEC|021|小猫洗澡|小狗圆滚滚|音乐卡点|卡点|情绪3|男女主|水面|炸鸡|卧虎藏龙)\b/.test(text)) {
    return false;
  }
  return promptSignals.some((signal) => text.includes(signal));
}

function promptKey(row) {
  return promptText(row)
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .slice(0, 120);
}

function outputInfo(row, id) {
  const timeMatches = [...row.matchAll(/00:\d{2}/g)];
  const lastTime = timeMatches.at(-1);
  const previousTime = timeMatches.at(-2);
  const duration = lastTime?.[0] || '';
  const before = duration ? row.slice(0, lastTime.index).trim() : row;
  let label = previousTime
    ? row.slice(previousTime.index + previousTime[0].length, lastTime.index).trim()
    : before
        .split(' 飞书文档 - 图片')
        .pop()
        .trim();

  label = label
    .split('⚠️')[0]
    .replace(/^[-\s]+/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!label || label.length > 90 || /[。！？]$/.test(label)) {
    label = `Seedance Case ${String(id).padStart(3, '0')}`;
  }

  return { label, duration };
}

function promptText(row) {
  const text = clean(row)
    .replace(/^多参\s+\d+s\s+/, '')
    .replace(/^编辑\s+\d+s\s+/, '')
    .replace(/^延长\s+\d+s\s+/, '')
    .replace(/^(\d+)s\s+/, '')
    .replace(/\s+⚠️温馨提醒：.+$/, '')
    .trim();
  const markers = [
    ' 飞书文档 - 图片',
    ' jimeng-',
    ' 无标题视频',
    ' 1月',
    ' 2月',
    ' 小猫洗澡',
    ' 小狗圆滚滚',
    ' 卧虎藏龙',
    ' 磁吸蝴蝶结',
    ' 手提包',
    ' 实拍运镜',
    ' 恐怖片运镜',
    ' 男女主',
    ' 零食',
    ' 乐队',
    ' 水面',
    ' 炸鸡',
    ' 音乐卡点',
    ' 卡点',
    ' 情绪3',
    ' 鱼眼',
    ' 向日葵滑板车',
    ' 推下水',
    ' 打斗'
  ];
  const cut = markers
    .map((marker) => text.indexOf(marker))
    .filter((index) => index > 40)
    .sort((a, b) => a - b)[0];
  return cut ? text.slice(0, cut).trim() : text;
}

function categoryFor(text) {
  if (/打斗|对战|战斗|女将军|武器/.test(text)) return '动作复刻';
  if (/卡点|音乐卡点|MV|画面节奏/.test(text)) return '音乐卡点';
  if (/延长|向前延长|补充后续/.test(text)) return '视频延长';
  if (/编辑|替换|换成|删减|增加|颠覆/.test(text)) return '视频编辑';
  if (/一镜到底|连贯|无缝|追踪/.test(text)) return '镜头连贯';
  if (/运镜|环绕|推拉|摇镜|跟拍|机械臂/.test(text)) return '运镜复刻';
  if (/情绪|表情|说|旁白|音色|唱/.test(text)) return '情绪与声音';
  if (/商品|广告|品牌|包|可乐|油烟机|零食|奶茶/.test(text)) return '商业创意';
  return '多模态案例';
}

function inputAssets(row, id) {
  const imageCount = (row.match(/飞书文档 - 图片/g) || []).length;
  const videoKeys = [...row.matchAll(/@视频\s*(\d*)/g)]
    .map((match) => match[1] || '1')
    .filter(Boolean);
  const videoRefs = new Set(videoKeys).size;
  return {
    images: Array.from({ length: imageCount }, (_, index) => ({
      label: `图片 ${index + 1}`,
      localPath: `media/inputs/case-${String(id).padStart(3, '0')}-image-${index + 1}.jpg`,
      status: 'pending'
    })),
    videos: Array.from({ length: videoRefs }, (_, index) => ({
      label: `参考视频 ${index + 1}`,
      localPath: `media/inputs/case-${String(id).padStart(3, '0')}-video-${index + 1}.mp4`,
      status: 'pending'
    }))
  };
}

const selected = [];
const seen = new Set();

for (const row of rows.map(clean).filter(isCaseRow)) {
  const key = promptKey(row);
  if (!key || seen.has(key)) continue;
  if ([...seen].some((existing) => existing.startsWith(key.slice(0, 68)))) continue;
  seen.add(key);
  selected.push(row);
}

const cases = selected.slice(0, 42).map((row, index) => {
  const id = index + 1;
  const output = outputInfo(row, id);
  const prompt = promptText(row);
  return {
    id: `case-${String(id).padStart(3, '0')}`,
    title: output.label.replace(/^[-\s]+/, ''),
    category: categoryFor(prompt),
    duration: output.duration,
    prompt,
    sourcePlatform: 'Lark Document',
    sourceUrl: sourceDocument,
    author: 'ByteDance Seedance 2.0 document',
    sourceLicense: 'Source document attribution',
    coverImage: `media/covers/case-${String(id).padStart(3, '0')}.svg`,
    coverStatus: 'generated',
    collectedAt: new Date().toISOString(),
    tags: [],
    promptLanguage: /[\u4e00-\u9fff]/.test(prompt) ? 'zh' : 'en',
    source: sourceDocument,
    sourceRow: row,
    caution: row.includes('⚠️') ? '源文档提示：该案例包含写实人脸等生成限制说明，实际复刻时需要重新评估素材合规性。' : '',
    inputs: inputAssets(row, id),
    output: {
      label: output.label,
      duration: output.duration,
      localPath: `media/outputs/case-${String(id).padStart(3, '0')}.mp4`,
      status: 'pending'
    }
  };
});

const payload = {
  name: 'Awesome Seedance 2.0',
  sourceDocument,
  collectedAt: new Date().toISOString(),
  extractionStatus:
    'Prompt and asset labels were extracted from the Lark document. Original media files still need direct download/export access from Lark.',
  totalCases: cases.length,
  categories: [...new Set(cases.map((item) => item.category))].sort(),
  cases
};

mkdirSync(dirname(resolve(jsonOut)), { recursive: true });
writeFileSync(resolve(jsonOut), `${JSON.stringify(payload, null, 2)}\n`);
writeFileSync(
  resolve(jsOut),
  `window.SEEDANCE_CASE_DATA = ${JSON.stringify(payload, null, 2)};\n`
);

console.log(`Generated ${cases.length} cases at ${jsonOut} and ${jsOut}`);
