import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ui2.bit.diamonds';

const MARKDOWN = `# Diamond UI — DMD Diamond Staking Platform

Diamond UI is the official web interface for the DMD blockchain network. It enables token holders to stake DMD, participate in DAO governance, monitor validators, and manage staking positions.

**Base URL:** ${SITE_URL}

---

## Sections

### Validators — \`/validators\`
Browse active validators and candidates on the DMD network. Each entry shows the validator address, staking pool balance, score, and current status. Use this page to select a pool to stake into.

### DAO Governance — \`/dao\`
View and interact with on-chain governance proposals. Lists active, historic, and pending proposals with voting status, vote counts, and execution outcomes.

- **Create Proposal** — \`/dao/create\` — Submit a new governance proposal
- **Historic Proposals** — \`/dao/historic\` — Browse closed and executed proposals

### Wiki — \`/wiki\`
Documentation and reference material for the DMD network and staking mechanics.

### FAQs — \`/faqs\`
Frequently asked questions covering staking, rewards, governance, and wallet setup.

### Profile — \`/profile\`
View your connected wallet's staking positions, pending rewards, and claim history.

---

## Network

DMD is an EVM-compatible proof-of-stake blockchain. Validators are elected each epoch; stakers delegate tokens to validator pools to earn epoch rewards.

Key concepts:

- **Epoch** — A fixed time window after which validator performance is scored and rewards distributed
- **Staking Pool** — Each validator operates a pool; token holders stake into pools they trust
- **DAO** — On-chain governance controls protocol parameters via executable proposals
- **Claiming Contract** — Holds accumulated staking rewards available for withdrawal

---

## API Endpoints

| Path | Description |
|------|-------------|
| \`/api/external\` | Proxy to the DMD backend RPC aggregator |
| \`/api/config\` | Runtime configuration (chain IDs, contract addresses) |
| \`/api/mcp\` | MCP server stub (JSON-RPC 2.0, protocol 2024-11-05) |
| \`/.well-known/api-catalog\` | RFC 9727 linkset — machine-readable API catalog |
| \`/.well-known/agent-skills/index.json\` | Agent skills index with SKILL.md digest |

---

## Notes

All data displayed in the UI is sourced from the DMD blockchain. Staking and governance actions require a connected Web3 wallet (WalletConnect).
`;

export async function GET() {
  const tokens = Math.ceil(MARKDOWN.length / 4);
  return new NextResponse(MARKDOWN, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(tokens),
    },
  });
}
