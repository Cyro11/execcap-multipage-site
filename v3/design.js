(() => {
 document.querySelectorAll('[data-requires-script]').forEach(button=>{button.disabled=false});
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const perspectives={
  search:['Turn experience into a focused search.','Define the business characteristics that fit your experience, goals, and ability to lead.','In focus: acquisition thesis · target criteria'],
  evaluate:['Test the opportunity against the evidence.','Identify the financial and operating questions that could change the acquisition case.','In focus: screening · diligence questions'],
  capital:['Bring the structure into the business case.','Consider financing, deal terms, and investor expectations alongside the operating plan.','In focus: financing · terms · alignment'],
  ownership:['Prepare for the work after close.','Think through the seller handoff, essential relationships, and the first operating priorities.','In focus: continuity · transition · leadership'],
  operator:['Start with what you can understand and lead.','The customers, teams, and operating problems you know should help define where you look.','Ask: Where would my experience help me assess the business?'],
  quality:['Define what a sound business looks like.','Consider the customers, revenue model, operating complexity, and dependence on the current owner.','Ask: Which characteristics matter to my ability to lead?'],
  boundaries:['Separate preferences from requirements.','Give each requirement a reason. Keep preferences flexible as you learn from actual opportunities.','Ask: Which conditions would make me walk away?'],
  evidence:['Make the thesis something you can test.','Attach information and open questions to the criteria. Revise deliberately as you learn.','Ask: What evidence would support or change the thesis?']
 };
 document.querySelectorAll('[data-lens-workbench]').forEach(workbench=>{
  const tabs=[...workbench.querySelectorAll('[data-lens-tab]')];
  const panel=workbench.querySelector('[role=tabpanel]');
  const activate=tab=>{
   const key=tab.dataset.lensTab,copy=perspectives[key];
   tabs.forEach(x=>{x.setAttribute('aria-selected',String(x===tab));x.tabIndex=x===tab?0:-1});
   panel.setAttribute('aria-labelledby',tab.id);
   workbench.querySelector('[data-lens-title]').textContent=copy[0];
   workbench.querySelector('[data-lens-copy]').textContent=copy[1];
   workbench.querySelector('[data-lens-prompt]').textContent=copy[2];
   workbench.querySelector('.lens-panel-index').textContent='0'+(tabs.indexOf(tab)+1)+' / 04';
   workbench.querySelector('.lens-visual').dataset.stage=key;
   panel.classList.remove('panel-enter');
   if(!reduced.matches){void panel.offsetWidth;panel.classList.add('panel-enter')}
  };
  tabs.forEach((tab,index)=>{
   tab.addEventListener('click',()=>activate(tab));
   tab.addEventListener('keydown',e=>{
    let next;
    if(e.key==='ArrowRight')next=(index+1)%tabs.length;
    if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
    if(e.key==='Home')next=0;
    if(e.key==='End')next=tabs.length-1;
    if(next!==undefined){e.preventDefault();tabs[next].focus();activate(tabs[next])}
   });
  });
 });
 if('IntersectionObserver' in window && !reduced.matches){
  const elements=[...document.querySelectorAll('.capability-cell,.connected-layout,.editorial-preview,.visual-note,.firm-mosaic article,.principle-list>div,.card,.process-step,.learning-list>div')];
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px 30px 0px'});
  elements.forEach((element,index)=>{
   element.classList.add('reveal');element.style.setProperty('--reveal-delay',((index%4)*45)+'ms');
   if(element.getBoundingClientRect().top<window.innerHeight)element.classList.add('is-visible');else observer.observe(element);
  });
  document.documentElement.classList.add('motion-ready');
  reduced.addEventListener('change',e=>{if(e.matches){elements.forEach(x=>x.classList.add('is-visible'));observer.disconnect()}});
  // Browser history restoration always reveals restored content.
  window.addEventListener('pageshow',e=>{if(e.persisted)elements.forEach(x=>x.classList.add('is-visible'))});
 }
 const article=document.querySelector('.reading-prose');
 if(article){
  let pending=false;
  const update=()=>{
   const rect=article.getBoundingClientRect();
   const progress=Math.max(0,Math.min(1,(window.innerHeight-rect.top)/(rect.height+window.innerHeight)));
   document.documentElement.style.setProperty('--read-progress',(progress*100)+'%');pending=false;
  };
  window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});
  window.addEventListener('resize',update);update();
 }
 const sectionLinks=[...document.querySelectorAll('.reading-index>a,.process-index>a')];
 if('IntersectionObserver' in window && sectionLinks.length){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting)sectionLinks.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
  }),{rootMargin:'-15% 0px -60% 0px',threshold:0});
  sectionLinks.forEach(link=>{const target=document.getElementById(link.hash.slice(1));if(target)observer.observe(target)});
 }
})();
