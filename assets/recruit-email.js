(() => {
  'use strict';
  const card = document.querySelector('.recruit-email');
  if (!card) return;
  const address = card.querySelector('input');
  const button = card.querySelector('[data-copy-email]');
  const status = card.querySelector('[role="status"]');
  if (!address || !button || !status) return;
  button.hidden = false;
  address.addEventListener('click', () => address.select());
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address.value);
      status.textContent = 'メールアドレスをコピーしました。';
    } catch {
      address.focus();
      address.select();
      status.textContent = 'アドレスを選択しました。コピー操作でご利用ください。';
    }
  });
})();
