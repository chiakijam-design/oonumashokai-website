(() => {
  'use strict';
  // Make the entire cover (including the photo-count badge) a reliable tap target.
  // Cancel native summary activation so one tap never toggles the details twice.
  document.querySelectorAll('.case-card summary .case-cover').forEach(cover => {
    cover.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const details = cover.closest('details');
      details.open = !details.open;
    });
  });
  const dialog = document.querySelector('#case-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const photo = dialog.querySelector('.case-viewer-photo');
  const title = dialog.querySelector('#case-viewer-title');
  const caption = dialog.querySelector('#case-viewer-caption');
  const count = dialog.querySelector('.case-viewer-count');
  const previous = dialog.querySelector('[data-photo-previous]');
  const next = dialog.querySelector('[data-photo-next]');
  const original = dialog.querySelector('.case-viewer-original');
  const error = dialog.querySelector('.case-viewer-error');
  let links = [], index = 0, opener = null;

  function display() {
    const link = links[index];
    error.hidden = true;
    photo.alt = link.querySelector('img').alt;
    photo.src = link.href;
    original.href = link.href;
    caption.textContent = link.closest('figure').querySelector('figcaption').textContent;
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
  document.querySelectorAll('.case-photo-grid a').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const card = link.closest('.case-card');
      links = [...card.querySelectorAll('.case-photo-grid a')];
      index = links.indexOf(link);
      opener = link;
      title.textContent = card.querySelector('h3').textContent;
      display();
      dialog.showModal();
      document.documentElement.classList.add('case-viewer-open');
      event.preventDefault();
    });
  });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  dialog.querySelector('[data-photo-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('case-viewer-open');
    photo.removeAttribute('src');
    opener?.focus({preventScroll: true});
    links = [];
  });
  photo.addEventListener('error', () => { if (dialog.open) error.hidden = false; });
  photo.addEventListener('load', () => { error.hidden = true; });
})();
