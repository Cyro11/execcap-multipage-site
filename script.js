(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  const revealItems = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const menuButton = document.querySelector('.menu');
  const navLinks = document.querySelector('.navlinks');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    }));
  }

  if (!reduceMotion) {
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const destination = link.href;
        if (!destination || new URL(destination).pathname === window.location.pathname) return;
        event.preventDefault();
        document.body.classList.add('is-leaving');
        window.setTimeout(() => { window.location.href = destination; }, 180);
      });
    });
  }

  const process = document.querySelector('[data-process]');
  if (process) {
    const items = Array.from(process.querySelectorAll('[data-process-step]'));
    const nodes = Array.from(process.querySelectorAll('[data-process-node]'));
    const progress = process.querySelector('[data-process-progress]');
    const setActive = (index) => {
      const boundedIndex = Math.max(0, Math.min(index, items.length - 1));
      items.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === boundedIndex));
      nodes.forEach((node, nodeIndex) => {
        node.classList.toggle('is-active', nodeIndex === boundedIndex);
        node.classList.toggle('is-passed', nodeIndex < boundedIndex);
      });
      const percent = items.length < 2 ? 100 : (boundedIndex / (items.length - 1)) * 100;
      if (progress) {
        progress.style.width = '2px';
        progress.style.height = `${percent}%`;
      }
    };
    let lastActive = -1;
    let ticking = false;
    const updateProcess = () => {
      const focalPoint = window.innerHeight * .46;
      const closestIndex = items.reduce((bestIndex, item, itemIndex) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + (itemRect.height / 2);
        const bestRect = items[bestIndex].getBoundingClientRect();
        const bestCenter = bestRect.top + (bestRect.height / 2);
        return Math.abs(itemCenter - focalPoint) < Math.abs(bestCenter - focalPoint) ? itemIndex : bestIndex;
      }, 0);
      if (closestIndex !== lastActive) {
        setActive(closestIndex);
        lastActive = closestIndex;
      }
      ticking = false;
    };
    const requestProcessUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProcess);
    };
    window.addEventListener('scroll', requestProcessUpdate, { passive: true });
    window.addEventListener('resize', requestProcessUpdate);
    requestProcessUpdate();
  }

  const careerStops = Array.from(document.querySelectorAll('[data-career-stop]'));
  const careerPanel = document.querySelector('[data-career-detail-panel]');
  if (careerStops.length && careerPanel) {
    const careerTitle = careerPanel.querySelector('[data-career-title-output]');
    const careerRole = careerPanel.querySelector('[data-career-role-output]');
    const careerDetail = careerPanel.querySelector('[data-career-detail-output]');
    const setCareerStop = (stop) => {
      careerStops.forEach((item) => {
        const isActive = item === stop;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      careerTitle.textContent = stop.dataset.careerTitle;
      careerRole.textContent = stop.dataset.careerRole;
      careerDetail.textContent = stop.dataset.careerDetail;
    };
    careerStops.forEach((stop) => stop.addEventListener('click', () => setCareerStop(stop)));
  }

  const form = document.querySelector('[data-fit-form]');
  const formStatus = document.querySelector('[data-form-status]');
  if (form && formStatus) {
    const roleSelect = form.querySelector('[data-role-select]');
    const roleOtherField = form.querySelector('[data-role-other]');
    const roleOtherInput = roleOtherField ? roleOtherField.querySelector('input') : null;
    const updateOtherRoleField = () => {
      const showOtherField = roleSelect && roleSelect.value === 'other';
      if (!roleOtherField || !roleOtherInput) return;
      roleOtherField.hidden = !showOtherField;
      roleOtherInput.disabled = !showOtherField;
      roleOtherInput.required = showOtherField;
    };
    if (roleSelect) {
      roleSelect.addEventListener('change', updateOtherRoleField);
      form.addEventListener('reset', () => window.requestAnimationFrame(updateOtherRoleField));
      updateOtherRoleField();
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      formStatus.classList.add('is-visible');
      formStatus.textContent = "Thank you. We'll review the context you shared and follow up with next steps.";
      form.reset();
    });
  }
})();



