import React, { useMemo, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  BadgeDollarSign,
  Ban,
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clapperboard,
  Crown,
  Eye,
  Flame,
  Gamepad2,
  HandCoins,
  Heart,
  LockKeyhole,
  MessageCircle,
  Mic2,
  MonitorPlay,
  Music2,
  Play,
  Radio,
  ReceiptText,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Ticket,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  Video,
  Wallet,
  Zap,
} from 'lucide-react';

const categories = ['All', 'Music', 'Gaming', 'IRL', 'Shows', 'Video'];

const channels = [
  {
    id: 'atl-cypher',
    title: 'Late Night ATL Cypher',
    creator: 'Ari Lennox Ave',
    category: 'Music',
    format: 'Live stage',
    city: 'Atlanta',
    image: '/assets/live-stage.jpg',
    viewers: '48.2K',
    revenue: '$18.4K',
    trust: 97,
    replay: 'Creator-owned replay',
    sponsor: '2 premium bids',
    chat: 'Warm',
    accent: '#E5B95C',
    accentText: '#050617',
  },
  {
    id: 'side-quest',
    title: 'Side Quest Sundays',
    creator: 'NoCapNova',
    category: 'Gaming',
    format: 'Creator tournament',
    city: 'Brooklyn',
    image: '/assets/gaming-desk.jpg',
    viewers: '21.8K',
    revenue: '$7.9K',
    trust: 94,
    replay: 'Member replay',
    sponsor: 'Controller drop',
    chat: 'Active',
    accent: '#2447FF',
    accentText: '#F8EEDC',
  },
  {
    id: 'green-room',
    title: 'The Green Room',
    creator: 'Zora Speaks',
    category: 'Shows',
    format: 'Talk format',
    city: 'Harlem',
    image: '/assets/podcast-studio.jpg',
    viewers: '16.5K',
    revenue: '$5.3K',
    trust: 99,
    replay: 'Editorial cut',
    sponsor: '1 studio partner',
    chat: 'Protected',
    accent: '#C1122F',
    accentText: '#F8EEDC',
  },
  {
    id: 'lens-check',
    title: 'Lens Check Live',
    creator: 'KillaFrame',
    category: 'Video',
    format: 'Video drop',
    city: 'Los Angeles',
    image: '/assets/creator-camera.jpg',
    viewers: '12.1K',
    revenue: '$3.8K',
    trust: 96,
    replay: 'Drop window',
    sponsor: 'Camera shop',
    chat: 'Clean',
    accent: '#6D2AD8',
    accentText: '#F8EEDC',
  },
  {
    id: 'block-party',
    title: 'Block Party Replay',
    creator: 'Nia North',
    category: 'IRL',
    format: 'IRL event',
    city: 'New Orleans',
    image: '/assets/concert-crowd.jpg',
    viewers: '39.7K',
    revenue: '$11.6K',
    trust: 95,
    replay: 'Event pass',
    sponsor: 'Local brand stack',
    chat: 'High energy',
    accent: '#8B1E7A',
    accentText: '#F8EEDC',
  },
];

const marketStats = [
  { value: '72%', label: 'creator rev share' },
  { value: '24/7', label: 'safety desk' },
  { value: '4.8M', label: 'launch waitlist target' },
];

const walletLines = [
  { label: 'Subscriptions', amount: '$8,920', color: '#2447FF', value: 8920 },
  { label: 'Tips', amount: '$4,416', color: '#E5B95C', value: 4416 },
  { label: 'Drops', amount: '$2,808', color: '#C1122F', value: 2808 },
  { label: 'Ads', amount: '$1,612', color: '#6D2AD8', value: 1612 },
];

const revenueProducts = [
  { icon: Ticket, title: 'Channel Passes', detail: 'Paid rooms, event tickets, replay windows, and subscriber-only premieres.' },
  { icon: HandCoins, title: 'Instant Payouts', detail: 'Tips, drops, ad splits, and sponsorship money sit in one transparent wallet.' },
  { icon: ReceiptText, title: 'Rights Ledger', detail: 'Creators see replay rights, split status, receipts, and deal history.' },
  { icon: CircleDollarSign, title: 'Brand Market', detail: 'Sponsors buy culture safely through trust scores and verified inventory.' },
];

const reviewItems = [
  { icon: ShieldCheck, label: 'Evidence review', value: '12 min avg' },
  { icon: Scale, label: 'Appeal window', value: '7 days' },
  { icon: Ban, label: 'Permanent removals', value: 'senior sign-off' },
  { icon: LockKeyhole, label: 'Creator protection', value: 'doxxing lock' },
];

const safetyWorkflow = [
  { step: 'Detect', detail: 'Signals from chat velocity, reports, clips, and creator tools.' },
  { step: 'Review', detail: 'Human escalation for extreme actions, with context and evidence.' },
  { step: 'Act', detail: 'Warnings, room limits, suspensions, demonetization, or removal.' },
  { step: 'Appeal', detail: 'Clear decisions, receipt history, and an appeal path for creators.' },
];

const slate = [
  { time: '8 PM', title: 'Tapn Originals', detail: 'Live interview series with artists, athletes, hosts, and founders.' },
  { time: '10 PM', title: 'The Afterset', detail: 'Music drops, DJ rooms, cyphers, and city-led performance blocks.' },
  { time: 'Sunday', title: 'Creator Cup', detail: 'Gaming bracket with tips, channel passes, and sponsor quests.' },
  { time: 'Monthly', title: 'Black Screen Awards', detail: 'Community-voted awards for clips, shows, channels, and moments.' },
];

const roadmap = [
  { phase: '01', title: 'Closed Creator Beta', detail: 'Invite 200 creators across music, gaming, shows, IRL, and video.' },
  { phase: '02', title: 'Wallet + Safety Desk', detail: 'Launch monetization rails with incident review and appeal tooling.' },
  { phase: '03', title: 'Original Programming', detail: 'Package premium live events and sponsor-safe culture inventory.' },
  { phase: '04', title: 'Mobile + TV Expansion', detail: 'Ship watch-first mobile, casting, and living-room app foundations.' },
];

const navLinks = [
  { href: '#live', label: 'Live' },
  { href: '#studio', label: 'Studio' },
  { href: '#monetize', label: 'Monetize' },
  { href: '#safety', label: 'Safety' },
  { href: '#slate', label: 'Slate' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedChannelId, setSelectedChannelId] = useState(channels[0].id);
  const [walletTotal, setWalletTotal] = useState(28418);
  const [followingId, setFollowingId] = useState(channels[0].id);
  const [reviewOpen, setReviewOpen] = useState(false);

  const visibleChannels = useMemo(() => {
    if (activeCategory === 'All') return channels;
    return channels.filter((channel) => channel.category === activeCategory);
  }, [activeCategory]);

  const selectedChannel = useMemo(
    () => channels.find((channel) => channel.id === selectedChannelId) ?? channels[0],
    [selectedChannelId],
  );

  const walletDisplay = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(walletTotal);

  function handleCategory(category) {
    setActiveCategory(category);
    const nextChannel = category === 'All' ? channels[0] : channels.find((channel) => channel.category === category);
    if (nextChannel) setSelectedChannelId(nextChannel.id);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Tapn home">
          <span className="brand-mark">
            <Play size={17} fill="currentColor" strokeWidth={2.5} />
          </span>
          <span>Tapn</span>
        </a>

        <nav className="topnav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <label className="search-box" aria-label="Search Tapn">
            <Search size={16} />
            <input placeholder="Search channels" />
          </label>
          <button className="icon-button" type="button" title="Notifications">
            <Bell size={18} />
          </button>
          <button className="icon-button user" type="button" title="Creator profile">
            <UserRound size={18} />
          </button>
        </div>
      </header>

      <section className="hero-grid" id="top">
        <aside className="side-rail" aria-label="Tapn live sections">
          <div className="rail-label">Now</div>
          <a href="#live" className="rail-item active">
            <Radio size={18} />
            Live Desk
          </a>
          <a href="#culture" className="rail-item">
            <Flame size={18} />
            Heat Index
          </a>
          <a href="#monetize" className="rail-item">
            <Wallet size={18} />
            Wallet
          </a>
          <a href="#safety" className="rail-item">
            <ShieldCheck size={18} />
            Review
          </a>
        </aside>

        <section className="hero-copy" aria-labelledby="hero-title">
          <p className="eyebrow">Black entertainment television, video, and streaming</p>
          <h1 id="hero-title">Tapn</h1>
          <p className="lead">
            A premium live culture network where creators can stream, build owned audiences,
            monetize in public, and stay protected by a serious review system.
          </p>

          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => setWalletTotal((total) => total + 250)}>
              <Radio size={18} />
              Start Channel
            </button>
            <button className="secondary-button" type="button" onClick={() => setReviewOpen((open) => !open)}>
              <ShieldCheck size={18} />
              Safety Desk
            </button>
          </div>

          <div className="stat-strip" aria-label="Tapn launch metrics">
            {marketStats.map((stat) => (
              <div className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="stage-panel" id="live" aria-label="Featured live stream">
          <img src={selectedChannel.image} alt={`${selectedChannel.title} preview`} />
          <div className="stage-overlay">
            <div className="stage-topline">
              <div className="live-badge">
                <span />
                Live
              </div>
              <div className="trust-pill">
                <BadgeCheck size={16} />
                {selectedChannel.trust} trust
              </div>
            </div>

            <div className="stage-meta">
              <p>{selectedChannel.format}</p>
              <h2>{selectedChannel.title}</h2>
              <div className="stage-row">
                <span>{selectedChannel.viewers} watching</span>
                <span>{selectedChannel.revenue} earned tonight</span>
                <span>{selectedChannel.city}</span>
              </div>
            </div>

            <div className="stage-footer">
              <div className="stage-signal">
                <span>{selectedChannel.replay}</span>
                <span>{selectedChannel.sponsor}</span>
                <span>{selectedChannel.chat} chat</span>
              </div>
              <button className="watch-button" type="button">
                Watch
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

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

      <section className="control-band" id="culture" aria-label="Tapn content categories">
        <div className="section-title">
          <p>Culture lanes</p>
          <h2>Live rooms with standards, ownership, and real money attached.</h2>
        </div>
        <div className="segmented-control" role="tablist" aria-label="Filter channels">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              role="tab"
              aria-selected={activeCategory === category}
              className={activeCategory === category ? 'selected' : ''}
              onClick={() => handleCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="channel-grid" aria-label="Featured Tapn channels">
        {visibleChannels.map((channel) => (
          <article
            className={channel.id === selectedChannel.id ? 'channel-card selected' : 'channel-card'}
            key={channel.id}
          >
            <button
              className="channel-select"
              type="button"
              onClick={() => setSelectedChannelId(channel.id)}
              aria-label={`Feature ${channel.title}`}
            >
              <span className="thumb-wrap">
                <img src={channel.image} alt={`${channel.title} channel preview`} />
                <span
                  className="category-chip"
                  style={{ '--chip-color': channel.accent, '--chip-text': channel.accentText }}
                >
                  {channel.category}
                </span>
              </span>
            </button>
            <div className="channel-body">
              <div>
                <h3>{channel.title}</h3>
                <p>{channel.creator}</p>
              </div>
              <button
                className={followingId === channel.id ? 'follow-button active' : 'follow-button'}
                type="button"
                aria-pressed={followingId === channel.id}
                onClick={() => setFollowingId((current) => (current === channel.id ? '' : channel.id))}
              >
                <Heart size={16} fill={followingId === channel.id ? 'currentColor' : 'none'} />
                {followingId === channel.id ? 'Following' : 'Follow'}
              </button>
            </div>
            <div className="channel-stats">
              <span>{channel.viewers} live</span>
              <span>{channel.revenue} paid</span>
              <span>{channel.trust} trust</span>
            </div>
          </article>
        ))}
      </section>

      <section className="studio-band" id="studio">
        <div className="studio-copy">
          <p>Creator command center</p>
          <h2>Tapn should feel like a network, a studio, and a bank account in one place.</h2>
        </div>
        <div className="studio-grid" aria-label="Creator operating console">
          <article className="studio-panel live-control">
            <div className="panel-heading">
              <div>
                <p>Stream setup</p>
                <h3>Go live with rights, payout, and room safety already configured.</h3>
              </div>
              <SlidersHorizontal size={28} />
            </div>
            <div className="setup-list">
              <span>
                <Music2 size={16} />
                Music
              </span>
              <span>
                <Gamepad2 size={16} />
                Gaming
              </span>
              <span>
                <Mic2 size={16} />
                Talk
              </span>
              <span>
                <Camera size={16} />
                IRL
              </span>
              <span>
                <Video size={16} />
                Drops
              </span>
            </div>
          </article>

          <article className="studio-panel heat-panel">
            <div className="mini-kpi">
              <Eye size={18} />
              <strong>138.3K</strong>
              <span>live viewers across featured rooms</span>
            </div>
            <div className="mini-kpi">
              <Activity size={18} />
              <strong>92%</strong>
              <span>positive chat signal this hour</span>
            </div>
            <div className="mini-kpi">
              <Trophy size={18} />
              <strong>31</strong>
              <span>creator milestones hit today</span>
            </div>
          </article>

          <article className="studio-panel sponsor-panel">
            <p>Brand inventory</p>
            <h3>Culture can stay raw and premium when trust is measurable.</h3>
            <div className="sponsor-meter">
              <span style={{ width: '76%' }} />
            </div>
            <div className="sponsor-row">
              <span>Eligible rooms</span>
              <strong>76%</strong>
            </div>
          </article>
        </div>
      </section>

      <section className="product-system" aria-label="Tapn monetization products">
        <div className="section-title">
          <p>Creator economy</p>
          <h2>Monetization built into the entertainment surface.</h2>
        </div>
        <div className="product-grid">
          {revenueProducts.map((product) => {
            const Icon = product.icon;
            return (
              <article key={product.title}>
                <Icon size={25} />
                <h3>{product.title}</h3>
                <p>{product.detail}</p>
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
            {reviewItems.map((item) => {
              const Icon = item.icon;
              return (
                <div className="review-item" key={item.label}>
                  <Icon size={20} />
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              );
            })}
          </div>
          {reviewOpen && (
            <div className="review-open" role="status">
              <CheckCircle2 size={20} />
              Escalation queue open: 18 cases, 4 appeals, 0 instant lifetime bans.
            </div>
          )}
        </div>

        <div className="safety-workflow" aria-label="Tapn safety workflow">
          {safetyWorkflow.map((item, index) => (
            <article key={item.step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.step}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="slate-section" id="slate">
        <div className="section-title">
          <p>Programming slate</p>
          <h2>A premium Black entertainment schedule that can compete with platforms and networks.</h2>
        </div>
        <div className="slate-grid">
          {slate.map((item) => (
            <article key={item.title}>
              <span>{item.time}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-system" aria-label="Tapn brand pillars">
        <article>
          <Crown size={24} />
          <h3>Premium Culture Network</h3>
          <p>Original shows, live events, cyphers, interviews, gaming tournaments, and creator-led premieres.</p>
        </article>
        <article>
          <Sparkles size={24} />
          <h3>Creator Ownership</h3>
          <p>Wallet-first streaming with drops, channel passes, fan tips, replay rights, and transparent splits.</p>
        </article>
        <article>
          <MessageCircle size={24} />
          <h3>Chat With Guardrails</h3>
          <p>Rooms stay expressive while threats, exploitation, harassment, and repeat abuse move into review.</p>
        </article>
        <article>
          <TrendingUp size={24} />
          <h3>Brand-Safe Heat</h3>
          <p>Culture can be raw and marketable when trust, receipts, and moderation are part of the product.</p>
        </article>
      </section>

      <section className="roadmap-section">
        <div className="section-title">
          <p>Launch path</p>
          <h2>From closed beta to culture-scale streaming network.</h2>
        </div>
        <div className="roadmap">
          {roadmap.map((item) => (
            <article key={item.phase}>
              <span>{item.phase}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="launch-console" aria-label="Tapn creator console">
        <div className="console-copy">
          <p>Tap in</p>
          <h2>Go live across music, IRL, gaming, shows, and video drops.</h2>
        </div>
        <div className="console-actions">
          <button type="button">
            <Mic2 size={18} />
            Studio
          </button>
          <button type="button">
            <Gamepad2 size={18} />
            Gaming
          </button>
          <button type="button">
            <Clapperboard size={18} />
            Originals
          </button>
          <button type="button">
            <MonitorPlay size={18} />
            Upload
          </button>
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#top" aria-label="Tapn home">
          <span className="brand-mark">
            <Play size={17} fill="currentColor" strokeWidth={2.5} />
          </span>
          <span>Tapn</span>
        </a>
        <p>Black entertainment, live and paid.</p>
        <div>
          <span>BET energy</span>
          <span>WorldStar velocity</span>
          <span>Twitch utility</span>
          <span>Kick monetization</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
