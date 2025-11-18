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


// Hero reel modal behavior
(function(){
  const reel     = document.querySelector('.hero-reel');
  const video    = document.getElementById('heroVideo');
  const modal    = document.getElementById('reelModal');
  const stage    = modal?.querySelector('.reel-stage');
  const closeEls = modal?.querySelectorAll('[data-close="true"]') || [];

  if (!reel || !video || !modal || !stage) return;

  // placeholder to return the video on close
  const reelHome = document.createElement('div');
  reelHome.style.display = 'contents';
  video.parentNode.insertBefore(reelHome, video);

  /* NEW: during open we suppress the pause caused by the initial click */
  let suppressPause = false;

  // If a pause sneaks in while opening, immediately resume.
  video.addEventListener('pause', () => {
    if (suppressPause) {
      video.play().catch(()=>{});
    }
  });

  function openModal(){
    suppressPause = true;

    // Prevent this click from reaching the <video> for a moment
    video.style.pointerEvents = 'none';

    // Move video into modal and show it
    stage.appendChild(video);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');

    // Show controls in modal and keep it playing
    video.setAttribute('controls','');
    video.play().catch(()=>{});

    // Re-enable video interactions shortly; end suppression window
    setTimeout(() => {
      video.style.pointerEvents = '';
      suppressPause = false;
    }, 180);

    // optional: focus close button
    modal.querySelector('.reel-close')?.focus();
  }

  function closeModal(){
    // Move the video back
    reelHome.parentNode.insertBefore(video, reelHome.nextSibling);

    // Hide modal
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');

    // Inline mode: remove controls, keep looping muted playback
    video.removeAttribute('controls');
    video.play().catch(()=>{});

    // Return focus
    reel.focus();
  }

  // Open on click or Enter/Space (on the figure button)
  reel.addEventListener('click', openModal);
  reel.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });

  // Close on backdrop / [×]
  closeEls.forEach(el => el.addEventListener('click', closeModal));
  modal.addEventListener('click', (e)=>{
    if (e.target === modal.querySelector('.reel-backdrop')) closeModal();
  });

  // Close on Esc
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // Close when clicking anywhere outside the video/stage
modal.addEventListener('click', (e) => {
  const stageEl = modal.querySelector('.reel-stage');
  // If the click target is NOT inside the stage (which contains the video), close.
  if (!stageEl.contains(e.target)) {
    closeModal();
  }
});

// Prevent clicks inside the stage (video/controls) from bubbling up to modal
stage.addEventListener('click', (e) => {
  e.stopPropagation();
});

})();
