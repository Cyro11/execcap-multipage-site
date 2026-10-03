(() => {
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches || !('IntersectionObserver' in window))return;
 const elements=[...document.querySelectorAll('main > .section > .wrap, main > .cta > .wrap')];
 const show=element=>element.classList.add('is-visible');
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){show(entry.target);observer.unobserve(entry.target)}});
 },{threshold:0,rootMargin:'0px 0px -24px 0px'});
 elements.forEach(element=>{
  element.setAttribute('data-reveal','');
  const rect=element.getBoundingClientRect();
  if(rect.top<innerHeight && rect.bottom>0)show(element);else observer.observe(element);
 });
 document.documentElement.classList.add('fade-ready');
 document.addEventListener('focusin',event=>{
  const section=event.target.closest('[data-reveal]');
  if(section){show(section);observer.unobserve(section)}
 });
 window.addEventListener('pageshow',event=>{
  if(event.persisted)elements.forEach(element=>{if(element.getBoundingClientRect().top<innerHeight)show(element)});
 });
 preference.addEventListener('change',event=>{
  if(event.matches){document.documentElement.classList.remove('fade-ready');elements.forEach(show);observer.disconnect()}
 });
})();
