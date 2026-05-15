const payload = window.SEEDANCE_CASE_DATA;
const state = {
  category: '全部',
  query: ''
};

const statsEl = document.querySelector('#stats');
const tabsEl = document.querySelector('#categoryTabs');
const gridEl = document.querySelector('#caseGrid');
const statusEl = document.querySelector('#statusNote');
const searchInput = document.querySelector('#searchInput');
const template = document.querySelector('#caseCardTemplate');
const detailModal = document.querySelector('#caseDetail');
const detailMedia = document.querySelector('#detailMedia');
const detailCategory = document.querySelector('#detailCategory');
const detailTitle = document.querySelector('#detailTitle');
const detailMeta = document.querySelector('#detailMeta');
const detailCopy = document.querySelector('#detailCopy');
const detailSource = document.querySelector('#detailSource');
const detailAssets = document.querySelector('#detailAssets');
const detailPrompt = document.querySelector('#detailPrompt');
const detailClose = document.querySelector('.detail-close');

const categories = ['全部', ...payload.categories];
let activeCase = null;

function renderStats() {
  const platforms = new Set(payload.cases.map((item) => item.sourcePlatform || 'Source')).size;
  const directPrompts = payload.cases.filter((item) => !hasInputImages(item) && !hasInputVideos(item))
    .length;
  const videoReady = payload.cases.filter(hasVideoOutput).length;
  statsEl.innerHTML = `
    <div><strong>${payload.totalCases}</strong><span>prompts</span></div>
    <div><strong>${directPrompts}</strong><span>direct prompts</span></div>
    <div><strong>${videoReady}</strong><span>video ready</span></div>
    <div><strong>${platforms}</strong><span>sources</span></div>
  `;
}

function coverStatusLabel(status) {
  if (status === 'source') return 'source cover';
  if (status === 'ai-generated') return 'AI cover';
  if (status === 'ai-category') return 'AI category cover';
  if (status === 'video-frame') return 'video frame';
  return 'generated cover';
}

function renderTabs() {
  tabsEl.innerHTML = '';
  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = category === state.category ? 'active' : '';
    button.textContent = category;
    button.addEventListener('click', () => {
      state.category = category;
      render();
    });
    tabsEl.append(button);
  }
}

function caseMatches(item) {
  const query = state.query.trim().toLowerCase();
  const byCategory = state.category === '全部' || item.category === state.category;
  if (!query) return byCategory;
  const text = [
    item.title,
    item.category,
    item.prompt,
    item.output?.label,
    item.sourcePlatform,
    item.author,
    ...(item.tags || [])
  ]
    .join(' ')
    .toLowerCase();
  return byCategory && text.includes(query);
}

function assetChip(label, path, status) {
  const chip = document.createElement('span');
  chip.className = `asset-chip ${status}`;
  chip.textContent = path ? `${label}: ${path}` : `${label}: ${status}`;
  return chip;
}

function tagChip(label) {
  const chip = document.createElement('span');
  chip.className = 'tag-chip';
  chip.textContent = label;
  return chip;
}

function hasInputImages(item) {
  return Boolean(item.inputs?.images?.length);
}

function hasInputVideos(item) {
  return Boolean(item.inputs?.videos?.length);
}

function hasVideoOutput(item) {
  return Boolean(item.output?.localPath);
}

function caseNumber(item) {
  const match = item.id.match(/\d+$/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function dependencyRank(item) {
  const imageRef = hasInputImages(item);
  const videoRef = hasInputVideos(item);
  if (!imageRef && !videoRef && hasVideoOutput(item)) return 0;
  if (!imageRef && !videoRef) return 1;
  if (imageRef && !videoRef) return 2;
  if (!imageRef && videoRef) return 3;
  return 4;
}

function compareCases(a, b) {
  const rankDiff = dependencyRank(a) - dependencyRank(b);
  if (rankDiff !== 0) return rankDiff;
  return caseNumber(a) - caseNumber(b);
}

function dependencyLabels(item) {
  const imageRef = hasInputImages(item);
  const videoRef = hasInputVideos(item);
  const labels = [];
  if (!imageRef && !videoRef) labels.push({ text: 'Pure Prompt', tone: 'direct' });
  if (imageRef && !videoRef) labels.push({ text: 'Image Ref', tone: 'image' });
  if (!imageRef && videoRef) labels.push({ text: 'Video Ref', tone: 'video' });
  if (imageRef && videoRef) labels.push({ text: 'Image + Video Ref', tone: 'mixed' });
  if (hasVideoOutput(item)) labels.push({ text: 'Video Ready', tone: 'ready' });
  return labels;
}

function dependencyChip(label) {
  const chip = document.createElement('span');
  chip.className = `dependency-chip ${label.tone}`;
  chip.textContent = label.text;
  return chip;
}

async function copyPrompt(prompt, button) {
  await navigator.clipboard.writeText(prompt);
  const original = button.textContent;
  button.textContent = 'Copied';
  setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

function renderDetailAssets(item, sourceUrl) {
  detailAssets.innerHTML = '';
  detailAssets.append(assetChip('案例', item.id, item.category));
  detailAssets.append(
    assetChip(
      '生成方式',
      dependencyLabels(item)
        .map((label) => label.text)
        .join(' / '),
      'dependency'
    )
  );
  detailAssets.append(assetChip('来源平台', sourceUrl, item.sourcePlatform || 'source'));
  if (item.output?.localPath) {
    detailAssets.append(assetChip('输出视频', item.output.localPath, item.output.status || 'collected'));
  } else {
    detailAssets.append(assetChip('输出视频', '', item.output?.status || 'not-collected'));
  }
}

function renderDetailMedia(item) {
  detailMedia.innerHTML = '';
  if (hasVideoOutput(item)) {
    const video = document.createElement('video');
    video.src = item.output.localPath;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'auto';
    detailMedia.append(video);
    return;
  }

  const image = document.createElement('img');
  image.src = item.coverImage;
  image.alt = `${item.title} cover`;
  detailMedia.append(image);
}

function openDetail(item) {
  const sourceUrl = item.sourceUrl || item.source;
  activeCase = item;
  renderDetailMedia(item);
  renderDetailAssets(item, sourceUrl);
  detailCategory.textContent = item.category;
  detailTitle.textContent = `${item.id} / ${item.title}`;
  detailMeta.textContent = `${item.sourcePlatform || 'Source'} · ${item.duration || 'video'} · ${coverStatusLabel(item.coverStatus)}`;
  detailPrompt.textContent = item.prompt;
  detailSource.href = sourceUrl;
  detailModal.hidden = false;
  document.body.classList.add('modal-open');
  detailClose.focus();
}

function closeDetail() {
  const video = detailMedia.querySelector('video');
  if (video) video.pause();
  detailModal.hidden = true;
  document.body.classList.remove('modal-open');
  activeCase = null;
}

function renderCases() {
  gridEl.innerHTML = '';
  const cases = payload.cases.filter(caseMatches).sort(compareCases);
  statusEl.textContent = `${payload.extractionStatus} Pure Prompt 优先排序，当前显示 ${cases.length} / ${payload.totalCases} 个案例。`;

  for (const item of cases) {
    const node = template.content.firstElementChild.cloneNode(true);
    const sourceUrl = item.sourceUrl || item.source;
    const coverImage = item.coverImage || 'data/images/banner.svg';

    node.querySelector('.cover-image').src = coverImage;
    node.querySelector('.cover-image').alt = `${item.title} cover`;
    node.querySelector('.case-id').textContent = item.id;
    node.querySelector('.duration').textContent = item.duration || 'video';
    node.querySelector('.platform-badge').textContent = item.sourcePlatform || 'Source';
    node.querySelector('.category').textContent = item.category;
    node.querySelector('h3').textContent = item.title;
    node.querySelector('.author').textContent = item.author || 'Unknown author';
    node.querySelector('.cover-status').textContent = coverStatusLabel(item.coverStatus);
    node.querySelector('.prompt').textContent =
      item.prompt.length > 220 ? `${item.prompt.slice(0, 220)}...` : item.prompt;
    node.querySelector('pre').textContent = item.prompt;
    node.querySelector('.source').href = sourceUrl;

    const dependencies = node.querySelector('.dependency-list');
    for (const label of dependencyLabels(item)) {
      dependencies.append(dependencyChip(label));
    }

    const mediaFrame = node.querySelector('.media-frame');
    mediaFrame.tabIndex = 0;
    mediaFrame.setAttribute('role', 'button');
    mediaFrame.setAttribute('aria-label', `Open ${item.title} details`);
    mediaFrame.addEventListener('click', () => openDetail(item));
    mediaFrame.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetail(item);
      }
    });

    const tags = node.querySelector('.tag-list');
    for (const tag of (item.tags || []).slice(0, 5)) {
      tags.append(tagChip(tag));
    }

    const caution = node.querySelector('.caution');
    if (item.caution) {
      caution.textContent = item.caution;
    } else {
      caution.remove();
    }

    const assets = node.querySelector('.asset-list');
    for (const image of item.inputs?.images || []) {
      assets.append(assetChip(image.label, image.localPath, image.status));
    }
    for (const video of item.inputs?.videos || []) {
      assets.append(assetChip(video.label, video.localPath, video.status));
    }
    assets.append(assetChip('来源平台', sourceUrl, item.sourcePlatform || 'source'));
    if (item.output?.localPath || item.output?.status) {
      assets.append(assetChip('原始视频', item.output.localPath, item.output.status));
    }

    node.querySelector('.detail-button').addEventListener('click', () => openDetail(item));

    const copyButton = node.querySelector('.copy-button');
    copyButton.addEventListener('click', () => copyPrompt(item.prompt, copyButton));

    gridEl.append(node);
  }
}

function render() {
  renderTabs();
  renderCases();
}

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  renderCases();
});

detailModal.addEventListener('click', (event) => {
  if (event.target.matches('[data-close-detail]')) closeDetail();
});

detailCopy.addEventListener('click', () => {
  if (activeCase) copyPrompt(activeCase.prompt, detailCopy);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !detailModal.hidden) closeDetail();
});

renderStats();
render();
