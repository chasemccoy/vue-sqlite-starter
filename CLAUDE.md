# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend & Backend Development

- `npm run dev` - Start both frontend (Vue) and backend (Express) concurrently
- `npm run dev:app` - Start only the Vue frontend (port 3456)
- `npm run dev:backend` - Start only the Express backend (port 4321)

### Building & Quality Checks

- `npm run build` - Build the Vue frontend for production
- `npm run lint` - Format, lint, and type-check all code (includes Prettier, ESLint, and vue-tsc)
- `npm run format` - Format code with Prettier only

### Database Operations

- `npm run db:push` - Push schema changes to SQLite database
- `npm run db:studio` - Open Drizzle Studio for database inspection
- `npm run db:seed` - Seed the database with initial data
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run database migrations

### Integrations

- `npm run sync:readwise` - Sync records from Readwise integration

## Architecture Overview

### Project Structure

This is a full-stack TypeScript application with a Vue 3 frontend and Express backend, using SQLite with Drizzle ORM.

**Key directories:**

- `app/` - Vue 3 frontend with PrimeVue UI components
- `backend/` - Express API server and database layer
- `shared/` - Shared types and utilities between frontend/backend

### Frontend Architecture

- **Framework**: Vue 3 with Composition API
- **Routing**: Vue Router with typed routes
- **UI**: PrimeVue components with Nuxt UI
- **State**: TanStack Query for server state, composables for client logic
- **Styling**: Tailwind CSS with custom theme

### Backend Architecture

- **API**: Express.js with typed route handlers
- **Database**: SQLite with Drizzle ORM
- **Schema**: Three main entities - Records, Links, and Predicates forming a knowledge graph

### Core Data Model

The application models a knowledge graph with:

- **Records**: The main entities (artifacts, concepts, entities) with metadata
- **Links**: Relationships between records via predicates
- **Predicates**: Typed relationships (creation, containment, description, etc.)

### Path Aliases

Both frontend and backend use these path aliases:

- `@app/*` → `./app/*`
- `@shared/*` → `./shared/*`
- `@db/*` → `./backend/db/*`
- `@integrations/*` → `./backend/integrations/*`

### Environment Configuration

Required environment variables (see `.env`):

- `BACKEND_PORT` - Express server port (default: 4321)
- `FRONTEND_PORT` - Vite dev server port (default: 3456)
- `READWISE_TOKEN` - API token for Readwise integration
