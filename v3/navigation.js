// Registered before first paint, as required for pagereveal.
// https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
(() => {
 const handleTransition=event=>{
  if(!event.viewTransition)return;
  // A skipped transition still completes ordinary browser navigation. Its
  // ready promise can reject when a page is hidden or the opt-in changes.
  event.viewTransition.ready.catch(error=>{
   if(!['AbortError','InvalidStateError','TimeoutError'].includes(error.name))throw error;
  });
 };
 window.addEventListener('pageswap',handleTransition);
 window.addEventListener('pagereveal',handleTransition);
})();
