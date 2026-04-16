export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
        Architecture
      </h1>
      <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
        Draw It is built as a monorepo using Turborepo, separating concerns into
        multiple packages and applications. This document provides an in-depth
        look at the system architecture.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Project Structure
      </h2>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6">
        <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
          {`draw-it/
├── apps/
│   ├── draw-it/          # Next.js frontend (port 3000)
│   └── ws-server/        # WebSocket server (port 8080)
├── packages/
│   ├── common/           # Shared utilities & validation
│   ├── db/               # Prisma database client
│   └── ui/               # Shared UI components
├── package.json          # Root workspace config
├── turbo.json            # Turborepo config
└── docker-compose.yml    # PostgreSQL setup`}
        </pre>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Applications
      </h2>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        draw-it (Next.js Frontend)
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The main web application built with Next.js 16 using the App Router.
        Handles all user-facing functionality including the canvas, dashboard,
        and authentication.
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6 mt-2">
        <li>Server-side rendering for initial page loads</li>
        <li>Client-side hydration for interactivity</li>
        <li>API routes for backend functionality</li>
        <li>Real-time canvas rendering with HTML5 Canvas</li>
      </ul>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        ws-server (WebSocket Server)
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        A dedicated WebSocket server for real-time collaboration. Built with the
        ws library for handling concurrent connections efficiently.
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6 mt-2">
        <li>Manages room-based WebSocket connections</li>
        <li>Broadcasts shape changes to room participants</li>
        <li>Validates JWT tokens on connection</li>
        <li>Streams in-progress pencil strokes</li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Packages
      </h2>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        @repo/common
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Shared utilities used across the monorepo:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6 mt-2">
        <li>
          <strong className="text-black dark:text-white">Authentication</strong>{" "}
          — JWT token signing/verification, password hashing with bcrypt
        </li>
        <li>
          <strong className="text-black dark:text-white">Validation</strong> —
          Zod schemas for type-safe request validation
        </li>
        <li>
          <strong className="text-black dark:text-white">Types</strong> — Shared
          TypeScript types and interfaces
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        @repo/db
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Prisma database client with PostgreSQL:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6 mt-2">
        <li>Singleton pattern for serverless environments</li>
        <li>Connection pooling with pg.Pool</li>
        <li>Type-safe queries with Prisma&apos;s generated types</li>
      </ul>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        @repo/ui
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Shared UI components built with Radix UI and Tailwind CSS:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6 mt-2">
        <li>Button, Input, Dialog primitives</li>
        <li>Consistent styling across applications</li>
        <li>Dark mode support via next-themes</li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Data Model
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The database schema consists of three main models:
      </p>

      <div className="space-y-4 mt-4">
        <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6">
          <h4 className="font-medium text-black dark:text-white mb-2">User</h4>
          <p className="text-sm text-black/60 dark:text-white/60 mb-3">
            Represents an authenticated user account.
          </p>
          <ul className="text-sm text-black/70 dark:text-white/70 space-y-1">
            <li>
              <code>id</code> — Unique identifier (CUID)
            </li>
            <li>
              <code>name</code> — Display name
            </li>
            <li>
              <code>email</code> — Unique email address
            </li>
            <li>
              <code>password</code> — Bcrypt hashed password
            </li>
            <li>
              <code>rooms</code> — Relation to owned rooms
            </li>
            <li>
              <code>shapes</code> — Relation to created shapes
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6">
          <h4 className="font-medium text-black dark:text-white mb-2">Room</h4>
          <p className="text-sm text-black/60 dark:text-white/60 mb-3">
            A canvas workspace that can contain multiple shapes.
          </p>
          <ul className="text-sm text-black/70 dark:text-white/70 space-y-1">
            <li>
              <code>id</code> — Unique identifier (CUID)
            </li>
            <li>
              <code>slug</code> — User-defined room name
            </li>
            <li>
              <code>isShared</code> — Collaboration enabled flag
            </li>
            <li>
              <code>adminId</code> — Owner user reference
            </li>
            <li>
              <code>shapes</code> — Relation to contained shapes
            </li>
          </ul>
          <p className="text-xs text-black/50 dark:text-white/50 mt-3">
            Unique constraint on (adminId, slug) ensures one room per name per
            user.
          </p>
        </div>

        <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6">
          <h4 className="font-medium text-black dark:text-white mb-2">Shape</h4>
          <p className="text-sm text-black/60 dark:text-white/60 mb-3">
            A drawing element on a room&apos;s canvas.
          </p>
          <ul className="text-sm text-black/70 dark:text-white/70 space-y-1">
            <li>
              <code>id</code> — Unique identifier (CUID)
            </li>
            <li>
              <code>type</code> — ShapeType enum (rectangle, circle, etc.)
            </li>
            <li>
              <code>x, y</code> — Position coordinates
            </li>
            <li>
              <code>width, height</code> — Dimensions
            </li>
            <li>
              <code>text</code> — Optional text content (for text shapes)
            </li>
            <li>
              <code>points</code> — JSON string (for pencil strokes)
            </li>
            <li>
              <code>roomId</code> — Parent room reference
            </li>
            <li>
              <code>userId</code> — Creator user reference
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Canvas Architecture
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The canvas uses a dual-layer rendering approach for performance:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6 mt-2">
        <li>
          <strong className="text-black dark:text-white">Main Canvas</strong> —
          Renders all completed shapes. Only re-renders when shapes are
          added/removed.
        </li>
        <li>
          <strong className="text-black dark:text-white">Overlay Canvas</strong>{" "}
          — Renders the active drawing (in-progress strokes). Clears after each
          stroke completion.
        </li>
      </ul>

      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <h4 className="font-medium text-black dark:text-white mb-3">
          Rendering Flow
        </h4>
        <ol className="text-sm text-black/60 dark:text-white/60 space-y-2 list-decimal pl-6">
          <li>User starts drawing with pencil tool</li>
          <li>Points are collected and rendered on overlay canvas</li>
          <li>Points are streamed via WebSocket to collaborators</li>
          <li>On mouse release, stroke is finalized</li>
          <li>Shape is added to main canvas and Zustand store</li>
          <li>Overlay canvas is cleared</li>
          <li>Shape is persisted to database (if room is shared)</li>
        </ol>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        State Management
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Draw It uses Zustand with persistence middleware for state management:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6 mt-2">
        <li>
          <strong className="text-black dark:text-white">
            Local Persistence
          </strong>{" "}
          — Canvas state is saved to localStorage, allowing users to continue
          where they left off.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Room-scoped State
          </strong>{" "}
          — Each room maintains its own shapes array and history stack.
        </li>
        <li>
          <strong className="text-black dark:text-white">Undo/Redo</strong> —
          History is maintained per room with step-based navigation.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Authentication Flow
      </h2>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <ol className="text-sm text-black/60 dark:text-white/60 space-y-4">
          <li className="flex gap-3">
            <span className="font-medium text-black dark:text-white">1.</span>
            <span>User submits credentials via signup or signin API</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-black dark:text-white">2.</span>
            <span>
              Server validates credentials and generates JWT (7-day expiry)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-black dark:text-white">3.</span>
            <span>JWT is set as httpOnly cookie (secure, sameSite strict)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-black dark:text-white">4.</span>
            <span>Subsequent requests include cookie automatically</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-black dark:text-white">5.</span>
            <span>Middleware validates token and extracts user ID</span>
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-black dark:text-white">6.</span>
            <span>Token is refreshed automatically before expiration</span>
          </li>
        </ol>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Real-time Architecture
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Real-time collaboration is achieved through WebSocket connections:
      </p>

      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
          {`┌─────────────┐      WebSocket       ┌─────────────┐
│   Client A   │◄────────────────────►│             │
└─────────────┘                      │             │
                                      │  ws-server  │
┌─────────────┐      WebSocket       │             │
│   Client B  │◄────────────────────►│             │
└─────────────┘                      └─────────────┘
                                            │
                                            │ REST
                                            ▼
                                      ┌─────────────┐
                                      │  PostgreSQL │
                                      └─────────────┘`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-black dark:text-white pt-4">
        WebSocket Authentication
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        When a client connects to the WebSocket server:
      </p>
      <ol className="space-y-2 text-black/60 dark:text-white/60 list-decimal pl-6 mt-2">
        <li>Server extracts token from cookie header</li>
        <li>Token is validated using the shared JWT secret</li>
        <li>Origin is checked against the allowed origins list</li>
        <li>Connection is rejected if validation fails</li>
        <li>On success, user is added to the specified room</li>
      </ol>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Deployment
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The application can be deployed in several configurations:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6 mt-2">
        <li>
          <strong className="text-black dark:text-white">Development</strong> —
          Both Next.js and WebSocket server run locally with hot reload
        </li>
        <li>
          <strong className="text-black dark:text-white">Production</strong> —
          Next.js deploys to any Node.js hosting, WebSocket server as a separate
          service
        </li>
        <li>
          <strong className="text-black dark:text-white">Docker</strong> —
          docker-compose includes PostgreSQL container; apps run in separate
          containers
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Security
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Security measures implemented in Draw It:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6 mt-2">
        <li>
          <strong className="text-black dark:text-white">
            HttpOnly Cookies
          </strong>{" "}
          — JWT tokens cannot be accessed via JavaScript
        </li>
        <li>
          <strong className="text-black dark:text-white">Bcrypt Hashing</strong>{" "}
          — Passwords stored with 10 salt rounds
        </li>
        <li>
          <strong className="text-black dark:text-white">
            CORS Protection
          </strong>{" "}
          — WebSocket connections validated against allowed origins
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Input Validation
          </strong>{" "}
          — All API inputs validated with Zod schemas
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Room Authorization
          </strong>{" "}
          — Users can only delete their own rooms
        </li>
      </ul>
    </div>
  );
}
