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
  const pendingOutputs = payload.cases.filter((item) => item.output.status === 'pending').length;
  statsEl.innerHTML = `
    <div><strong>${payload.totalCases}</strong><span>cases</span></div>
    <div><strong>${payload.categories.length}</strong><span>categories</span></div>
    <div><strong>${pendingOutputs}</strong><span>media pending</span></div>
  `;
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
  const text = [item.title, item.category, item.prompt, item.output.label]
    .join(' ')
    .toLowerCase();
  return byCategory && text.includes(query);
}

function assetChip(label, path, status) {
  const chip = document.createElement('span');
  chip.className = `asset-chip ${status}`;
  chip.textContent = `${label}: ${path}`;
  return chip;
}

function renderCases() {
  gridEl.innerHTML = '';
  const cases = payload.cases.filter(caseMatches);
  statusEl.textContent = `${payload.extractionStatus} 当前显示 ${cases.length} / ${payload.totalCases} 个案例。`;

  for (const item of cases) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('.case-id').textContent = item.id;
    node.querySelector('.duration').textContent = item.duration || 'video';
    node.querySelector('.category').textContent = item.category;
    node.querySelector('h3').textContent = item.title;
    node.querySelector('.prompt').textContent = item.prompt.slice(0, 180);
    node.querySelector('pre').textContent = item.prompt;
    node.querySelector('.source').href = item.source;

    const assets = node.querySelector('.asset-list');
    for (const image of item.inputs.images) {
      assets.append(assetChip(image.label, image.localPath, image.status));
    }
    for (const video of item.inputs.videos) {
      assets.append(assetChip(video.label, video.localPath, video.status));
    }
    assets.append(assetChip('输出视频', item.output.localPath, item.output.status));

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
