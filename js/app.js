// Autoplay helper and reduced motion respect
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

// Draggable and controllable CRT video window on project pages
(function(){
  const win    = document.querySelector('.crt-window');
  const handle = win?.querySelector('.crt-window-header');
  if (!win || !handle) return;

  const redBtn    = handle.querySelector('.crt-dot.red');
  const yellowBtn = handle.querySelector('.crt-dot.yellow');
  const greenBtn  = handle.querySelector('.crt-dot.green');
  const video     = win.querySelector('video');

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let hasDetached = false;
  let placeholder = null;

  // Fullscreen state
  let isFullscreen = false;
  let fullscreenOverlay = null;
  let fullscreenInner = null;
  let preFullscreenParent = null;
  let preFullscreenNextSibling = null;
  let prevStyle = null; 

  // Remember video state so we can restore it after fullscreen
  let prevVideoMuted = video ? video.muted : false;
  let prevVideoLoop  = video ? video.loop : false;
  let prevVideoHadControls = video ? video.hasAttribute('controls') : false;

  function startDrag(e){
    if (isFullscreen) return; // No drag while fullscreen

    const evt = e.touches ? e.touches[0] : e;

    isDragging = true;
    document.body.style.userSelect = 'none';
    handle.classList.add('is-dragging');

    const rect = win.getBoundingClientRect();

    // On first drag, detach from layout and leave a placeholder
    if (!hasDetached){
      hasDetached = true;

      placeholder = document.createElement('div');
      placeholder.className = 'crt-window-placeholder';
      placeholder.style.height = rect.height + 'px';
      win.parentNode.insertBefore(placeholder, win);

      win.style.position = 'fixed';
      win.style.left = rect.left + 'px';
      win.style.top  = rect.top + 'px';
      win.style.width = rect.width + 'px';
    }

    offsetX = evt.clientX - parseFloat(win.style.left);
    offsetY = evt.clientY - parseFloat(win.style.top);

    e.preventDefault();
  }

  function onDrag(e){
    if (!isDragging) return;

    const evt = e.touches ? e.touches[0] : e;

    let newLeft = evt.clientX - offsetX;
    let newTop  = evt.clientY - offsetY;

    const winWidth = win.offsetWidth;
    const winHeight = win.offsetHeight;
    const maxLeft = window.innerWidth - winWidth;
    const maxTop  = window.innerHeight - winHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop  = Math.max(0, Math.min(newTop, maxTop));

    win.style.left = newLeft + 'px';
    win.style.top  = newTop + 'px';
  }

  function endDrag(){
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = '';
    handle.classList.remove('is-dragging');
  }

  // Fullscreen helpers (green button)

  function enterFullscreen(){
    if (isFullscreen) return;

    // Save current DOM position
    preFullscreenParent = win.parentNode;
    preFullscreenNextSibling = win.nextSibling;

    prevStyle = {
      position: win.style.position,
      left: win.style.left,
      top: win.style.top,
      width: win.style.width
    };

    // Save video state before we change it
    if (video){
      prevVideoMuted = video.muted;
      prevVideoLoop  = video.loop;
      prevVideoHadControls = video.hasAttribute('controls');
    }

    // Create overlay if needed
    fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.className = 'crt-fullscreen-overlay';

    fullscreenInner = document.createElement('div');
    fullscreenInner.className = 'crt-fullscreen-overlay-inner';

    fullscreenOverlay.appendChild(fullscreenInner);
    document.body.appendChild(fullscreenOverlay);

    // Move window into overlay
    fullscreenInner.appendChild(win);
    win.classList.add('is-fullscreen');

    // Reset positioning so CSS controls it
    win.style.position = 'relative';
    win.style.left = '';
    win.style.top = '';
    win.style.width = '';

    if (video){
      video.setAttribute('controls', '');
      video.controls = true;

      video.loop = true;
      video.play().catch(()=>{});
    }

    isFullscreen = true;

    // Click backdrop to exit
    fullscreenOverlay.addEventListener('click', function(ev){
      if (ev.target === fullscreenOverlay){
        exitFullscreen();
      }
    }, { once: true });
  }

  function exitFullscreen(){
    if (!isFullscreen) return;

    win.classList.remove('is-fullscreen');

    // Restore DOM position
    if (preFullscreenParent){
      if (preFullscreenNextSibling && preFullscreenNextSibling.parentNode === preFullscreenParent){
        preFullscreenParent.insertBefore(win, preFullscreenNextSibling);
      } else {
        preFullscreenParent.appendChild(win);
      }
    }

    // Restore inline positioning
    if (prevStyle){
      win.style.position = prevStyle.position || '';
      win.style.left     = prevStyle.left || '';
      win.style.top      = prevStyle.top || '';
      win.style.width    = prevStyle.width || '';
    }

    // Restore video state
    if (video){
      if (!prevVideoHadControls){
        video.removeAttribute('controls');
        video.controls = false;
      }
      video.muted = prevVideoMuted;
      video.loop  = prevVideoLoop;
    }

    // Remove overlay
    if (fullscreenOverlay && fullscreenOverlay.parentNode){
      fullscreenOverlay.parentNode.removeChild(fullscreenOverlay);
    }

    fullscreenOverlay = null;
    fullscreenInner = null;
    isFullscreen = false;
    prevStyle = null;
    preFullscreenParent = null;
    preFullscreenNextSibling = null;
  }

  // Esc to exit fullscreen
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && isFullscreen){
      exitFullscreen();
    }
  });

  // Reset (yellow button)

  function resetWindow(){
    // If fullscreen, exit it first
    if (isFullscreen){
      exitFullscreen();
    }

    if (hasDetached){
      // Return to normal layout
      win.style.position = '';
      win.style.left = '';
      win.style.top = '';
      win.style.width = '';

      if (placeholder){
        placeholder.remove();
        placeholder = null;
      }

      hasDetached = false;
    }
  }

  // Close (red button)

  function closeWindow(){
    if (isFullscreen){
      exitFullscreen();
    }
  
    if (!placeholder){
      const rect = win.getBoundingClientRect();
      placeholder = document.createElement('div');
      placeholder.className = 'crt-window-placeholder';
      placeholder.style.height = rect.height + 'px';
      win.parentNode.insertBefore(placeholder, win);
    }
  
    hasDetached = false;
    win.remove();
  }
  

  // Mouse events for dragging
  handle.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);

  // Touch events
  handle.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('touchend', endDrag);
  document.addEventListener('touchcancel', endDrag);

  // Button wire-up
  redBtn?.addEventListener('click', function(e){
    e.stopPropagation();
    closeWindow();
  });

  yellowBtn?.addEventListener('click', function(e){
    e.stopPropagation();
    resetWindow();
  });

  greenBtn?.addEventListener('click', function(e){
    e.stopPropagation();
    if (isFullscreen){
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  });
  video?.addEventListener('click', function(e){
    // If already fullscreen, let the browser handle click normally
    if (isFullscreen) return;
  
    e.preventDefault();
    e.stopPropagation();
  
    // Enter fullscreen
    enterFullscreen();
  });
  

})();
