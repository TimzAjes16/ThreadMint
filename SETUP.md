# ThreadMint Setup Guide

## Prerequisites

1. Node.js 18+ and npm
2. Supabase account and project
3. OpenAI API key
4. WalletConnect Project ID
5. Foundry (for contracts) - Install: `curl -L https://foundry.paradigm.xyz | bash`

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_WC_PROJECT_ID`: WalletConnect project ID
- `NEXT_PUBLIC_RPC_URL`: Base RPC endpoint (or use public one)
- `CRON_SECRET`: Random secret for cron authentication

### 3. Database Setup

1. In Supabase SQL Editor, enable pgvector:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

2. Run the migration:
   - Copy contents of `migrations/001_initial_schema.sql`
   - Paste into Supabase SQL Editor
   - Execute

### 4. Smart Contracts

```bash
cd contracts

# Install OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Build contracts
forge build

# Test (optional)
forge test

# Deploy (update script first)
forge script script/Deploy.sol --rpc-url base_sepolia --broadcast --verify
```

### 5. Storage Setup

For IPFS uploads:
- Option A: Web3.Storage - Get token from https://web3.storage
- Option B: Pinata - Get JWT from https://pinata.cloud

Add to `.env`:
```
WEB3_STORAGE_TOKEN=your_token
# OR
PINATA_JWT=your_jwt
```

### 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Deployment

### Vercel

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

Cron jobs will run automatically based on `vercel.json`.

### Smart Contracts

Deploy to Base:
```bash
forge script script/Deploy.sol --rpc-url base --broadcast --verify --etherscan-api-key $BASESCAN_API_KEY
```

Update contract addresses in your database/config after deployment.

## Testing Checklist

- [ ] Create an Echo (post)
- [ ] Mint as 1/1 neuron
- [ ] Mint as edition (ERC-1155)
- [ ] Collect a neuron
- [ ] View 3D brain
- [ ] Marketplace filters work
- [ ] Reactions work
- [ ] Leaderboard displays data

## Troubleshooting

**pgvector errors**: Ensure extension is enabled in Supabase

**Web3 connection issues**: Check WalletConnect project ID and RPC URL

**Contract deployment fails**: Verify Base RPC endpoint and gas settings

**AI features not working**: Check OpenAI API key and rate limits

## Next Steps

1. Implement proper authentication (Supabase Auth)
2. Add file upload for images/audio/video
3. Complete absorption algorithm implementation
4. Add GLB export for mind snapshots
5. Implement secondary marketplace
6. Add allowlist functionality

