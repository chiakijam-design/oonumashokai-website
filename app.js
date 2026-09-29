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

// Keep each customer's before/after photos together in an accessible viewer.
(() => {
  const viewer = document.querySelector('#review-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const photo = viewer.querySelector('.review-viewer-photo');
  const title = viewer.querySelector('#review-viewer-title');
  const caption = viewer.querySelector('#review-viewer-caption');
  const count = viewer.querySelector('.review-viewer-count');
  const previous = viewer.querySelector('[data-photo-previous]');
  const next = viewer.querySelector('[data-photo-next]');
  const original = viewer.querySelector('.review-viewer-original');
  const error = viewer.querySelector('.review-viewer-error');
  let links = [], index = 0, opener = null;
  function display() {
    const link = links[index];
    error.hidden = true;
    photo.alt = link.querySelector('img').alt;
    photo.src = link.href;
    original.href = link.href;
    caption.textContent = link.querySelector('span').textContent;
    count.textContent = `${index + 1} / ${links.length}`;
    previous.disabled = index === 0;
    next.disabled = index === links.length - 1;
  }
  function move(step) {
    const target = index + step;
    if (target < 0 || target >= links.length) return;
    index = target;
    display();
  }
  document.querySelectorAll('.review-photo-pair a').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      links = [...link.closest('.review-photo-pair').querySelectorAll('a')];
      index = links.indexOf(link);
      opener = link;
      title.textContent = link.closest('.review-story').querySelector('.review-top span').textContent;
      display();
      viewer.showModal();
      document.documentElement.classList.add('review-viewer-open');
      event.preventDefault();
    });
  });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  viewer.querySelector('[data-photo-close]').addEventListener('click', () => viewer.close());
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  viewer.addEventListener('close', () => {
    document.documentElement.classList.remove('review-viewer-open');
    photo.removeAttribute('src');
    opener?.focus({preventScroll: true});
    links = [];
  });
  photo.addEventListener('error', () => { if (viewer.open) error.hidden = false; });
  photo.addEventListener('load', () => { error.hidden = true; });
})();

