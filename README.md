# ThreadMint — Neural Reciprocity Network

An NFT-native social network where thoughts become collectible neurons.

## Features

- **Echoes**: Post short text/image/audio/video thoughts
- **Neuron NFTs**: Mint any Echo as an ERC-721 (1/1) or ERC-1155 (editions) on Base
- **Neural Absorption**: Collecting neurons absorbs their meaning into your 3D brain
- **3D Brain Visualization**: Interactive mind-map built with React Three Fiber
- **AI-Powered**: Automatic summaries, TTS, emotion detection, and embeddings
- **Edition Types**: 1/1, Limited, Open Edition, Allowlist

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS, Radix UI, Framer Motion
- **3D**: React Three Fiber, Three.js, Drei
- **Web3**: Wagmi, RainbowKit, Viem (Base L2)
- **Backend**: Supabase (Postgres, Storage, RLS, pgvector)
- **Smart Contracts**: Foundry, Solidity, OpenZeppelin
- **AI**: OpenAI (GPT-4o-mini, embeddings, TTS)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see `.env.example`)

3. Run Supabase migrations:
   - Enable pgvector extension in Supabase SQL editor
   - Run `migrations/001_initial_schema.sql`

4. Deploy contracts (Foundry):
```bash
cd contracts
forge build
forge script script/Deploy.sol --rpc-url base --broadcast
```

5. Run development server:
```bash
npm run dev
```

## Project Structure

```
/app              Next.js app router pages
/components       React components
  /ui            Base UI components
  /post          Post/feed components
  /market        Marketplace components
  /mind          3D brain components
  /layout        Layout components
/lib             Utilities and config
/contracts       Foundry smart contracts
/migrations      Database migrations
/public          Static assets
```

## Smart Contracts

- `Echo721.sol`: ERC-721 + ERC-2981 for 1/1 neurons
- `Echo1155.sol`: ERC-1155 for edition neurons
- `PaymentSplitter.sol`: Revenue splitting for collaborations

## API Routes

- `POST /api/posts` - Create echo
- `POST /api/mint` - Mark post as minted
- `POST /api/collect` - Record collection & trigger absorption
- `POST /api/react` - Create reaction (like/comment/quote)
- `GET /api/mind/graph` - Get 3D brain graph
- `GET /api/market` - Marketplace with filters
- `POST /api/ai/summary` - Generate AI summary + TTS

## Implementation Status

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for detailed checklist of completed features and remaining work.

**Current Status**: Core structure complete (✅ 70%), needs integration and configuration (🚧 30%)

### Quick Status
- ✅ Project setup & configuration
- ✅ UI components & pages
- ✅ Database schema
- ✅ Smart contracts
- ✅ API routes structure
- 🚧 Environment variables & deployment
- 🚧 Authentication integration
- 🚧 Web3 wallet integration
- 🚧 AI service integration
- 🚧 3D brain data generation

## License

MIT

