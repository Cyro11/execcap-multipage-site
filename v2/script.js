(() => {
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const setMenu = open => { toggle.setAttribute('aria-expanded', String(open)); toggle.querySelector('span').textContent = open ? 'Close' : 'Menu'; nav.classList.toggle('open', open); };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.header-inner')) setMenu(false); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('pageshow', () => setMenu(false));
  window.matchMedia('(min-width: 1101px)').addEventListener('change', e => { if(e.matches) setMenu(false); });
  const signup = document.querySelector('[data-signup-form]');
  signup?.addEventListener('submit', e => {
    e.preventDefault();
    if(!signup.reportValidity()) return;
    const status = signup.querySelector('.form-status');
    status.hidden = false;
    status.textContent = 'Preview complete. In the live signup, a confirmation would appear here. Your details have not been saved or sent, and you have not joined a mailing list.';
    status.focus();
  });
  const inquiry = document.querySelector('[data-inquiry-form]');
  let draft = '';
  inquiry?.addEventListener('submit', e => {
    e.preventDefault();
    if(!inquiry.reportValidity()) return;
    const data = new FormData(inquiry);
    draft = 'Name: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\nTopic: ' + data.get('role') + '\n\n' + data.get('message');
    const url = 'mailto:jtolbert@ExecCapAdvisors.com?subject=' + encodeURIComponent('ExecCap inquiry: ' + data.get('role')) + '&body=' + encodeURIComponent(draft);
    inquiry.querySelector('.draft-actions').hidden = false;
    inquiry.querySelector('.email-draft').value = draft;
    const status = inquiry.querySelector('.form-status');
    status.hidden = false;
    status.textContent = 'Your email draft is ready. Review and send it in your email app. If no app opens, copy the text below. Nothing has been sent by this website.';
    window.location.href = url;
  });
  document.querySelector('[data-copy-inquiry]')?.addEventListener('click', async () => {
    const status = inquiry.querySelector('.form-status');
    try { await navigator.clipboard.writeText(draft); status.textContent = 'Email text copied. Paste it into your email app, review it, and send it to jtolbert@ExecCapAdvisors.com.'; }
    catch { const text = inquiry.querySelector('.email-draft'); text.focus(); text.select(); status.textContent = 'The draft is selected. Copy it and paste it into your email app.'; }
  });
})();
