import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  BadgeDollarSign,
  Ban,
  Bell,
  BookOpen,
  ChevronRight,
  Code2,
  Crown,
  Download,
  FileText,
  Flame,
  Gamepad2,
  Gavel,
  HandCoins,
  Heart,
  HelpCircle,
  Home,
  Info,
  LayoutGrid,
  LockKeyhole,
  MessageCircle,
  Mic2,
  MonitorPlay,
  Music2,
  Newspaper,
  Play,
  Radio,
  Search,
  SendHorizontal,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Ticket,
  TrendingUp,
  Trophy,
  UserRound,
  Video,
  Wallet,
  Zap,
} from 'lucide-react';
import {
  categories,
  channels,
  communityPosts,
  creatorStudio,
  faqs,
  footerGroups,
  legalDocs,
  marketStats,
  monetizationProgram,
  promotionPlaybook,
  publicPages,
  revenueProducts,
  supportTopics,
  walletLines,
} from './data';
import { getJson, postJson } from './apiClient';

const categoryBySlug = Object.fromEntries(categories.map((category) => [category.slug, category]));
const channelBySlug = Object.fromEntries(channels.map((channel) => [channel.slug, channel]));
const defaultChannel = channels[0];

const primaryNav = [
  ['Browse', '/browse'],
  ['Community', '/community'],
  ['Studio', '/studio'],
  ['Money', '/monetization'],
  ['Support', '/support'],
];

const browseTabs = ['all', ...categories.map((category) => category.slug)];

const iconMap = {
  music: Music2,
  gaming: Gamepad2,
  irl: Radio,
  shows: Mic2,
  video: Video,
};

function readLocation() {
  return {
    path: window.location.pathname || '/',
    search: window.location.search,
    hash: window.location.hash,
  };
}

function useClientRoute() {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const handlePop = () => setLocation(readLocation());
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.path, location.search, location.hash]);

  function navigate(to) {
    const url = new URL(to, window.location.origin);
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setLocation(readLocation());
  }

  return { location, navigate };
}

function useApiData() {
  const [apiData, setApiData] = useState({
    status: 'checking',
    health: null,
    discover: null,
    community: { posts: communityPosts },
    creatorStudio,
    monetization: monetizationProgram,
    promotion: promotionPlaybook,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [health, discover, community, studio, monetization, promotion] = await Promise.all([
          getJson('/api/health'),
          getJson('/api/discover'),
          getJson('/api/community'),
          getJson('/api/creator-studio'),
          getJson('/api/monetization'),
          getJson('/api/promotion-plan'),
        ]);

        if (!cancelled) {
          setApiData({
            status: 'online',
            health,
            discover,
            community,
            creatorStudio: studio,
            monetization,
            promotion,
          });
        }
      } catch {
        if (!cancelled) {
          setApiData((current) => ({ ...current, status: 'offline' }));
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return apiData;
}

function RouteLink({ to, navigate, className = '', children, onClick, ...props }) {
  function handleClick(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onClick?.();
    navigate(to);
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

function Brand({ navigate }) {
  return (
    <RouteLink to="/" navigate={navigate} className="brand" aria-label="TAPN home">
      <span className="brand-mark">
        <Play size={17} fill="currentColor" strokeWidth={2.5} />
      </span>
      <span>Tapn</span>
    </RouteLink>
  );
}

function Topbar({ navigate, path, onLogin }) {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearch(event) {
    event.preventDefault();
    const next = searchTerm.trim();
    navigate(next ? `/search?q=${encodeURIComponent(next)}` : '/search');
  }

  return (
    <header className="topbar">
      <Brand navigate={navigate} />

      <nav className="topnav" aria-label="Primary navigation">
        {primaryNav.map(([label, to]) => (
          <RouteLink
            key={to}
            to={to}
            navigate={navigate}
            className={path === to ? 'active' : ''}
          >
            {label}
          </RouteLink>
        ))}
      </nav>

      <form className="search-box" onSubmit={handleSearch} role="search">
        <Search size={16} />
        <input
          value={searchTerm}
          placeholder="Search TAPN"
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search TAPN"
        />
      </form>

      <div className="header-actions">
        <button className="icon-button" type="button" title="Notifications">
          <Bell size={18} />
        </button>
        <button className="login-button" type="button" onClick={onLogin}>
          <UserRound size={17} />
          Log in
        </button>
      </div>
    </header>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer-lead">
        <Brand navigate={navigate} />
        <p>Black entertainment, live and paid.</p>
        <div className="social-row" aria-label="Social links">
          <span>X</span>
          <span>IG</span>
          <span>TikTok</span>
          <span>YT</span>
        </div>
      </div>

      <div className="footer-groups">
        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={`${group.title} links`}>
            <h2>{group.title}</h2>
            {group.links.map(([label, to]) => (
              <RouteLink key={to} to={to} navigate={navigate}>
                {label}
              </RouteLink>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  );
}

function App() {
  const { location, navigate } = useClientRoute();
  const apiData = useApiData();
  const [walletTotal, setWalletTotal] = useState(28418);
  const [activeBrowse, setActiveBrowse] = useState('all');
  const [selectedChannelSlug, setSelectedChannelSlug] = useState(defaultChannel.slug);
  const [followed, setFollowed] = useState([defaultChannel.slug]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const route = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return { path: location.path.replace(/\/+$/, '') || '/', searchParams };
  }, [location.path, location.search]);

  const selectedChannel = channelBySlug[selectedChannelSlug] ?? defaultChannel;

  function toggleFollow(slug) {
    setFollowed((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
    postJson(`/api/channels/${slug}/follow`).catch(() => {});
  }

  const pageProps = {
    navigate,
    apiData,
    walletTotal,
    setWalletTotal,
    activeBrowse,
    setActiveBrowse,
    selectedChannel,
    setSelectedChannelSlug,
    followed,
    toggleFollow,
    reviewOpen,
    setReviewOpen,
    onLogin: () => setLoginOpen(true),
  };

  return (
    <main className="app-shell">
      <Topbar navigate={navigate} path={route.path} onLogin={() => setLoginOpen(true)} />
      <PageRouter route={route} {...pageProps} />
      <Footer navigate={navigate} />
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </main>
  );
}

function PageRouter({ route, ...props }) {
  const { path, searchParams } = route;

  if (path === '/') return <HomePage {...props} />;
  if (path === '/browse') return <BrowsePage {...props} />;
  if (path === '/community') return <CommunityPage {...props} />;
  if (path === '/studio') return <CreatorStudioPage {...props} />;
  if (path === '/monetization') return <MonetizationPage {...props} />;
  if (path === '/search') return <SearchPage {...props} query={searchParams.get('q') ?? ''} />;
  if (path.startsWith('/category/')) {
    return <CategoryPage {...props} slug={path.replace('/category/', '')} />;
  }
  if (path.startsWith('/channel/')) {
    return <ChannelPage {...props} slug={path.replace('/channel/', '')} />;
  }
  if (path === '/support') return <SupportPage {...props} />;

  const clean = path.slice(1);
  if (publicPages[clean]) return <PublicPage {...props} page={publicPages[clean]} slug={clean} />;
  if (legalDocs[clean]) return <LegalPage {...props} doc={legalDocs[clean]} />;

  return <NotFoundPage {...props} />;
}

function HomePage({
  navigate,
  apiData,
  walletTotal,
  setWalletTotal,
  selectedChannel,
  setSelectedChannelSlug,
  followed,
  toggleFollow,
  reviewOpen,
  setReviewOpen,
}) {
  const walletDisplay = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(walletTotal);

  return (
    <>
      <section className="hero-grid" id="top">
        <aside className="side-rail" aria-label="TAPN live sections">
          <div className="rail-label">Now</div>
          <RouteLink to="/browse" navigate={navigate} className="rail-item active">
            <Radio size={18} />
            Live Desk
          </RouteLink>
          <RouteLink to="/category/music" navigate={navigate} className="rail-item">
            <Flame size={18} />
            Heat Index
          </RouteLink>
          <RouteLink to="/monetization" navigate={navigate} className="rail-item">
            <Wallet size={18} />
            Wallet
          </RouteLink>
          <RouteLink to="/guidelines" navigate={navigate} className="rail-item">
            <ShieldCheck size={18} />
            Review
          </RouteLink>
        </aside>

        <section className="hero-copy" aria-labelledby="hero-title">
          <p className="eyebrow">Black entertainment television, video, and streaming</p>
          <h1 id="hero-title">Tapn</h1>
          <p className="lead">
            A premium live culture network where creators can stream, build owned audiences,
            monetize in public, and stay protected by a serious review system.
          </p>

          <div className="hero-actions">
            <RouteLink to="/studio" navigate={navigate} className="primary-button">
              <Radio size={18} />
              Creator Studio
            </RouteLink>
            <button className="secondary-button" type="button" onClick={() => setReviewOpen((open) => !open)}>
              <ShieldCheck size={18} />
              Safety Desk
            </button>
          </div>

          <div className="stat-strip" aria-label="TAPN launch metrics">
            {marketStats.map((stat) => (
              <div className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <BackendStatus apiData={apiData} />
        </section>

        <FeaturedStage
          channel={selectedChannel}
          navigate={navigate}
          onFeature={setSelectedChannelSlug}
        />

        <aside className="money-panel" id="monetize" aria-label="Creator wallet">
          <div className="panel-heading">
            <div>
              <p>Creator wallet</p>
              <h2>{walletDisplay}</h2>
            </div>
            <BadgeDollarSign size={30} />
          </div>

          <div className="wallet-bars">
            {walletLines.map((line) => (
              <div className="wallet-line" key={line.label}>
                <div>
                  <span>{line.label}</span>
                  <strong>{line.amount}</strong>
                </div>
                <meter value={line.value} min="0" max="9000" />
                <i style={{ background: line.color }} />
              </div>
            ))}
          </div>

          <div className="tip-row">
            {[5, 25, 100].map((amount) => (
              <button type="button" key={amount} onClick={() => setWalletTotal((total) => total + amount)}>
                +${amount}
              </button>
            ))}
          </div>

          <div className="wallet-note">
            <Zap size={16} />
            Payouts, replay sales, drops, and sponsor money stay visible to the creator.
          </div>
        </aside>
      </section>

      <section className="control-band" id="culture">
        <SectionTitle eyebrow="Culture lanes" title="Live rooms with standards, ownership, and real money attached." />
        <RouteLink to="/browse" navigate={navigate} className="secondary-button">
          Browse all
          <ChevronRight size={18} />
        </RouteLink>
      </section>

      <ChannelGrid
        channels={channels.slice(0, 5)}
        navigate={navigate}
        followed={followed}
        toggleFollow={toggleFollow}
        onFeature={setSelectedChannelSlug}
        selectedSlug={selectedChannel.slug}
      />

      <CommunityPreview navigate={navigate} posts={apiData.community.posts} />

      <section className="studio-band" id="studio">
        <div className="studio-copy">
          <p>Creator command center</p>
          <h2>TAPN should feel like a network, a studio, and a bank account in one place.</h2>
        </div>
        <div className="studio-grid" aria-label="Creator operating console">
          <StudioPanel icon={MonitorPlay} title="Go live configured" text="Rights, payout, room safety, category, and replay settings sit in the same setup flow." />
          <StudioPanel icon={TrendingUp} title="Heat with receipts" text="Trust, chat signal, sponsor eligibility, and creator milestones stay measurable." />
          <StudioPanel icon={HandCoins} title="Money stays visible" text="Passes, tips, drops, ads, and sponsors land in one creator-facing wallet story." />
        </div>
      </section>

      <section className="product-system">
        <SectionTitle eyebrow="Creator economy" title="Monetization built into the entertainment surface." />
        <div className="product-grid">
          {revenueProducts.map(([title, detail], index) => {
            const icons = [Ticket, HandCoins, FileText, Crown];
            const Icon = icons[index];
            return (
              <article key={title}>
                <Icon size={25} />
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="operating-system" id="safety">
        <div className="review-panel">
          <div className="panel-heading">
            <div>
              <p>Safety desk</p>
              <h2>Careful review before extreme punishment.</h2>
            </div>
            <ShieldCheck size={32} />
          </div>
          <div className="review-list">
            {[
              [ShieldCheck, 'Evidence review', '12 min avg'],
              [Gavel, 'Appeal window', '7 days'],
              [Ban, 'Permanent removals', 'senior sign-off'],
              [LockKeyhole, 'Creator protection', 'doxxing lock'],
            ].map(([Icon, label, value]) => (
              <div className="review-item" key={label}>
                <Icon size={20} />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          {reviewOpen && (
            <div className="review-open" role="status">
              <BadgeCheck size={20} />
              Escalation queue open: 18 cases, 4 appeals, 0 instant lifetime bans.
            </div>
          )}
        </div>

        <div className="safety-workflow" aria-label="TAPN safety workflow">
          {['Detect', 'Review', 'Act', 'Appeal'].map((step, index) => (
            <article key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step}</h3>
              <p>{['Signals from chat velocity, reports, clips, and creator tools.',
                'Human escalation for extreme actions, with context and evidence.',
                'Warnings, room limits, suspensions, demonetization, or removal.',
                'Clear decisions, receipt history, and an appeal path for creators.'][index]}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function BackendStatus({ apiData }) {
  return (
    <div className={apiData.status === 'online' ? 'backend-status online' : 'backend-status'}>
      <span>{apiData.status === 'online' ? 'API online' : 'API fallback'}</span>
      <strong>{apiData.status === 'online' ? apiData.health.service : 'Bundled dummy data'}</strong>
    </div>
  );
}

function CommunityPreview({ navigate, posts }) {
  return (
    <section className="community-preview">
      <div className="section-split">
        <SectionTitle eyebrow="TAPN Community" title="The YouTube community tab, tuned for live rooms." />
        <RouteLink to="/community" navigate={navigate} className="secondary-button">
          Open community
          <ChevronRight size={18} />
        </RouteLink>
      </div>
      <div className="community-preview-grid">
        {posts.slice(0, 3).map((post) => (
          <article key={post.id}>
            <img src={post.image} alt="" />
            <div>
              <span>{post.creator}</span>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeaturedStage({ channel, navigate }) {
  return (
    <section className="stage-panel" id="live" aria-label="Featured live stream">
      <img src={channel.image} alt={`${channel.title} preview`} />
      <div className="stage-overlay">
        <div className="stage-topline">
          <div className="live-badge">
            <span />
            Live
          </div>
          <div className="trust-pill">
            <BadgeCheck size={16} />
            {channel.trust} trust
          </div>
        </div>

        <div className="stage-meta">
          <p>{channel.kind}</p>
          <h2>{channel.title}</h2>
          <div className="stage-row">
            <span>{channel.viewers} watching</span>
            <span>{channel.paid} earned tonight</span>
            <span>{channel.city}</span>
          </div>
        </div>

        <div className="stage-footer">
          <div className="stage-signal">
            <span>{channel.replay}</span>
            <span>{channel.sponsor}</span>
            <span>{channel.chat} chat</span>
          </div>
          <RouteLink to={`/channel/${channel.slug}`} navigate={navigate} className="watch-button">
            Watch
            <ChevronRight size={18} />
          </RouteLink>
        </div>
      </div>
    </section>
  );
}

function BrowsePage({
  navigate,
  apiData,
  activeBrowse,
  setActiveBrowse,
  selectedChannel,
  setSelectedChannelSlug,
  followed,
  toggleFollow,
}) {
  const sourceChannels = apiData.discover?.channels ?? channels;
  const visibleChannels =
    activeBrowse === 'all' ? sourceChannels : sourceChannels.filter((channel) => channel.category === activeBrowse);

  return (
    <section className="browse-shell">
      <LiveRail navigate={navigate} />

      <div className="browse-main">
        <div className="browse-hero">
          <div>
            <p className="eyebrow">Browse</p>
            <h1>Find the room before it turns into the clip.</h1>
            <p>
              Category cards, live rows, creator trust, and money signals pull the strongest Kick and Twitch discovery
              ideas into TAPN's own royal broadcast system.
            </p>
            <div className="hero-actions">
              <RouteLink to={`/channel/${selectedChannel.slug}`} navigate={navigate} className="primary-button">
                Watch featured
              </RouteLink>
              <RouteLink to="/studio" navigate={navigate} className="secondary-button">
                Start streaming
              </RouteLink>
            </div>
          </div>
          <FeaturedStage channel={selectedChannel} navigate={navigate} />
        </div>

        <div className="browse-tabs" role="tablist" aria-label="Browse categories">
          {browseTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeBrowse === tab}
              className={activeBrowse === tab ? 'selected' : ''}
              onClick={() => setActiveBrowse(tab)}
            >
              {tab === 'all' ? 'All' : categoryBySlug[tab].short}
            </button>
          ))}
        </div>

        <section className="category-strip" aria-label="Top live categories">
          {categories.map((category) => {
            const Icon = iconMap[category.slug];
            return (
              <RouteLink
                key={category.slug}
                to={`/category/${category.slug}`}
                navigate={navigate}
                className="category-tile"
                style={{ '--tile-accent': category.accent, '--tile-text': category.accentText }}
              >
                <img src={category.image} alt="" />
                <div>
                  <Icon size={18} />
                  <h2>{category.name}</h2>
                  <p>{category.stats[0]}</p>
                </div>
              </RouteLink>
            );
          })}
        </section>

        <SectionTitle eyebrow="Live on TAPN" title="Recommended rooms for the current moment." />
        <ChannelGrid
          channels={visibleChannels}
          navigate={navigate}
          followed={followed}
          toggleFollow={toggleFollow}
          onFeature={setSelectedChannelSlug}
          selectedSlug={selectedChannel.slug}
        />
      </div>
    </section>
  );
}

function CategoryPage({ navigate, slug, followed, toggleFollow, setSelectedChannelSlug, selectedChannel }) {
  const category = categoryBySlug[slug] ?? categories[0];
  const categoryChannels = channels.filter((channel) => channel.category === category.slug);
  const Icon = iconMap[category.slug] ?? LayoutGrid;

  return (
    <section className="page-stack">
      <div
        className="category-hero"
        style={{ '--category-accent': category.accent, '--category-text': category.accentText }}
      >
        <img src={category.image} alt="" />
        <div>
          <p className="eyebrow">Category</p>
          <span className="category-mark">
            <Icon size={22} />
            {category.name}
          </span>
          <h1>{category.headline}</h1>
          <p>{category.description}</p>
          <div className="chip-row">
            {category.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <MetricBand items={category.stats} />

      <div className="section-split">
        <SectionTitle eyebrow="Live rooms" title={`${category.name} channels with creator-owned momentum.`} />
        <RouteLink to="/browse" navigate={navigate} className="secondary-button">
          Back to browse
        </RouteLink>
      </div>

      <ChannelGrid
        channels={categoryChannels}
        navigate={navigate}
        followed={followed}
        toggleFollow={toggleFollow}
        onFeature={setSelectedChannelSlug}
        selectedSlug={selectedChannel.slug}
      />
    </section>
  );
}

function ChannelPage({ navigate, slug, followed, toggleFollow, setWalletTotal }) {
  const channel = channelBySlug[slug] ?? defaultChannel;
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(channel.chatMessages);
  const category = categoryBySlug[channel.category];

  useEffect(() => {
    setMessages(channel.chatMessages);
    setDraft('');
  }, [channel.slug]);

  function sendMessage(event) {
    event.preventDefault();
    const next = draft.trim();
    if (!next) return;
    setMessages((current) => [...current, ['You', next]]);
    postJson(`/api/channels/${channel.slug}/chat`, { user: 'You', message: next }).catch(() => {});
    setDraft('');
  }

  return (
    <section className="watch-shell">
      <div className="watch-main">
        <div className="mock-player">
          <img src={channel.image} alt={`${channel.title} live`} />
          <div className="player-top">
            <span className="live-badge">
              <span />
              Live
            </span>
            <span>{channel.viewers} watching</span>
          </div>
          <button className="player-play" type="button" aria-label="Play mock stream">
            <Play size={34} fill="currentColor" />
          </button>
          <div className="player-bottom">
            <span>1080p</span>
            <span>Low latency</span>
            <span>{channel.replay}</span>
          </div>
        </div>

        <div className="watch-header">
          <div className="avatar">{channel.creator.slice(0, 2)}</div>
          <div>
            <p>{category.name} / {channel.city}</p>
            <h1>{channel.title}</h1>
            <span>{channel.creator}</span>
          </div>
          <div className="watch-actions">
            <button
              className={followed.includes(channel.slug) ? 'follow-button active' : 'follow-button'}
              type="button"
              onClick={() => toggleFollow(channel.slug)}
            >
              <Heart size={16} fill={followed.includes(channel.slug) ? 'currentColor' : 'none'} />
              {followed.includes(channel.slug) ? 'Following' : 'Follow'}
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                setWalletTotal((total) => total + 25);
                postJson(`/api/channels/${channel.slug}/tip`, { amount: 25 }).catch(() => {});
              }}
            >
              <HandCoins size={17} />
              Tip $25
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => postJson(`/api/channels/${channel.slug}/subscribe`).catch(() => {})}
            >
              <Ticket size={17} />
              Join $5
            </button>
          </div>
        </div>

        <div className="watch-info-grid">
          <InfoCard icon={BadgeCheck} label="Trust score" value={`${channel.trust}/100`} />
          <InfoCard icon={Wallet} label="Earned tonight" value={channel.paid} />
          <InfoCard icon={Ticket} label="Replay rights" value={channel.replay} />
          <InfoCard icon={Sparkles} label="Sponsor window" value={channel.sponsor} />
        </div>

        <article className="about-card">
          <h2>About this room</h2>
          <p>{channel.description}</p>
          <div className="chip-row">
            {channel.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </article>
      </div>

      <aside className="chat-panel" aria-label={`${channel.title} chat`}>
        <div className="chat-header">
          <div>
            <p>Live chat</p>
            <h2>{channel.chat}</h2>
          </div>
          <MessageCircle size={22} />
        </div>
        <div className="chat-messages">
          {messages.map(([user, message], index) => (
            <div key={`${user}-${index}`} className={user === 'You' ? 'chat-message self' : 'chat-message'}>
              <strong>{user}</strong>
              <span>{message}</span>
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={sendMessage}>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Send a message" />
          <button type="submit" aria-label="Send message">
            <SendHorizontal size={17} />
          </button>
        </form>
      </aside>

      <RouteLink to={`/category/${channel.category}`} navigate={navigate} className="category-return">
        <ChevronRight size={17} />
        More in {category.name}
      </RouteLink>
    </section>
  );
}

function CommunityPage({ navigate, apiData }) {
  const [posts, setPosts] = useState(apiData.community.posts);

  useEffect(() => {
    setPosts(apiData.community.posts);
  }, [apiData.community.posts]);

  function reactToPost(postId) {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)),
    );
    postJson(`/api/community/${postId}/react`).catch(() => {});
  }

  return (
    <section className="youtube-community-shell">
      <aside className="community-sidebar">
        <RouteLink to="/browse" navigate={navigate}>
          <Home size={18} />
          Home feed
        </RouteLink>
        <RouteLink to="/community" navigate={navigate} className="active">
          <MessageCircle size={18} />
          Community
        </RouteLink>
        <RouteLink to="/studio" navigate={navigate}>
          <MonitorPlay size={18} />
          Studio
        </RouteLink>
        <RouteLink to="/monetization" navigate={navigate}>
          <Wallet size={18} />
          Monetization
        </RouteLink>
      </aside>

      <div className="community-feed">
        <div className="community-hero">
          <p className="eyebrow">Community home</p>
          <h1>Build the room before the stream starts.</h1>
          <p>
            TAPN should borrow YouTube's habit loop: posts, polls, clips, premieres, comments, and subscriptions keep
            fans warm between live moments while Discord-style rooms make fans feel known.
          </p>
          <BackendStatus apiData={apiData} />
        </div>

        <div className="post-composer">
          <div className="avatar">TP</div>
          <div>
            <strong>Post to TAPN Community</strong>
            <span>Poll, clip, replay drop, member update, or sponsor note.</span>
          </div>
          <button type="button">Draft post</button>
        </div>

        {posts.map((post) => {
          const channel = channelBySlug[post.channelSlug] ?? defaultChannel;
          return (
            <article className="community-post" key={post.id}>
              <div className="post-header">
                <div className="avatar">{post.avatar}</div>
                <div>
                  <strong>{post.creator}</strong>
                  <span>{post.posted} / {post.type}</span>
                </div>
              </div>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
              <img src={post.image} alt="" />
              {post.options && (
                <div className="poll-stack">
                  {post.options.map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <meter min="0" max="100" value={value} />
                      <strong>{value}%</strong>
                    </div>
                  ))}
                </div>
              )}
              <div className="chip-row">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="post-actions">
                <button type="button" onClick={() => reactToPost(post.id)}>
                  <Heart size={16} />
                  {post.likes.toLocaleString()}
                </button>
                <RouteLink to={`/channel/${channel.slug}`} navigate={navigate}>
                  <Play size={16} />
                  Watch room
                </RouteLink>
                <span>{post.comments} comments</span>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="community-rooms">
        <h2>House rooms</h2>
        {categories.map((category) => (
          <RouteLink key={category.slug} to={`/category/${category.slug}`} navigate={navigate}>
            <span style={{ background: category.accent, color: category.accentText }}>{category.short.slice(0, 2)}</span>
            <div>
              <strong>{category.name} House</strong>
              <small>{category.stats[0]}</small>
            </div>
          </RouteLink>
        ))}
      </aside>
    </section>
  );
}

function CreatorStudioPage({ apiData, navigate }) {
  const studio = apiData.creatorStudio;
  const maxRevenue = Math.max(...studio.revenue.map(([, value]) => value));

  return (
    <section className="studio-page">
      <div className="studio-hero-panel">
        <div>
          <p className="eyebrow">Creator Studio</p>
          <h1>{studio.headline}</h1>
          <p>
            A backend-aware dashboard for uploads, community posts, live setup, wallet visibility, sponsor readiness,
            and replay packaging. It is dummy data today; the API shape is ready for real services later.
          </p>
          <div className="hero-actions">
            <RouteLink to="/community" navigate={navigate} className="primary-button">
              Community feed
            </RouteLink>
            <RouteLink to="/monetization" navigate={navigate} className="secondary-button">
              Monetization ladder
            </RouteLink>
          </div>
        </div>
        <BackendStatus apiData={apiData} />
      </div>

      <div className="studio-metrics">
        {studio.metrics.map(([label, value, delta]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{delta}</small>
          </article>
        ))}
      </div>

      <div className="studio-ops-grid">
        <section className="studio-queue">
          <h2>Publishing queue</h2>
          {studio.queue.map(([type, title, status]) => (
            <div key={`${type}-${title}`}>
              <span>{type}</span>
              <strong>{title}</strong>
              <em>{status}</em>
            </div>
          ))}
        </section>

        <section className="studio-revenue">
          <h2>Revenue mix</h2>
          {studio.revenue.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <meter min="0" max={maxRevenue} value={value} />
              <strong>${value.toLocaleString()}</strong>
            </div>
          ))}
        </section>

        <section className="studio-api-panel">
          <h2>Mock backend endpoints</h2>
          {studio.backendEndpoints.map((endpoint) => (
            <code key={endpoint}>{endpoint}</code>
          ))}
        </section>
      </div>
    </section>
  );
}

function MonetizationPage({ apiData, navigate }) {
  const program = apiData.monetization;

  return (
    <section className="money-page">
      <div className="money-hero">
        <p className="eyebrow">Monetization</p>
        <h1>Give streamers a path from attention to ownership.</h1>
        <p>{program.thesis}</p>
        <div className="hero-actions">
          <RouteLink to="/studio" navigate={navigate} className="primary-button">
            Open studio
          </RouteLink>
          <RouteLink to="/streamers" navigate={navigate} className="secondary-button">
            Creator program
          </RouteLink>
        </div>
      </div>

      <section className="split-grid">
        {program.splits.map(([label, split, detail]) => (
          <article key={label}>
            <Wallet size={22} />
            <span>{split}</span>
            <h2>{label}</h2>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      <section className="ladder-section">
        <SectionTitle eyebrow="Creator ladder" title="How a streamer gets monetized on TAPN." />
        <div>
          {program.levels.map(([level, requirement, unlock], index) => (
            <article key={level}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{level}</h2>
              <p>{requirement}</p>
              <strong>{unlock}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="incentive-panel">
        <SectionTitle eyebrow="Why creators move" title="Early reasons to choose TAPN over staying everywhere else." />
        <div>
          {program.incentives.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>
    </section>
  );
}

function SearchPage({ navigate, query, followed, toggleFollow, setSelectedChannelSlug, selectedChannel }) {
  const [term, setTerm] = useState(query);
  const normalized = term.trim().toLowerCase();
  const channelResults = channels.filter((channel) =>
    [channel.title, channel.creator, channel.category, channel.city, ...channel.tags].join(' ').toLowerCase().includes(normalized),
  );
  const categoryResults = categories.filter((category) =>
    [category.name, category.headline, category.description, ...category.tags].join(' ').toLowerCase().includes(normalized),
  );
  const resourceResults = Object.entries(publicPages).filter(([slug, page]) =>
    [slug, page.label, page.title, page.body].join(' ').toLowerCase().includes(normalized),
  );

  function submit(event) {
    event.preventDefault();
    navigate(term.trim() ? `/search?q=${encodeURIComponent(term.trim())}` : '/search');
  }

  return (
    <section className="page-stack">
      <div className="search-page-hero">
        <p className="eyebrow">Search</p>
        <h1>Find channels, categories, and platform pages.</h1>
        <form className="giant-search" onSubmit={submit}>
          <Search size={20} />
          <input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Try music, developers, terms" />
          <button type="submit">Search</button>
        </form>
      </div>

      <SectionTitle eyebrow="Channels" title={normalized ? `${channelResults.length} channel matches` : 'Featured channel matches'} />
      <ChannelGrid
        channels={(normalized ? channelResults : channels).slice(0, 6)}
        navigate={navigate}
        followed={followed}
        toggleFollow={toggleFollow}
        onFeature={setSelectedChannelSlug}
        selectedSlug={selectedChannel.slug}
      />

      <ResultRows
        title="Categories and resources"
        rows={[
          ...categoryResults.map((category) => [category.name, category.headline, `/category/${category.slug}`]),
          ...resourceResults.map(([slug, page]) => [page.label, page.title, `/${slug}`]),
        ]}
        navigate={navigate}
      />
    </section>
  );
}

function PublicPage({ navigate, page, slug }) {
  const iconBySlug = {
    about: Info,
    brand: Crown,
    news: Newspaper,
    download: Download,
    streamers: Radio,
    developers: Code2,
    bounties: Trophy,
    shop: ShoppingBag,
  };
  const Icon = iconBySlug[slug] ?? Sparkles;

  return (
    <section className="page-stack">
      <div className={`public-hero ${slug}`}>
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.body}</p>
          <RouteLink to={page.ctaTo} navigate={navigate} className="primary-button">
            {page.cta}
            <ChevronRight size={18} />
          </RouteLink>
        </div>
        <div className="signal-card">
          <Icon size={42} />
          <span>TAPN</span>
          <strong>{page.label}</strong>
        </div>
      </div>

      <MetricBand items={page.stats} />

      <div className="public-card-grid">
        {page.panels.map(([title, text]) => (
          <article key={title}>
            <Sparkles size={22} />
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>

      {(slug === 'streamers' || slug === 'developers') && (
        <FAQBlock title={slug === 'streamers' ? 'Streamer questions' : 'Developer questions'} />
      )}
    </section>
  );
}

function SupportPage({ navigate }) {
  const [filter, setFilter] = useState('');
  const visibleTopics = supportTopics.filter(([title, detail]) =>
    `${title} ${detail}`.toLowerCase().includes(filter.trim().toLowerCase()),
  );

  return (
    <section className="page-stack">
      <div className="support-hero">
        <p className="eyebrow">Help and support</p>
        <h1>Answers for viewers, streamers, builders, and partners.</h1>
        <label className="support-search">
          <Search size={19} />
          <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search support topics" />
        </label>
      </div>

      <div className="support-grid">
        {visibleTopics.map(([title, detail, count]) => (
          <article key={title}>
            <BookOpen size={23} />
            <h2>{title}</h2>
            <p>{detail}</p>
            <span>{count}</span>
          </article>
        ))}
      </div>

      <FAQBlock title="Popular questions" />

      <div className="support-cta">
        <div>
          <p className="eyebrow">Still stuck?</p>
          <h2>Open the creator desk or read the community guidelines.</h2>
        </div>
        <div className="hero-actions">
          <RouteLink to="/streamers" navigate={navigate} className="primary-button">
            Creator desk
          </RouteLink>
          <RouteLink to="/guidelines" navigate={navigate} className="secondary-button">
            Guidelines
          </RouteLink>
        </div>
      </div>
    </section>
  );
}

function LegalPage({ doc }) {
  return (
    <section className="legal-page">
      <div className="legal-hero">
        <p className="eyebrow">Legal</p>
        <h1>{doc.title}</h1>
        <p>
          Placeholder product copy for the TAPN prototype. This is not legal advice and should be reviewed by counsel
          before any production launch.
        </p>
      </div>

      <div className="legal-sections">
        {doc.sections.map(([title, text]) => (
          <article key={title}>
            <Gavel size={22} />
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChannelGrid({ channels: channelList, navigate, followed, toggleFollow, onFeature, selectedSlug }) {
  return (
    <section className="channel-grid" aria-label="TAPN channels">
      {channelList.map((channel) => {
        const category = categoryBySlug[channel.category];
        return (
          <article className={channel.slug === selectedSlug ? 'channel-card selected' : 'channel-card'} key={channel.slug}>
            <button
              className="channel-select"
              type="button"
              onClick={() => onFeature(channel.slug)}
              aria-label={`Feature ${channel.title}`}
            >
              <span className="thumb-wrap">
                <img src={channel.image} alt={`${channel.title} channel preview`} />
                <span
                  className="category-chip"
                  style={{ '--chip-color': category.accent, '--chip-text': category.accentText }}
                >
                  {category.short}
                </span>
              </span>
            </button>
            <div className="channel-body">
              <div>
                <h3>{channel.title}</h3>
                <p>{channel.creator}</p>
              </div>
              <button
                className={followed.includes(channel.slug) ? 'follow-button active' : 'follow-button'}
                type="button"
                aria-pressed={followed.includes(channel.slug)}
                onClick={() => toggleFollow(channel.slug)}
              >
                <Heart size={16} fill={followed.includes(channel.slug) ? 'currentColor' : 'none'} />
                {followed.includes(channel.slug) ? 'Following' : 'Follow'}
              </button>
            </div>
            <div className="channel-stats">
              <span>{channel.viewers} live</span>
              <span>{channel.paid} paid</span>
              <span>{channel.trust} trust</span>
            </div>
            <RouteLink to={`/channel/${channel.slug}`} navigate={navigate} className="card-link">
              Watch room
              <ChevronRight size={16} />
            </RouteLink>
          </article>
        );
      })}
    </section>
  );
}

function LiveRail({ navigate }) {
  return (
    <aside className="live-rail">
      <RouteLink to="/" navigate={navigate} className="rail-home" aria-label="Home">
        <Home size={18} />
      </RouteLink>
      <h2>Live Channels</h2>
      {channels.slice(0, 7).map((channel) => (
        <RouteLink key={channel.slug} to={`/channel/${channel.slug}`} navigate={navigate} className="live-rail-item">
          <span>{channel.creator.slice(0, 1)}</span>
          <div>
            <strong>{channel.creator}</strong>
            <small>{channel.viewers}</small>
          </div>
        </RouteLink>
      ))}
    </aside>
  );
}

function StudioPanel({ icon: Icon, title, text }) {
  return (
    <article className="studio-panel">
      <Icon size={28} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <article className="info-card">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="section-title">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

function MetricBand({ items }) {
  return (
    <div className="metric-band">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ResultRows({ title, rows, navigate }) {
  return (
    <section className="result-rows">
      <h2>{title}</h2>
      {rows.length ? (
        rows.map(([label, detail, to]) => (
          <RouteLink key={`${label}-${to}`} to={to} navigate={navigate}>
            <span>{label}</span>
            <strong>{detail}</strong>
            <ChevronRight size={17} />
          </RouteLink>
        ))
      ) : (
        <p>No matches yet. Try music, gaming, developers, terms, or support.</p>
      )}
    </section>
  );
}

function FAQBlock({ title }) {
  return (
    <section className="faq-block">
      <SectionTitle eyebrow="FAQ" title={title} />
      <div>
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <HelpCircle size={17} />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function LoginModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close login">
          x
        </button>
        <p className="eyebrow">Mock login</p>
        <h2 id="login-title">Tap into the room.</h2>
        <p>This prototype keeps login client-only. A production build would connect auth, creator wallets, and saved follows.</p>
        <label>
          Email or username
          <input placeholder="creator@tapn.example" />
        </label>
        <label>
          Password
          <input placeholder="Password" type="password" />
        </label>
        <button className="primary-button" type="button" onClick={onClose}>
          Continue
        </button>
      </section>
    </div>
  );
}

function NotFoundPage({ navigate }) {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>That TAPN room is not on the slate.</h1>
      <RouteLink to="/browse" navigate={navigate} className="primary-button">
        Browse live rooms
      </RouteLink>
    </section>
  );
}

export default App;
