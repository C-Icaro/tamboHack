# Tambo Hack

Showcase and reference project for **Tambo AI** applications — generative UI toolkit for React.

## Project Structure

```
tamboHack/
├── tambo-showcase/     # Next.js app with Tambo AI integration
└── reference/          # Documentation and references
```

## Quick Start

### 1. Set up the showcase

```bash
cd tambo-showcase
npm install
npx tambo init
```

### 2. Configure environment variables

Copy the example file and add your API key:

```bash
cp example.env.local .env.local
```

Edit `.env.local` and configure:

- `NEXT_PUBLIC_TAMBO_API_KEY` — get yours at [tambo.co/dashboard](https://tambo.co/dashboard) (free)
- `DIGITAL_TWIN_DB_PATH` — (optional) path to SQLite database for `/notes` page

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Chat with generative UI** — `/chat` — conversation interface with dynamically generated components
- **Digital Twin Notes** — `/notes` — personal notes with local database (requires `DIGITAL_TWIN_DB_PATH`)
- **Tambo POC** — `/tambo-poc` — demonstration of Tambo capabilities
- **Voice input** — speech-to-text via `DictationButton`
- **MCP** — Model Context Protocol support for external tools

## Tech Stack

- **Next.js 15** with App Router
- **React 19** + TypeScript
- **Tambo AI SDK** — generative and interactable components
- **Tailwind CSS v4** — with dark mode support
- **Recharts** — data visualization
- **SQLite** (better-sqlite3) — Digital Twin

## Documentation

- [Tambo AI Docs](https://docs.tambo.co)
- [CLAUDE.md](tambo-showcase/CLAUDE.md) — development guide for this repo
- [tambo-showcase/README.md](tambo-showcase/README.md) — template details and customization

## License

MIT
