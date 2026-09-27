const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu(restoreFocus = false) {
  const focusWasInMenu = navigation.contains(document.activeElement);
  menuButton.setAttribute('aria-expanded','false');
  navigation.classList.remove('is-open');
  if (restoreFocus && focusWasInMenu) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', e => { if(e.key==='Escape') closeMenu(true); });
document.addEventListener('click', e => { if(!e.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width:851px)').addEventListener('change', () => closeMenu());

const dialog = document.querySelector('#video-dialog');
const player = document.querySelector('#video-player');
let previousOverflow = '';
document.querySelectorAll('[data-video]').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.dataset.video;
    // Only numeric TikTok post IDs belong in these fixed-origin URLs.
    if (!/^\d{19}$/.test(id || '')) return;
    document.querySelector('#video-dialog-title').textContent = button.dataset.title;
    document.querySelector('#video-external').href = `https://www.tiktok.com/@yaneyalow/video/${id}`;
    const iframe = document.createElement('iframe');
    iframe.title = `${button.dataset.title} / 大沼商会 TikTok`;
    iframe.src = `https://www.tiktok.com/player/v1/${id}?autoplay=1&rel=0&description=0&music_info=0`;
    iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(iframe);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{ if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();} });
dialog.addEventListener('close',()=>{ player.replaceChildren(); document.body.style.overflow=previousOverflow; });

const comparison = document.querySelector('.comparison');
document.querySelector('#compare-range').addEventListener('input',e=>comparison.style.setProperty('--split',`${e.target.value}%`));

// Keep every case readable without JavaScript; filters and paging enhance the list.
const caseCards = [...document.querySelectorAll('.case-card')];
const caseMore = document.querySelector('.case-more');
const caseCount = document.querySelector('#case-count');
const caseSelection = document.querySelector('#case-selection');
const caseFilters = [...document.querySelectorAll('[data-case-filter]')];
if (caseMore && caseCount && caseSelection && caseCards.length) {
  const caseBatchSize = 3;
  let selectedCategory = 'all';
  let visibleCases = caseBatchSize;
  const matchingCases = () => caseCards.filter(card => selectedCategory === 'all' || card.dataset.caseCategory === selectedCategory);
  function updateCases() {
    const matching = matchingCases();
    const visible = new Set(matching.slice(0, visibleCases));
    caseCards.forEach(card => {
      card.hidden = !visible.has(card);
      if (card.hidden) card.querySelector('details').open = false;
    });
    caseMore.hidden = visibleCases >= matching.length;
    caseCount.textContent = `${matching.length}件中 ${Math.min(visibleCases, matching.length)}件を表示`;
    caseFilters.forEach(link => {
      if (link.dataset.caseFilter === selectedCategory) {
        link.setAttribute('aria-current', 'true');
        caseSelection.textContent = `${link.textContent}の施工事例`;
      } else link.removeAttribute('aria-current');
    });
  }
  function selectFromHash() {
    const key = location.hash.replace('#cases-', '');
    const next = caseFilters.some(link => link.dataset.caseFilter === key) ? key : 'all';
    selectedCategory = next;
    visibleCases = caseBatchSize;
    updateCases();
  }
  window.addEventListener('hashchange', selectFromHash);
  caseMore.addEventListener('click', () => {
    const matching = matchingCases();
    const firstNew = matching[visibleCases];
    visibleCases = Math.min(visibleCases + caseBatchSize, matching.length);
    updateCases();
    firstNew?.querySelector('summary').focus();
  });
  selectFromHash();
}
