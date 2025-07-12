# Vue.js + SQLite Starter

A modern full-stack starter template built with Vue.js, TanStack Query, Express, SQLite, and Drizzle ORM.

## 🚀 Tech Stack

- **Frontend**: Vue.js 3 with TypeScript, TanStack Query, Vue Router
- **Backend**: Express.js with TypeScript
- **Database**: SQLite with Drizzle ORM
- **Development**: Vite, ESLint, Prettier, Concurrently
- **Type safety**: Full end-to-end TypeScript with Zod validation

## 📁 Project Structure

```
├── app/                   # Vue.js frontend application
│   ├── assets/            # Static assets and CSS
│   ├── composables/       # Vue composables for API calls
│   ├── views/             # Vue components/pages
│   ├── router.ts          # Vue Router configuration
│   └── main.ts            # App entry point
├── backend/               # Express.js backend
│   ├── api/               # API route handlers
│   └── db/                # Database layer
│       ├── queries/       # Database query functions
│       └── schema/        # Drizzle schema definitions
├── shared/                # Shared types and utilities
│   ├── lib/               # Shared utility functions
│   └── types/             # TypeScript type definitions
└── scripts/               # Utility scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v22 or higher)
- pnpm

### Installation

1. Clone this repository:

```bash
git clone <your-repo-url>
cd vue-sqlite-starter
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

```bash
pnpm db:push      # Apply schema to database
pnpm db:seed      # Seed with initial data
```

### Development

Start both frontend and backend in development mode:

```bash
pnpm dev
```

This runs:

- Frontend on port specified in `FRONTEND_PORT` env var
- Backend on port specified in `BACKEND_PORT` env var
- Includes hot reload for both frontend and backend

### Individual Commands

```bash
# Frontend only
pnpm dev:app

# Backend only
pnpm dev:backend

# Build for production
pnpm build

# Lint and format code
pnpm lint
```

## 🗄️ Database Management

```bash
# Push schema changes to database
pnpm db:push

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (database browser)
pnpm db:studio

# Seed database with sample data
pnpm db:seed

# Reset database (clean + push + seed)
pnpm db:reset

# Check database integrity
pnpm db:check

# Backup database
pnpm db:backup
```

## 🏗️ Architecture

### Frontend Architecture

- **Vue 3 Composition API** with TypeScript
- **TanStack Query** for server state management and caching
- **Composables** for reusable API logic (`useRecord.ts`, `useApiClient.ts`)
- **Vue Router** for client-side routing
- **Unhead** for document head management

### Backend Architecture

- **Express.js** with TypeScript
- **Drizzle ORM** for type-safe database operations
- **Zod** for runtime type validation
- **Modular routing** with separate route handlers
- **Error handling** middleware

## 🔧 Customization

### Adding New Features

1. **Database schema**: Add tables and relations in `backend/db/schema/`
2. **Database queries**: Add functions in `backend/db/queries/`
3. **API Routes**: Create handlers in `backend/api/`
4. **Frontend composables**: Create Vue composables in `app/composables/`
5. **Types**: Define shared types in `shared/types/`

### Environment Configuration

Create a `.env` file:

```env
FRONTEND_PORT=5173
BACKEND_PORT=3000
DATABASE_NAME="example"
```

### Path Aliases

Configured in `vite.config.ts`:

- `@app` → `./app`
- `@shared` → `./shared`
- `@db` → `./backend/db`
- `@api` → `./backend/api`

## 📝 Example Usage

The starter includes a complete CRUD example for "records":

- **GET** `/record/:id` - Get record by ID
- **PUT** `/record` - Create or update record
- **DELETE** `/record/:id` - Delete record

Frontend usage:

```typescript
import useRecord from '@app/composables/useRecord';

const { getRecord, upsertRecord, deleteRecord } = useRecord();

// Query a record
const { data: record } = getRecord(recordId);

// Create/update a record
const upsertMutation = upsertRecord();
await upsertMutation.mutateAsync(recordData);
```
