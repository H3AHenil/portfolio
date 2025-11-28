const projects = [
    {
      id: 'p1',
      href: 'projects/project-ctrlzen.html',
      title: 'Ctrl+Zen - nwHacks Hackathon',
      caption: 'Real-time attention and emotion sensing via OpenCV/DeepFace.',
      poster: 'assets/img/ctrlzen.png',
      stack: ['Python', 'JS', 'HTML/CSS', 'Figma', 'Flask'],
      sources: [
        // { src: '../assets/video/test-vid.webm', type: 'video/webm' },
        { src: 'assets/video/ctrlzen-video.mp4',  type: 'video/mp4' },
      ],
      year: 4,
      teamType: 'team',
    },
    {
      id: 'p2',
      href: 'projects/project-temp.html',
      title: 'VR Physics Simulator',
      caption: 'High-fidelity VR interaction with low-latency hand physics, animation, & grab mechanics.',
      poster: '../assets/img/p2-poster.jpg',
      stack: ['Unity', 'C#', 'XR Interaction Toolkit'],
      sources: [
        { src: '../assets/video/p2.webm', type: 'video/webm' },
        { src: '../assets/video/p2.mp4',  type: 'video/mp4' },
      ],
      year: 1,
      teamType: 'solo',
    },
    {
      id: 'p3',
      href: 'projects/project-temp.html',
      title: 'Tarot Fortune Reader App',
      caption: 'Animated XML UI (Glide), sortable library, & OOP deck architecture.',
      poster: '../assets/img/p3-poster.jpg',
      stack: ['Android Studio', 'Java', 'XML', 'Glide', 'Emulators'],
      sources: [
        { src: '../assets/video/p3.webm', type: 'video/webm' },
        { src: '../assets/video/p3.mp4',  type: 'video/mp4' },
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
      sources: [
        // { src: '../assets/video/test-vid.webm', type: 'video/webm' },
        // { src: '../assets/video/test-vid.mp4',  type: 'video/mp4' }, coming soon!!!!
      ],
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
      sources: [
      ],
      year: 3,
      teamType: 'solo',
      newTab: true,
      youtube: 'https://www.youtube.com/watch?v=tdAM_a6lvgM'
    },
    {
      id: 'p6',
      href: 'projects/project-temp.html',
      title: 'RingWorks - WIP',
      caption: 'C++/OpenGL planetary rings: tiling, noise, LOD perf.',
      poster: '../assets/img/p5-poster.jpg',
      stack: ['C++', 'OpenGL', 'GLFW'],
      sources: [
        { src: '../assets/video/p3.webm', type: 'video/webm' },
        { src: '../assets/video/p3.mp4',  type: 'video/mp4' },
      ],
      year: 6,
      teamType: 'solo',
    },
  ];
  
  
  // Mobile detection
  function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false);
  
    React.useEffect(() => {
      const mq = window.matchMedia('(max-width: 768px), (hover: none), (pointer: coarse)');
      const update = () => setIsMobile(mq.matches);
      update();
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }, []);
  
    return isMobile;
  }
  
  function ProjectCard({ project, isMobile }) {
    const videoRef = React.useRef(null);
  
    React.useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
  
      let loaded = false;
  
      const loadSources = () => {
        if (loaded) return;
        const sources = video.querySelectorAll('source[data-src]');
        sources.forEach((s) => {
          s.src = s.dataset.src;
          s.removeAttribute('data-src');
        });
        video.load();
        loaded = true;
      };
  
      // Lazy load when the card/video enters viewport
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadSources();
            }
          });
        },
        { rootMargin: '120px 0px', threshold: 0.25 }
      );
  
      io.observe(video);
  
      return () => {
        io.disconnect();
      };
    }, []);
  
    const handleMouseEnter = () => {
      if (isMobile) return;
      const v = videoRef.current;
      if (!v) return;
      v.play().catch(() => {});
    };
  
    const handleMouseLeave = () => {
      if (isMobile) return;
      const v = videoRef.current;
      if (!v) return;
      v.pause();
      v.currentTime = 0;
    };
  
    const handleClick = (e) => {
      if (!isMobile) return;
      const v = videoRef.current;
      if (!v) return;

      if (v.paused) {
        e.preventDefault();
        v.play().catch(() => {});
      }
    };

    const openInNewTab = project.newTab === true;
    return (
     <a
  className="project-card"
  href={project.href}
  target={openInNewTab ? '_blank' : undefined}
  rel={openInNewTab ? 'noopener noreferrer' : undefined}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={handleClick}
>
<figure className="thumb">
  <video
    className="proj-video"
    muted
    playsInline
    loop={!isMobile}
    preload="none"
    poster={project.poster}
    aria-label={`${project.title} preview`}
    ref={videoRef}
  >
    {project.sources.map((src) => (
      <source key={src.src} data-src={src.src} type={src.type} />
    ))}
  </video>

  {project.youtube && (
    <a
      className="yt-icon-btn"
      href={project.youtube}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${project.title} on YouTube`}
      onClick={(e) => e.stopPropagation()}   // don’t trigger the card link
    >
      <img src="../assets/img/youtube.png" alt="" aria-hidden="true" />
    </a>
  )}
</figure>

        <h3 className="proj-title">{project.title}</h3>
        <p className="proj-caption">{project.caption}</p>
        <div className="stack">
  {project.stack.map((item) => (
    <span key={item} className="badge">{item}</span>
  ))}
</div>

        
      </a>
    );
  }
  
  function ProjectsGrid() {
    const isMobile = useIsMobile();
    const [sortBy, setSortBy] = React.useState('recommended');
    const [filter, setFilter] = React.useState('all');
  
    const displayedProjects = React.useMemo(() => {
      // Start with original order
      let list = projects.slice();
  
      // Filter by teamType
      if (filter === 'solo') {
        list = list.filter(p => p.teamType === 'solo');
      } else if (filter === 'team') {
        list = list.filter(p => p.teamType === 'team');
      }
  
      // Sort
      if (sortBy === 'newest') {
        list = list.slice().sort((a, b) => (b.year || 0) - (a.year || 0));
      }
  
      return list;
    }, [sortBy, filter]);
  
    return (
      <>
        {/* Toolbar */}
        <div className="projects-toolbar">
          <div className="projects-sort">
            <label>
              Sort by:{' '}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest</option>
              </select>
            </label>
          </div>
  
          <div className="projects-filters">
            <button
              type="button"
              className={filter === 'all' ? 'filter-pill is-active' : 'filter-pill'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={filter === 'solo' ? 'filter-pill is-active' : 'filter-pill'}
              onClick={() => setFilter('solo')}
            >
              Individual
            </button>
            <button
              type="button"
              className={filter === 'team' ? 'filter-pill is-active' : 'filter-pill'}
              onClick={() => setFilter('team')}
            >
              Team
            </button>
          </div>
        </div>
  
        {/* Cards */}
        <div className="projects-grid">
          {displayedProjects.map(p => (
            <ProjectCard key={p.id} project={p} isMobile={isMobile} />
          ))}
        </div>
      </>
    );
  }
  
// Mount React only for the projects section
(function () {
    const rootEl = document.getElementById('projects-root');
    if (!rootEl) return;
  
    if (ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootEl);
      root.render(<ProjectsGrid />);
    } else {
      ReactDOM.render(<ProjectsGrid />, rootEl);
    }
  })();
  