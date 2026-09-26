(() => {
  const form = document.querySelector('#inquiry-form');
  if (!form) return;
  const button = form.querySelector('[type="submit"]');
  const status = document.querySelector('#inquiry-status');
  const states = status.querySelectorAll('[data-form-state]');
  let busy = false;
  const show = name => {
    states.forEach(node => { node.hidden = node.dataset.formState !== name; });
    if (name !== 'pending') status.focus();
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    const data = new FormData(form);
    for (const key of ['name','phone','email','message']) {
      const value = String(data.get(key) || '').trim();
      if (!value && ['email','message'].includes(key)) data.delete(key);
      else data.set(key, value);
    }
    if (!data.get('name') || !data.get('phone') || !String(data.get('topic') || '').trim()) { show('invalid'); return; }
    busy = true;
    button.disabled = true;
    form.setAttribute('aria-busy','true');
    show('pending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(form.action, {
        method:'POST', body:data, headers:{Accept:'application/json'},
        signal:controller.signal, credentials:'omit', referrerPolicy:'strict-origin-when-cross-origin'
      });
      let result;
      try { result = await response.json(); } catch { show('uncertain'); return; }
      if (response.ok && result.ok === true) {
        form.reset();
        form.hidden = true;
        show('success');
      } else if (response.status === 429) show('limit');
      else if ([400,422].includes(response.status)) show('invalid');
      else show('error');
    } catch {
      // A timeout can occur after acceptance; do not claim failure or auto-retry.
      show('uncertain');
    } finally {
      clearTimeout(timeout);
      busy = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
