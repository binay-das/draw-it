export default function CollaborationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
        Collaboration
      </h1>
      <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
        Draw It&apos;s real-time collaboration features let multiple users draw
        together on the same canvas simultaneously. Changes appear instantly
        across all connected clients.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        How Real-time Collaboration Works
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Draw It uses WebSocket connections to enable real-time synchronization.
        When collaboration is enabled:
      </p>
      <ol className="space-y-2 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>
          A persistent WebSocket connection is established between clients and
          server
        </li>
        <li>
          All drawing actions are broadcast to connected participants instantly
        </li>
        <li>Shape additions and deletions are synchronized in real-time</li>
        <li>In-progress pencil strokes are streamed live during drawing</li>
        <li>Connection status is displayed in the canvas header</li>
      </ol>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Enabling Collaboration
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        To collaborate with others on a room:
      </p>
      <ol className="space-y-4 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>
          <strong className="text-black dark:text-white">Open the room</strong>{" "}
          — Navigate to the room you want to share in the canvas.
        </li>
        <li>
          <strong className="text-black dark:text-white">Enable sharing</strong>{" "}
          — Click the sharing toggle in the toolbar or header area.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Confirm the action
          </strong>{" "}
          — When prompted, confirm that you want to enable live sharing.
        </li>
        <li>
          <strong className="text-black dark:text-white">Share the link</strong>{" "}
          — Copy the room URL and share it with collaborators.
        </li>
      </ol>

      <div className="rounded-lg border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-4">
        <p className="text-sm text-black/60 dark:text-white/60">
          <strong className="text-black dark:text-white">Note:</strong> When you
          enable sharing, your current canvas content is automatically synced to
          the database. This ensures collaborators see your existing work
          immediately upon joining.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        What Collaborators See
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        When someone joins a shared room, they can:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>View all existing shapes on the canvas</li>
        <li>See other users&apos; cursors moving in real-time</li>
        <li>Draw and create new shapes that appear instantly for others</li>
        <li>Delete shapes (changes sync to all participants)</li>
        <li>Use all drawing tools including freehand pencil</li>
        <li>Navigate (pan and zoom) independently from others</li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Real-time Drawing Stream
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        One of the most engaging features is live pencil drawing streaming. When
        you draw with the pencil tool, other collaborators can watch your
        strokes appear in real-time as you draw them, rather than seeing only
        the final result.
      </p>
      <p className="text-black/60 dark:text-white/60 leading-relaxed pt-2">
        This creates a sense of presence and connection, making remote
        collaboration feel more natural and engaging.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Connection Status
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The canvas displays connection status to keep you informed:
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6">
        <div className="space-y-3">
          <StatusItem
            status="Connected"
            description="WebSocket connection active. Real-time sync enabled."
            color="bg-green-500"
          />
          <StatusItem
            status="Reconnecting"
            description="Connection lost. Attempting to reconnect with exponential backoff."
            color="bg-yellow-500"
          />
          <StatusItem
            status="Disconnected"
            description="Unable to connect. Collaboration features unavailable."
            color="bg-red-500"
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Reconnection Logic
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Draw It handles connection interruptions gracefully:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>
          <strong className="text-black dark:text-white">
            Automatic retry
          </strong>{" "}
          — When connection is lost, Draw It automatically attempts to
          reconnect.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Exponential backoff
          </strong>{" "}
          — Retry intervals increase (1s, 2s, 4s, 8s, 16s) to prevent server
          overload.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Maximum attempts
          </strong>{" "}
          — After 5 failed attempts, the system stops retrying and shows a
          manual reconnect option.
        </li>
        <li>
          <strong className="text-black dark:text-white">User feedback</strong>{" "}
          — Clear status messages inform you of the connection state at all
          times.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Authentication
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        For collaborative rooms, Draw It uses token-based authentication:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>
          <strong className="text-black dark:text-white">JWT tokens</strong> —
          Secure, stateless authentication using JSON Web Tokens.
        </li>
        <li>
          <strong className="text-black dark:text-white">Cookie-based</strong> —
          Tokens are stored in httpOnly cookies for security.
        </li>
        <li>
          <strong className="text-black dark:text-white">Token refresh</strong>{" "}
          — Tokens are automatically refreshed to maintain sessions.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Origin validation
          </strong>{" "}
          — WebSocket connections validate request origin for security.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Privacy Considerations
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Your privacy is important:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>
          <strong className="text-black dark:text-white">
            Private by default
          </strong>{" "}
          — Rooms are private unless you explicitly enable sharing.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Local storage first
          </strong>{" "}
          — Your work is saved locally before being synced to the cloud.
        </li>
        <li>
          <strong className="text-black dark:text-white">No tracking</strong> —
          Draw It doesn&apos;t collect analytics or track your drawing content.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Best Practices
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        For the best collaboration experience:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>Use a stable internet connection for consistent real-time sync</li>
        <li>Enable sharing only when you&apos;re ready to collaborate</li>
        <li>Communicate with collaborators about who&apos;s working on what</li>
        <li>
          Save locally before enabling sharing to ensure all content is synced
        </li>
        <li>Use distinct room names to avoid confusion</li>
      </ul>
    </div>
  );
}

function StatusItem({
  status,
  description,
  color,
}: {
  status: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <div>
        <span className="font-medium text-black dark:text-white">{status}</span>
        <span className="text-black/60 dark:text-white/60">
          {" "}
          — {description}
        </span>
      </div>
    </div>
  );
}
