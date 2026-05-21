import http from 'node:http';
import {
  categories,
  channels,
  communityPosts,
  creatorStudio,
  monetizationProgram,
  promotionPlaybook,
} from '../src/data.js';

const port = Number(process.env.PORT ?? 8787);
const channelBySlug = new Map(channels.map((channel) => [channel.slug, channel]));
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

const memory = {
  follows: new Set(['late-night-atl-cypher']),
  communityLikes: new Map(communityPosts.map((post) => [post.id, post.likes])),
  chat: new Map(channels.map((channel) => [channel.slug, [...channel.chatMessages]])),
  tips: [],
  subscriptions: new Map(channels.map((channel, index) => [channel.slug, 340 - index * 24])),
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Accept',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload, null, 2));
}

function notFound(response) {
  sendJson(response, 404, { error: 'Not found' });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Body too large'));
        request.destroy();
      }
    });
    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function enrichChannel(channel) {
  return {
    ...channel,
    isFollowing: memory.follows.has(channel.slug),
    subscribers: memory.subscriptions.get(channel.slug) ?? 0,
    chatMessages: memory.chat.get(channel.slug) ?? channel.chatMessages,
  };
}

function getDiscover(url) {
  const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
  const tab = url.searchParams.get('tab') ?? 'all';
  const filtered = channels.filter((channel) => {
    const matchesTab = tab === 'all' || channel.category === tab;
    const haystack = [channel.title, channel.creator, channel.city, channel.category, ...channel.tags]
      .join(' ')
      .toLowerCase();
    return matchesTab && (!query || haystack.includes(query));
  });

  return {
    tab,
    query,
    categories,
    channels: filtered.map(enrichChannel),
    communityPosts: communityPosts.map((post) => ({
      ...post,
      likes: memory.communityLikes.get(post.id) ?? post.likes,
    })),
  };
}

function getPromotionBrief() {
  return {
    ...promotionPlaybook,
    proofPoints: [
      'Community posts before and after streams create a reason to return even when the creator is offline.',
      'Creator Studio turns live rooms into a content library, not just a one-time broadcast.',
      'Monetization levels give new streamers a visible path from tips to memberships to brand inventory.',
    ],
  };
}

async function handlePost(request, response, url) {
  const body = await readBody(request);
  const parts = url.pathname.split('/').filter(Boolean);

  if (parts[0] === 'api' && parts[1] === 'channels' && parts[2]) {
    const slug = parts[2];
    const channel = channelBySlug.get(slug);
    if (!channel) {
      notFound(response);
      return;
    }

    if (parts[3] === 'follow') {
      if (memory.follows.has(slug)) {
        memory.follows.delete(slug);
      } else {
        memory.follows.add(slug);
      }
      sendJson(response, 200, { channel: enrichChannel(channel), following: memory.follows.has(slug) });
      return;
    }

    if (parts[3] === 'chat') {
      const message = String(body.message ?? '').trim().slice(0, 220);
      if (!message) {
        sendJson(response, 400, { error: 'message is required' });
        return;
      }
      const next = [...(memory.chat.get(slug) ?? channel.chatMessages), [body.user ?? 'Guest', message]];
      memory.chat.set(slug, next);
      sendJson(response, 201, { channel: enrichChannel(channel), message: next.at(-1) });
      return;
    }

    if (parts[3] === 'tip') {
      const amount = Number(body.amount ?? 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        sendJson(response, 400, { error: 'positive amount is required' });
        return;
      }
      const tip = {
        id: `tip_${Date.now()}`,
        channelSlug: slug,
        amount,
        creatorShare: Math.round(amount * 0.95 * 100) / 100,
        platformFee: Math.round(amount * 0.05 * 100) / 100,
        createdAt: new Date().toISOString(),
      };
      memory.tips.push(tip);
      sendJson(response, 201, { tip, channel: enrichChannel(channel) });
      return;
    }

    if (parts[3] === 'subscribe') {
      const current = memory.subscriptions.get(slug) ?? 0;
      memory.subscriptions.set(slug, current + 1);
      sendJson(response, 201, {
        channel: enrichChannel(channel),
        subscription: {
          price: 5,
          creatorShare: 4.5,
          platformFee: 0.5,
          note: 'TAPN target model for this prototype, not a live payment.',
        },
      });
      return;
    }
  }

  if (parts[0] === 'api' && parts[1] === 'community' && parts[2] && parts[3] === 'react') {
    const post = communityPosts.find((item) => item.id === parts[2]);
    if (!post) {
      notFound(response);
      return;
    }
    const nextLikes = (memory.communityLikes.get(post.id) ?? post.likes) + 1;
    memory.communityLikes.set(post.id, nextLikes);
    sendJson(response, 200, { post: { ...post, likes: nextLikes } });
    return;
  }

  notFound(response);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    sendJson(response, 200, { ok: true });
    return;
  }

  try {
    if (request.method === 'POST') {
      await handlePost(request, response, url);
      return;
    }

    if (request.method !== 'GET') {
      sendJson(response, 405, { error: 'Method not allowed' });
      return;
    }

    if (url.pathname === '/api/health') {
      sendJson(response, 200, {
        ok: true,
        service: 'tapn-mock-api',
        storage: 'memory',
        version: '0.2.0',
        time: new Date().toISOString(),
      });
      return;
    }

    if (url.pathname === '/api/discover') {
      sendJson(response, 200, getDiscover(url));
      return;
    }

    if (url.pathname === '/api/channels') {
      sendJson(response, 200, channels.map(enrichChannel));
      return;
    }

    if (url.pathname.startsWith('/api/channels/')) {
      const slug = url.pathname.split('/').at(-1);
      const channel = channelBySlug.get(slug);
      if (!channel) {
        notFound(response);
        return;
      }
      sendJson(response, 200, enrichChannel(channel));
      return;
    }

    if (url.pathname.startsWith('/api/categories/')) {
      const slug = url.pathname.split('/').at(-1);
      const category = categoryBySlug.get(slug);
      if (!category) {
        notFound(response);
        return;
      }
      sendJson(response, 200, {
        category,
        channels: channels.filter((channel) => channel.category === slug).map(enrichChannel),
      });
      return;
    }

    if (url.pathname === '/api/community') {
      sendJson(response, 200, {
        posts: communityPosts.map((post) => ({ ...post, likes: memory.communityLikes.get(post.id) ?? post.likes })),
      });
      return;
    }

    if (url.pathname === '/api/creator-studio') {
      sendJson(response, 200, creatorStudio);
      return;
    }

    if (url.pathname === '/api/monetization') {
      sendJson(response, 200, monetizationProgram);
      return;
    }

    if (url.pathname === '/api/promotion-plan') {
      sendJson(response, 200, getPromotionBrief());
      return;
    }

    notFound(response);
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`TAPN mock API running at http://localhost:${port}`);
});
