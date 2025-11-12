const vid = document.getElementById('introVideo');
if (vid) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) vid.pause();

  window.addEventListener('load', () => {
    const tryPlay = vid.play?.();
    if (tryPlay && typeof tryPlay.then === 'function') {
      tryPlay.catch(() => {/* autoplay blocked */});
    }
  });

  // pause video when tab is not active
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) vid.pause(); else vid.play().catch(()=>{});
  });
}
