export default function ApiPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
        API Reference
      </h1>
      <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
        Draw It exposes a RESTful API for managing rooms, shapes, and
        authentication. All API routes are prefixed with{" "}
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm">
          /api
        </code>
        .
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Authentication
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Authentication endpoints handle user registration, login, and session
        management. All protected routes require a valid JWT token in an
        httpOnly cookie.
      </p>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-6">
        POST /api/auth/signup
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Create a new user account.
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Request Body
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "name": "string",
  "email": "string",
  "password": "string"
}`}
          </pre>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Response
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "success": true,
  "message": "User created successfully"
}`}
          </pre>
        </div>
        <div>
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Status Codes
          </h4>
          <ul className="text-sm text-black/70 dark:text-white/70 space-y-1">
            <li>
              <span className="text-green-600">201</span> — User created
              successfully
            </li>
            <li>
              <span className="text-red-600">400</span> — Invalid input or user
              already exists
            </li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-6">
        POST /api/auth/signin
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Authenticate a user and create a session.
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Request Body
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "email": "string",
  "password": "string"
}`}
          </pre>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Response
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}`}
          </pre>
        </div>
        <div>
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Status Codes
          </h4>
          <ul className="text-sm text-black/70 dark:text-white/70 space-y-1">
            <li>
              <span className="text-green-600">200</span> — Login successful
            </li>
            <li>
              <span className="text-red-600">401</span> — Invalid credentials
            </li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-6">
        POST /api/auth/signout
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Clear the auth cookie and end the session.
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <div>
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Response
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "success": true,
  "message": "Signed out successfully"
}`}
          </pre>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-6">
        POST /api/auth/refresh
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Refresh the JWT token to extend the session.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Rooms
      </h2>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        GET /api/user/rooms
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Get all rooms for the authenticated user.
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Response
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "rooms": [
    {
      "id": "string",
      "slug": "string",
      "isShared": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "shapes": 5
      }
    }
  ]
}`}
          </pre>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-6">
        POST /api/user/rooms
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Create a new room or find an existing one by slug (upsert).
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Request Body
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "slug": "string"
}`}
          </pre>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Response
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "room": {
    "id": "string",
    "slug": "string",
    "isShared": false,
    "adminId": "string"
  }
}`}
          </pre>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-6">
        DELETE /api/room/[roomId]
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Delete a room. Only the room admin can perform this action.
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <div>
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Status Codes
          </h4>
          <ul className="text-sm text-black/70 dark:text-white/70 space-y-1">
            <li>
              <span className="text-green-600">200</span> — Room deleted
            </li>
            <li>
              <span className="text-red-600">403</span> — Not authorized
            </li>
            <li>
              <span className="text-red-600">404</span> — Room not found
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Shapes
      </h2>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        GET /api/shapes/[roomId]
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Get all shapes in a room.
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Response
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "shapes": [
    {
      "id": "string",
      "type": "rectangle",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 150,
      "text": null,
      "points": null,
      "roomId": "string",
      "userId": "string",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}`}
          </pre>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-6">
        POST /api/shapes/[roomId]
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Add or delete shapes in a room.
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Add Shape Request
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "action": "add",
  "shape": {
    "type": "rectangle | square | circle | line | arrow | text | pencil",
    "x": number,
    "y": number,
    "width": number,
    "height": number,
    "text": "string (optional)",
    "points": "string (optional, JSON for pencil)"
  }
}`}
          </pre>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Delete Shape Request
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "action": "delete",
  "shape": {
    "type": "string",
    "x": number,
    "y": number,
    "width": number,
    "height": number,
    "text": null,
    "points": null
  }
}`}
          </pre>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Sharing
      </h2>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        POST /api/room/[roomId]/share
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Toggle room sharing and sync local shapes to database.
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Request Body
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "isShared": boolean,
  "shapes": Shape[]
}`}
          </pre>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">
            Response
          </h4>
          <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
            {`{
  "success": true,
  "room": {
    "id": "string",
    "isShared": true
  }
}`}
          </pre>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        WebSocket Messages
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Real-time communication uses WebSocket messages with the following
        structure:
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
          {`{
  "type": "join" | "leave" | "chat" | "delete" | "draw-stream",
  "roomId": "string",
  "data": object
}`}
        </pre>
      </div>

      <h3 className="text-lg font-semibold text-black dark:text-white pt-4">
        Message Types
      </h3>
      <ul className="space-y-3 text-black/60 dark:text-white/60">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm">
            join
          </code>{" "}
          — User enters a room
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm">
            leave
          </code>{" "}
          — User exits a room
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm">
            chat
          </code>{" "}
          — Finalized shape broadcast
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm">
            delete
          </code>{" "}
          — Shape deletion broadcast
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm">
            draw-stream
          </code>{" "}
          — Real-time pencil stroke preview
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Environment Variables
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The API requires the following environment variables:
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 mt-4">
        <pre className="text-sm text-black/70 dark:text-white/70 overflow-x-auto">
          {`DATABASE_URL=          # PostgreSQL connection string
JWT_SECRET=             # Secret for JWT signing
NEXT_PUBLIC_WS_URL=     # WebSocket server URL (ws://localhost:8080)
ALLOWED_ORIGINS=        # CORS allowed origins`}
        </pre>
      </div>
    </div>
  );
}
