# Tapn

Tapn is a premium Black entertainment streaming platform for live video, music,
gaming, IRL culture, creator monetization, and safer community review.

**Working line:** Black entertainment, live and paid.

## Product Thesis

Tapn is built to sit between culture media and live creator platforms: more
polished than WorldStar, more culturally specific than Twitch, better governed
than Kick, and more creator-first than a traditional entertainment network.

The platform should feel like:

- **BET energy** with modern livestream infrastructure
- **WorldStar velocity** without chaos as the default business model
- **Twitch utility** with a stronger cultural point of view
- **Kick monetization** with better review, records, and brand safety
- **YouTube-scale ambition** with owned creator economics

Tapn gives creators room to be themselves while making monetization,
moderation, safety, replay rights, and sponsor access part of the core product.

## MVP Surface

- Live discovery across music, gaming, IRL, podcasts, shows, and video drops
- Creator wallet for subscriptions, tips, drops, ads, sponsorships, and replays
- Channel pages with trust score, replay rights, sponsor inventory, and chat state
- Human safety desk for evidence review, appeals, escalations, and extreme actions
- Programming slate for Tapn Originals, cyphers, creator tournaments, and awards
- Brand market where sponsors can buy into verified, culture-led rooms

## Safety Stance

Tapn should not tolerate harassment, exploitation, doxxing, direct threats, or
repeat abuse. It should also avoid lazy, instant, context-free punishment for
high-impact decisions. Serious restrictions should move through:

1. Detection from reports, chat signals, clips, creator tools, and system flags
2. Human review with evidence and context
3. Graduated action such as warning, room limits, suspension, demonetization, or ban
4. Appeal path with receipts and decision history

## Palette Research

The royal direction is anchored in three ideas:

- **Imperial purple:** status, rarity, ceremony, and cultural authority
- **Deep royal blue:** trust, institutional weight, broadcast polish, and stability
- **Crown crimson:** urgency, power, live energy, and editorial heat

Tapn should not look like a generic purple-blue tech product. The palette uses a
near-black navy foundation, then lets blue, red, and purple operate as distinct
signals. Gold is kept as a restrained premium accent for money, milestones, and
programming tags.

| Role | Hex | Use |
| --- | --- | --- |
| Obsidian Navy | `#050617` | App background and high-contrast foundation |
| Royal Night | `#090D2A` | Hero surfaces and elevated dark panels |
| Palace Blue | `#2447FF` | Primary actions, selected states, trust signals |
| Imperial Purple | `#6D2AD8` | Premium status, verified trust, brand depth |
| Crown Crimson | `#C1122F` | Live urgency, drops, alerts, and heat |
| Crown Gold | `#E5B95C` | Wallet, prestige, milestones, and editorial labels |
| Royal Parchment | `#F8EEDC` | Primary text on dark and jewel-tone surfaces |

Accessibility guardrails:

- Body text is parchment on navy/purple panels for strong contrast.
- Blue, red, and purple badges use light text instead of dark text.
- Gold uses dark text only when it becomes a filled surface.
- Color is paired with icons, labels, chips, and state text instead of carrying
  meaning by itself.

Research inputs:

- Smithsonian Color Journey on purple's historic association with royalty, faith,
  prosperity, and expensive natural dyes
- North Carolina Museum of Art learning material on red as power, danger,
  leadership, and authority
- ColorArchive's trust-color guide on navy/dark blue as an institutional trust
  signal
- W3C WCAG guidance for contrast and not relying on color alone

## Brand Direction

- **Logo:** hard lowercase wordmark, compact play-button mark, broadcast signal
- **Tone:** protected, profitable, live, editorial, premium, culturally fluent
- **Visuals:** obsidian navy foundation, royal blue, imperial purple, crown crimson, parchment text, restrained gold
- **Slogans:** `Tap in. Go live. Get paid.`, `Culture on live.`, `Built for the stream and the stage.`
- **Audience:** Black creators, fans, hosts, gamers, artists, podcasters, producers, venues, labels, and brands

## Current Prototype

The current React prototype includes:

- Hero command center with featured stream state
- Category-filtered live channel grid
- Creator wallet simulation
- YouTube-style community feed with polls, posts, clips, and house rooms
- Creator Studio surface with mock metrics, publishing queue, and API status
- Monetization ladder for tips, memberships, replay windows, and brand market
- Studio setup and heat-index panels
- Monetization product suite
- Safety desk and review workflow
- Programming slate and launch roadmap
- Local mock backend API for discovery, community reactions, chat, follows, tips,
  subscriptions, creator studio, monetization, and promotion guidance

## Development

```bash
npm install
npm run dev
```

Run the mock API in a second terminal:

```bash
npm run api
```

Or run the API and Vite together:

```bash
npm run dev:full
```

Build the production bundle:

```bash
npm run build
```

Mock API routes:

```text
GET  /api/health
GET  /api/discover
GET  /api/community
GET  /api/creator-studio
GET  /api/monetization
GET  /api/promotion-plan
POST /api/community/:id/react
POST /api/channels/:slug/follow
POST /api/channels/:slug/chat
POST /api/channels/:slug/tip
POST /api/channels/:slug/subscribe
```

## Project Structure

```text
src/App.jsx        Product routes, UI, and API-backed interactions
src/apiClient.js   Browser API helper
src/data.js        Shared dummy product/content data
src/styles.css     Tapn visual system and responsive layout
server/index.js    Local Node mock API
server/dev.js      Runs API and Vite together
public/assets/     Prototype imagery
vite.config.js     Vite React configuration and API proxy
```

## Image Credits

Prototype imagery is stored locally in `public/assets` and sourced from Unsplash
under the Unsplash License:

- Ben Iwara, live DJ crowd in Lagos
- Zane Bolen, podcast studio
- Vanilla Bear Films, video camera production
- Matus Gocman, gaming desk setup
- Neza Dolmo, concert crowd
