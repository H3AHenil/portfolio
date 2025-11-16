// Autoplay helper + reduced motion respect (no flicker anywhere)
(function(){
    const vid = document.getElementById('heroVideo');
    if (!vid) return;
  
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReduced.matches) vid.pause();
  
    window.addEventListener('load', () => {
      const p = vid.play?.();
      if (p && typeof p.then === 'function') p.catch(()=>{ /* autoplay blocked */ });
    });
  
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) vid.pause(); else vid.play().catch(()=>{});
    });
  })();
  


  // Projects (lazy-load videos and hover-to-play)
(function(){
    const cards = document.querySelectorAll('.project-card');
  
    // Lazy-load sources when card enters the viewport
    const loadVideo = (video) => {
      if (!video || video.dataset.loaded) return;
      const sources = video.querySelectorAll('source[data-src]');
      sources.forEach(s => { s.src = s.dataset.src; s.removeAttribute('data-src'); });
      video.load(); // attach sources
      video.dataset.loaded = '1';
    };
  
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const v = entry.target.querySelector('.proj-video');
          loadVideo(v);
        }
      });
    }, { rootMargin: '120px 0px', threshold: 0.25 });
  
    cards.forEach(card => {
      io.observe(card);
  
      const v = card.querySelector('.proj-video');
  
      // Hover/focus play
      card.addEventListener('mouseenter', () => {
        loadVideo(v);
        v?.play?.().catch(()=>{});
      });
      card.addEventListener('mouseleave', () => {
        v?.pause?.();
        // optional rewind for crisp loop next hover:
        // v.currentTime = 0;
      });
  
      card.addEventListener('focus', () => {
        loadVideo(v);
        v?.play?.().catch(()=>{});
      }, true);
      card.addEventListener('blur', () => {
        v?.pause?.();
      }, true);
    });
  })();
  
  (function(){
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    }, { passive: false });
  })();
