# Crypto Dashboard Server

A modular TypeScript Fastify server for crypto trading bot management.

## Features

- Modular architecture with clear separation of concerns
- TypeScript for type safety and better developer experience
- Fastify for high-performance API
- Encryption for secure communication
- Persistence for data storage
- Comprehensive error handling
- Logging with Pino
- Environment-based configuration

## Project Structure

\`\`\`
src/
├── config/           # Configuration management
├── controllers/      # Route handlers
├── middleware/       # Request/response middleware
├── routes/           # Route definitions
├── services/         # Business logic
├── types/            # TypeScript types
├── utils/            # Utility functions
├── app.ts            # Application setup
└── server.ts         # Server entry point
\`\`\`

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Copy `.env.example` to `.env` and update the values
4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Bot Management

- `POST /bots/create` - Create a new bot
- `GET /bots` - Get all bots
- `GET /bots/:id` - Get a specific bot
- `DELETE /bots/:id` - Delete a bot
- `POST /bots/:id/start` - Start a bot
- `POST /bots/:id/pause` - Pause a bot
- `POST /bots/:id/stop` - Stop a bot
- `POST /bots/:id/progress` - Update bot progress

### Wallet Management

- `POST /wallets/generate` - Generate wallets for a bot
- `POST /wallets/fund` - Fund wallets with SOL
- `POST /wallets/import` - Import existing wallets
- `POST /wallets/tag` - Tag wallets
- `POST /wallets/recover` - Recover funds from wallets
- `POST /wallets/delete` - Delete wallets
- `POST /wallets/convert-wsol` - Convert WSOL to SOL

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| HOST | Server host | 0.0.0.0 |
| NODE_ENV | Environment (development, production, test) | development |
| ENCRYPTION_KEY | Key for encrypting/decrypting data | default-encryption-key-change-me-in-production |
| CORS_ORIGIN | CORS origin setting | true |
| PERSIST_PATH | Path for data persistence | ./data/storage.json |

## Scripts

- `npm run build` - Build the project
- `npm run start` - Start the production server
- `npm run dev` - Start the development server
- `npm run lint` - Run linting
- `npm run test` - Run tests
- `npm run format` - Format code

## Docker

A Dockerfile and docker-compose.yml are provided for containerization.

### Build and run with Docker

\`\`\`bash
docker build -t crypto-dashboard-server .
docker run -p 3000:3000 crypto-dashboard-server
\`\`\`

### Run with Docker Compose

\`\`\`bash
docker-compose up -d
\`\`\`

## License

MIT
\`\`\`

Let's create a Docker file:

```dockerfile file="Dockerfile"
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --only=production

# Create data directory for persistence
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "dist/server.js"]
