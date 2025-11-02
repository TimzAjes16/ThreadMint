// Helper to calculate total supply from editions
const calculateTotalSupply = (posts: any[]) => {
  return posts.reduce((total, post) => {
    if (post.edition_type === '1of1') return total + 1;
    if (post.edition_type === 'open') return total + (post.editions || 1000);
    if (post.edition_type === 'limited') return total + (post.editions || 1);
    return total + 1;
  }, 0);
};

// Seeded random for consistent engagement metrics
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Helper to generate engagement metrics with seeded random for consistency
const generateEngagement = (id: number) => {
  const random = seededRandom(id * 1000);
  return {
    comments_count: Math.floor(random() * 100) + 10,
    retweets_count: Math.floor(random() * 50) + 5,
    likes_count: Math.floor(random() * 500) + 50,
    views_count: Math.floor(random() * 2000) + 500,
  };
};

export const dummyPosts = [
  {
    id: '1',
    body: 'The best ideas come when you least expect them. Sometimes silence speaks louder than words.',
    kind: 'text',
    media_url: null,
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '1',
    price_wei: '1000000000000000000', // 1 ETH
    edition_type: '1of1',
    editions: null,
    sold: 0,
    sold_out: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'philosopher_crypto',
      display_name: 'Crypto Philosopher',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=philosopher',
      verified: true,
    },
    ...generateEngagement(1),
    post_features: {
      emotion: { tone: 'curiosity', valence: 0.7, arousal: 0.5 },
      influence_score: 8.5,
    },
  },
  {
    id: '2',
    body: 'Building on Base feels like flying. The future is decentralized, and we\'re just getting started.',
    kind: 'text',
    media_url: null,
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '2',
    price_wei: '250000000000000000', // 0.25 ETH
    edition_type: 'limited',
    editions: 50,
    sold: 12,
    sold_out: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'base_builder',
      display_name: 'Base Builder',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=base',
      verified: true,
    },
    ...generateEngagement(2),
    post_features: {
      emotion: { tone: 'joy', valence: 0.9, arousal: 0.8 },
      influence_score: 9.2,
    },
  },
  {
    id: '3',
    body: 'Art isn\'t what you see, it\'s what you make others see. Each neuron we collect expands our perspective.',
    kind: 'text',
    media_url: 'https://picsum.photos/800/600?random=3',
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '3',
    price_wei: '500000000000000000', // 0.5 ETH
    edition_type: '1of1',
    editions: null,
    sold: 0,
    sold_out: false,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'neural_artist',
      display_name: 'Neural Artist',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist',
      verified: false,
    },
    ...generateEngagement(3),
    post_features: {
      emotion: { tone: 'awe', valence: 0.8, arousal: 0.6 },
      influence_score: 7.8,
    },
  },
  {
    id: '4',
    body: 'Sometimes the most profound thoughts come in 280 characters or less. Less is more.',
    kind: 'text',
    media_url: null,
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '4',
    price_wei: '100000000000000000', // 0.1 ETH
    edition_type: 'open',
    editions: 1000,
    sold: 345,
    sold_out: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'minimalist_thinker',
      display_name: 'Minimalist Thinker',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minimal',
      verified: false,
    },
    ...generateEngagement(4),
    post_features: {
      emotion: { tone: 'calm', valence: 0.6, arousal: 0.3 },
      influence_score: 6.5,
    },
  },
  {
    id: '5',
    body: 'In the age of AI, human creativity becomes even more valuable. We are the neural network.',
    kind: 'text',
    media_url: 'https://picsum.photos/800/600?random=5',
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '5',
    price_wei: '750000000000000000', // 0.75 ETH
    edition_type: 'limited',
    editions: 10,
    sold: 3,
    sold_out: false,
    created_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'ai_philosopher',
      display_name: 'AI Philosopher',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai',
      verified: true,
    },
    ...generateEngagement(5),
    post_features: {
      emotion: { tone: 'curiosity', valence: 0.75, arousal: 0.7 },
      influence_score: 9.0,
    },
  },
  {
    id: '6',
    body: 'The blockchain is a canvas, and every transaction is a brushstroke. We\'re painting the future.',
    kind: 'text',
    media_url: null,
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '6',
    price_wei: '2000000000000000000', // 2 ETH
    edition_type: '1of1',
    editions: null,
    sold: 0,
    sold_out: false,
    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'web3_poet',
      display_name: 'Web3 Poet',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=poet',
      verified: true,
    },
    ...generateEngagement(6),
    post_features: {
      emotion: { tone: 'awe', valence: 0.85, arousal: 0.65 },
      influence_score: 8.8,
    },
  },
  {
    id: '7',
    body: 'Code is poetry. Smart contracts are symphonies. We are the composers of the decentralized web.',
    kind: 'text',
    media_url: 'https://picsum.photos/800/600?random=7',
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '7',
    price_wei: '150000000000000000', // 0.15 ETH
    edition_type: 'limited',
    editions: 25,
    sold: 18,
    sold_out: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'solidity_symphony',
      display_name: 'Solidity Symphony',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=solidity',
      verified: false,
    },
    ...generateEngagement(7),
    post_features: {
      emotion: { tone: 'joy', valence: 0.8, arousal: 0.75 },
      influence_score: 7.5,
    },
  },
  {
    id: '8',
    body: 'Thoughts are free, but when minted, they become eternal. Welcome to the age of immutable ideas.',
    kind: 'text',
    media_url: null,
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '8',
    price_wei: '300000000000000000', // 0.3 ETH
    edition_type: 'open',
    editions: 500,
    sold: 89,
    sold_out: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'eternal_thoughts',
      display_name: 'Eternal Thoughts',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eternal',
      verified: true,
    },
    ...generateEngagement(8),
    post_features: {
      emotion: { tone: 'awe', valence: 0.9, arousal: 0.6 },
      influence_score: 8.2,
    },
  },
  {
    id: '9',
    body: 'Every NFT tells a story. Every story becomes a neuron. Every neuron connects us. We are ThreadMint.',
    kind: 'text',
    media_url: 'https://picsum.photos/800/600?random=9',
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '9',
    price_wei: '5000000000000000000', // 5 ETH
    edition_type: '1of1',
    editions: null,
    sold: 0,
    sold_out: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'threadmint_creator',
      display_name: 'ThreadMint Creator',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator',
      verified: true,
    },
    ...generateEngagement(9),
    post_features: {
      emotion: { tone: 'curiosity', valence: 0.85, arousal: 0.8 },
      influence_score: 9.5,
    },
  },
  {
    id: '10',
    body: 'The most powerful technology is the one that empowers creators. ThreadMint is that technology.',
    kind: 'text',
    media_url: null,
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '10',
    price_wei: '800000000000000000', // 0.8 ETH
    edition_type: 'limited',
    editions: 100,
    sold: 45,
    sold_out: false,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'creator_power',
      display_name: 'Creator Power',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=power',
      verified: true,
    },
    ...generateEngagement(10),
    post_features: {
      emotion: { tone: 'joy', valence: 0.85, arousal: 0.85 },
      influence_score: 8.9,
    },
  },
  {
    id: '11',
    body: 'In the silence between thoughts, the universe whispers its secrets. Listen.',
    kind: 'text',
    media_url: 'https://picsum.photos/800/600?random=11',
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '11',
    price_wei: '1200000000000000000', // 1.2 ETH
    edition_type: '1of1',
    editions: null,
    sold: 0,
    sold_out: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'cosmic_whispers',
      display_name: 'Cosmic Whispers',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic',
      verified: false,
    },
    ...generateEngagement(11),
    post_features: {
      emotion: { tone: 'calm', valence: 0.7, arousal: 0.4 },
      influence_score: 7.2,
    },
  },
  {
    id: '12',
    body: 'What if your thoughts could live forever on the blockchain? They can. Welcome to the neural network.',
    kind: 'text',
    media_url: null,
    minted: true,
    chain_id: 8453,
    contract: '0x1234...5678',
    token_id: '12',
    price_wei: '400000000000000000', // 0.4 ETH
    edition_type: 'open',
    editions: 200,
    sold: 156,
    sold_out: false,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    users: {
      handle: 'neural_network',
      display_name: 'Neural Network',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neural',
      verified: true,
    },
    ...generateEngagement(12),
    post_features: {
      emotion: { tone: 'curiosity', valence: 0.8, arousal: 0.7 },
      influence_score: 8.0,
    },
  },
];

// Export calculated stats
export const dummyStats = {
  totalSupply: calculateTotalSupply(dummyPosts),
  listed: dummyPosts.filter(p => p.price_wei).length,
  owners: new Set(dummyPosts.map(p => p.users.handle)).size,
  floorPrice: Math.min(...dummyPosts.filter(p => p.price_wei).map(p => Number(p.price_wei) / 1e18)),
  totalVolume: dummyPosts.filter(p => p.price_wei).reduce((sum, p) => sum + Number(p.price_wei) / 1e18, 0),
};
