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
    document.querySelector('#video-dialog-title').textContent = button.dataset.title;
    document.querySelector('#video-external').href = `https://www.tiktok.com/@yaneyalow/video/${id}`;
    const iframe = document.createElement('iframe');
    iframe.title = `${button.dataset.title} / 大沼商会 TikTok`;
    iframe.src = `https://www.tiktok.com/player/v1/${id}?autoplay=1&rel=0&description=0&music_info=0`;
    iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
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
