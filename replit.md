# Infinite Craft Clone

## Overview

This is a browser-based Infinite Craft clone game built with React and Express. The game allows players to combine elements by dragging and dropping tiles on a canvas. Unlike the original Infinite Craft, this version uses a predefined dictionary of combinations instead of AI - only explicitly defined element combinations will work.

The core gameplay loop:
1. Players start with four base elements: Water, Fire, Earth, and Air
2. Elements are dragged from a sidebar onto a canvas
3. When two tiles overlap, the game checks a local dictionary for valid combinations
4. If a valid combination exists, a new element is created and added to the player's collection
5. All progress is saved in localStorage

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query for server state, local React state for game logic
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for drag-and-drop and layout transitions
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Design**: Simple REST endpoints defined in `shared/routes.ts`
- **Purpose**: Minimal backend - mainly for optional cloud backup functionality. The game logic runs entirely client-side.

### Data Storage
- **Primary Storage**: Browser localStorage for game state (elements, tiles, combinations)
- **Optional Backup**: PostgreSQL database for cloud sync (not required for core gameplay)
- **Schema Location**: `shared/schema.ts` defines both database tables and client-side TypeScript types

### Key Design Decisions

1. **Local-First Game Logic**: All combination logic runs in the browser using a predefined dictionary. No AI or external API calls for determining combinations.

2. **Deterministic Combinations**: Combinations are stored as sorted key pairs (e.g., "air|water": "cloud") so order doesn't matter when combining elements.

3. **Shared Types**: The `shared/` directory contains schemas and types used by both frontend and backend, ensuring type safety across the stack.

4. **Component Structure**:
   - `Sidebar.tsx`: Left panel with searchable element list
   - `GameCanvas.tsx`: Main canvas for drag-and-drop gameplay
   - `ElementCard.tsx`: Individual element display component
   - `use-game-engine.ts`: Core hook managing game state and combination logic

## External Dependencies

### Database
- **PostgreSQL**: Required for the optional backup feature. Connection via `DATABASE_URL` environment variable.
- **Drizzle ORM**: Type-safe database queries and schema management

### Frontend Libraries
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library for drag-and-drop
- **uuid**: Generating unique IDs for game tiles
- **lucide-react**: Icon library
- **Radix UI**: Accessible UI primitives (via shadcn/ui)

### Development
- **Vite**: Build tool and dev server
- **tsx**: TypeScript execution for the server
- **drizzle-kit**: Database migrations (`npm run db:push`)

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run db:push`: Push database schema changes