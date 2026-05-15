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

const categories = ['全部', ...payload.categories];

function renderStats() {
  const platforms = new Set(payload.cases.map((item) => item.sourcePlatform || 'Source')).size;
  const aiCovers = payload.cases.filter((item) =>
    ['ai-generated', 'ai-category'].includes(item.coverStatus)
  ).length;
  statsEl.innerHTML = `
    <div><strong>${payload.totalCases}</strong><span>prompts</span></div>
    <div><strong>${payload.categories.length}</strong><span>categories</span></div>
    <div><strong>${platforms}</strong><span>sources</span></div>
    <div><strong>${aiCovers}</strong><span>AI covers</span></div>
  `;
}

function coverStatusLabel(status) {
  if (status === 'source') return 'source cover';
  if (status === 'ai-generated') return 'AI cover';
  if (status === 'ai-category') return 'AI category cover';
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

function renderCases() {
  gridEl.innerHTML = '';
  const cases = payload.cases.filter(caseMatches);
  statusEl.textContent = `${payload.extractionStatus} 当前显示 ${cases.length} / ${payload.totalCases} 个案例。`;

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

    const copyButton = node.querySelector('.copy-button');
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(item.prompt);
      copyButton.textContent = 'Copied';
      setTimeout(() => {
        copyButton.textContent = 'Copy Prompt';
      }, 1200);
    });

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

renderStats();
render();
