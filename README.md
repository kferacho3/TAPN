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

## Brand Direction

- **Logo:** hard lowercase wordmark, compact play-button mark, broadcast signal
- **Tone:** protected, profitable, live, editorial, premium, culturally fluent
- **Visuals:** black foundation, cream typography, sharp lime/red/blue/gold signals
- **Slogans:** `Tap in. Go live. Get paid.`, `Culture on live.`, `Built for the stream and the stage.`
- **Audience:** Black creators, fans, hosts, gamers, artists, podcasters, producers, venues, labels, and brands

## Current Prototype

The current React prototype includes:

- Hero command center with featured stream state
- Category-filtered live channel grid
- Creator wallet simulation
- Studio setup and heat-index panels
- Monetization product suite
- Safety desk and review workflow
- Programming slate and launch roadmap

## Development

```bash
npm install
npm run dev
```

Build the production bundle:

```bash
npm run build
```

## Project Structure

```text
src/App.jsx        Product interface and state
src/styles.css     Tapn visual system and responsive layout
public/assets/     Prototype imagery
vite.config.js     Vite React configuration
```

## Image Credits

Prototype imagery is stored locally in `public/assets` and sourced from Unsplash
under the Unsplash License:

- Ben Iwara, live DJ crowd in Lagos
- Zane Bolen, podcast studio
- Vanilla Bear Films, video camera production
- Matus Gocman, gaming desk setup
- Neza Dolmo, concert crowd
