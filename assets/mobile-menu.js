(() => {
  const button = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-nav');
  if (!button || !navigation) return;
  const mobile = window.matchMedia('(max-width:850px)');
  function close(restoreFocus = false) {
    const focusInside = navigation.contains(document.activeElement);
    button.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    if (restoreFocus && focusInside) button.focus({preventScroll:true});
  }
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close(true);
  });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !button.contains(event.target)) close();
  });
  document.addEventListener('focusin', event => {
    if (!navigation.contains(event.target) && !button.contains(event.target)) close();
  });
  mobile.addEventListener('change', () => close());
  window.addEventListener('pageshow', () => close());
})();
