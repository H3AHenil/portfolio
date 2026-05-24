const projects = [
  {
    id: 'p1',
    href: 'projects/project-ctrlzen.html',
    title: 'Ctrl+Zen - nwHacks Hackathon',
    caption: 'Real-time attention and emotion sensing via OpenCV/DeepFace.',
    poster: 'assets/img/ctrlzen.png',
    stack: ['Python', 'JS', 'HTML/CSS', 'Figma', 'Flask'],
    sources: [
      { src: 'assets/video/ctrlzen-video.mp4', type: 'video/mp4' },
    ],
    year: 4,
    teamType: 'team',
  },
  {
    id: 'p2',
    href: 'projects/project-ss.html',
    title: 'VR Physics Simulator',
    caption: 'High-fidelity VR interaction with low-latency hand physics, animation, & grab mechanics.',
    poster: 'assets/img/slap-sim-poster.png',
    stack: ['Unity', 'C#', 'XR Interaction Toolkit'],
    sources: [
      { src: 'assets/video/slap-sim-cropped2.mp4', type: 'video/mp4' },
    ],
    year: 1,
    teamType: 'solo',
  },
  {
    id: 'p3',
    href: 'projects/project-tarot.html',
    title: 'Tarot Fortune Reader App',
    caption: 'Animated XML UI (Glide), sortable library, & OOP deck architecture.',
    poster: 'assets/img/tarot.png',
    stack: ['Android Studio', 'Java', 'XML', 'Glide', 'Emulators'],
    sources: [
      { src: 'assets/video/tarot.mp4', type: 'video/mp4' },
    ],
    year: 2,
    teamType: 'solo',
  },
  {
    id: 'p4',
    href: 'https://github.com/H3AHenil/squid_game_database',
    title: 'Squid Game Web Database',
    caption: 'Oracle SQL app with REST endpoints, live queries, & normalized BCNF schema.',
    poster: 'assets/img/sg-poster.png',
    stack: ['SQL', 'JS', 'HTML/CSS', 'Express.js'],
    sources: [],
    year: 5,
    teamType: 'team',
    newTab: true,
  },
  {
    id: 'p5',
    href: 'https://github.com/H3AHenil/resource_management_simulator',
    title: 'Resource Management Simulator',
    caption: 'OOP-based Java strategy sim, JSON save/load, & JUnit test coverage.',
    poster: 'assets/img/rms.png',
    stack: ['Java', 'Swing', 'JSON', 'JUnit'],
    sources: [],
    year: 3,
    teamType: 'solo',
    newTab: true,
    youtube: 'https://www.youtube.com/watch?v=tdAM_a6lvgM',
  },
  {
    id: 'p6',
    href: 'https://devpost.com/software/glasses-l4u7sm?_gl=1*lh83ip*_gcl_au*MTg5MjAzNDg5MC4xNzc5NjY1MjE5*_ga*MTgwNDE2ODQwMS4xNzc5NjY1MjE5*_ga_0YHJK3Y10M*czE3Nzk2NjUyMTkkbzEkZzEkdDE3Nzk2NjUyMjgkajUxJGwwJGgw',
    title: 'Pineapple Vision Pro',
    caption: 'OpenCV hand gesture controlled AR glasses',
    poster: 'assets/img/pineapple.jpg',
    stack: ['Python', 'OpenCV', 'Mediapipe'],
    sources: [],
    year: 6,
    teamType: 'team',
  },
];

(function () {
  const rootEl = document.getElementById('projects-root');
  if (!rootEl) return;

  const mobileQuery = window.matchMedia('(max-width: 768px), (hover: none), (pointer: coarse)');
  let isMobile = mobileQuery.matches;
  let sortBy = 'recommended';
  let filter = 'all';
  let videoCleanups = [];

  function el(tagName, options = {}, children = []) {
    const node = document.createElement(tagName);

    Object.entries(options).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;

      if (key === 'className') {
        node.className = value;
      } else if (key === 'text') {
        node.textContent = value;
      } else if (key === 'dataset') {
        Object.assign(node.dataset, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        node.setAttribute(key, value === true ? '' : value);
      }
    });

    children.forEach((child) => {
      if (child) node.append(child);
    });

    return node;
  }

  function displayedProjects() {
    let list = projects.slice();

    if (filter === 'solo') {
      list = list.filter((project) => project.teamType === 'solo');
    } else if (filter === 'team') {
      list = list.filter((project) => project.teamType === 'team');
    }

    if (sortBy === 'newest') {
      list = list.slice().sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    return list;
  }

  function lazyLoadVideo(video) {
    let loaded = false;

    function loadSources() {
      if (loaded) return;

      video.querySelectorAll('source[data-src]').forEach((source) => {
        source.src = source.dataset.src;
        source.removeAttribute('data-src');
      });

      video.load();
      loaded = true;
    }

    if (!('IntersectionObserver' in window)) {
      loadSources();
      return loadSources;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadSources();
        });
      },
      { rootMargin: '120px 0px', threshold: 0.25 }
    );

    observer.observe(video);
    videoCleanups.push(() => observer.disconnect());
    return loadSources;
  }

  function createCard(project) {
    const openInNewTab = project.newTab === true;
    const video = el('video', {
      className: 'proj-video',
      muted: true,
      playsinline: true,
      preload: 'none',
      poster: project.poster,
      'aria-label': `${project.title} preview`,
    });

    video.muted = true;
    video.playsInline = true;
    if (!isMobile) video.loop = true;

    project.sources.forEach((source) => {
      video.append(el('source', {
        dataset: { src: source.src },
        type: source.type,
      }));
    });

    const loadVideo = lazyLoadVideo(video);

    const thumbChildren = [video];

    if (project.youtube) {
      thumbChildren.push(el('a', {
        className: 'yt-icon-btn',
        href: project.youtube,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `Watch ${project.title} on YouTube`,
        onclick: (event) => event.stopPropagation(),
      }, [
        el('img', {
          src: 'assets/img/youtube.png',
          alt: '',
          'aria-hidden': 'true',
        }),
      ]));
    }

    const card = el('a', {
      className: 'project-card',
      href: project.href,
      target: openInNewTab ? '_blank' : undefined,
      rel: openInNewTab ? 'noopener noreferrer' : undefined,
      onmouseenter: () => {
        loadVideo();
        if (!isMobile) video.play().catch(() => {});
      },
      onmouseleave: () => {
        if (isMobile) return;
        video.pause();
        video.currentTime = 0;
      },
      onclick: (event) => {
        if (!isMobile || !project.sources.length) return;

        if (video.paused) {
          event.preventDefault();
          loadVideo();
          video.play().catch(() => {});
        }
      },
    }, [
      el('figure', { className: 'thumb' }, thumbChildren),
      el('h3', { className: 'proj-title', text: project.title }),
      el('p', { className: 'proj-caption', text: project.caption }),
      el('div', { className: 'stack' }, project.stack.map((item) => (
        el('span', { className: 'badge', text: item })
      ))),
    ]);

    return card;
  }

  function createToolbar() {
    const sortSelect = el('select', {
      onchange: (event) => {
        sortBy = event.target.value;
        render();
      },
    }, [
      el('option', { value: 'recommended', text: 'Recommended' }),
      el('option', { value: 'newest', text: 'Newest' }),
    ]);
    sortSelect.value = sortBy;

    const filterButton = (value, label) => el('button', {
      type: 'button',
      className: filter === value ? 'filter-pill is-active' : 'filter-pill',
      onclick: () => {
        filter = value;
        render();
      },
      text: label,
    });

    return el('div', { className: 'projects-toolbar' }, [
      el('div', { className: 'projects-sort' }, [
        el('label', {}, [
          document.createTextNode('Sort by: '),
          sortSelect,
        ]),
      ]),
      el('div', { className: 'projects-filters' }, [
        filterButton('all', 'All'),
        filterButton('solo', 'Individual'),
        filterButton('team', 'Team'),
      ]),
    ]);
  }

  function render() {
    videoCleanups.forEach((cleanup) => cleanup());
    videoCleanups = [];

    rootEl.replaceChildren(
      createToolbar(),
      el('div', { className: 'projects-grid' }, displayedProjects().map(createCard))
    );
  }

  const handleMobileChange = (event) => {
    isMobile = event.matches;
    render();
  };

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', handleMobileChange);
  } else {
    mobileQuery.addListener(handleMobileChange);
  }

  render();
})();
