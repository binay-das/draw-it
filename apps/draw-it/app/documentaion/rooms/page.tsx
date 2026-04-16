export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
        Rooms & Sharing
      </h1>
      <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
        Rooms are the fundamental organizational unit in Draw It. Each room
        represents a separate canvas workspace where you can draw, collaborate,
        and save your work.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Understanding Rooms
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        A room is essentially a container for your canvas content. When you
        create a room, you&apos;re creating a new, empty canvas workspace with
        its own:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>Unique identifier (room ID)</li>
        <li>Custom name/slug chosen by you</li>
        <li>Set of shapes and drawings</li>
        <li>Collaboration settings (public/private)</li>
        <li>Associated user (the room admin)</li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Room Structure
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Each room contains the following components:
      </p>

      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6 space-y-4">
        <div>
          <h4 className="font-medium text-black dark:text-white">Room ID</h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            A unique identifier (CUID) assigned automatically when the room is
            created. Used internally and in URLs.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-black dark:text-white">Slug</h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            A user-defined, URL-friendly name for the room. Must be unique per
            user.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-black dark:text-white">Admin</h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            The user who created the room. Only the admin can delete the room or
            modify certain settings.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-black dark:text-white">
            Shared Status
          </h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            Indicates whether the room is accessible to collaborators or private
            to the admin.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-black dark:text-white">Shapes</h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            All drawing elements in the room, including rectangles, circles,
            lines, text, and pencil strokes.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Room Lifecycle
      </h2>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        Creation
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Rooms are created through the dashboard or the room actions menu. When
        creating a room:
      </p>
      <ol className="space-y-2 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>You choose a unique slug (room name)</li>
        <li>The system creates a new room with an empty canvas</li>
        <li>You&apos;re automatically redirected to the new room</li>
        <li>You become the room&apos;s admin</li>
      </ol>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        Sharing
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        By default, rooms are private. To enable collaboration:
      </p>
      <ol className="space-y-2 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>Open the room you want to share</li>
        <li>Click the sharing toggle in the toolbar</li>
        <li>Enable &quot;Live Sharing&quot;</li>
        <li>Your local shapes will be synced to the database</li>
        <li>Others can now join using your room link</li>
      </ol>

      <div className="rounded-lg border border-black/5 dark:border-white/10 bg-blue-50 dark:bg-blue-900/20 p-4 mt-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Important:</strong> When you enable sharing, all your current
          shapes are persisted to the database. This ensures collaborators see
          your existing work immediately upon joining.
        </p>
      </div>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        Persistence
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Draw It uses a local-first approach with optional cloud persistence:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>
          <strong className="text-black dark:text-white">Local Storage</strong>{" "}
          — Your canvas state is always saved locally in your browser. This
          means your work persists even without an internet connection.
        </li>
        <li>
          <strong className="text-black dark:text-white">Cloud Sync</strong> —
          When sharing is enabled, shapes are synced to the PostgreSQL database,
          making them available across devices and to collaborators.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        Deletion
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Only the room admin can delete a room. Deletion is permanent and
        removes:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>The room record</li>
        <li>All shapes associated with the room</li>
        <li>Collaboration links</li>
      </ul>
      <div className="rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 p-4 mt-4">
        <p className="text-sm text-red-800 dark:text-red-200">
          <strong>Warning:</strong> Room deletion is irreversible. Make sure to
          export or screenshot any content you want to keep before deleting.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Room URL Structure
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Rooms are accessed via their unique identifier in the URL:
      </p>
      <div className="rounded-lg border border-black/5 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800 px-4 py-3 font-mono text-sm">
        https://your-domain.com/canvas/[roomId]
      </div>
      <p className="text-black/60 dark:text-white/60 leading-relaxed pt-2">
        You can share this URL with collaborators. They&apos;ll need to sign in
        if they don&apos;t have an account.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Room Naming Conventions
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        When creating a room, choose a slug that&apos;s:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>Descriptive of the room&apos;s purpose</li>
        <li>Easy to remember and share</li>
        <li>Unique among your rooms (the system enforces this)</li>
      </ul>
      <p className="text-black/60 dark:text-white/60 leading-relaxed pt-2">
        Examples: &quot;product-roadmap&quot;, &quot;brainstorm-q4&quot;,
        &quot;wireframe-homepage&quot;
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Managing Multiple Rooms
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The dashboard provides a centralized view of all your rooms:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>Rooms are sorted by last updated (most recent first)</li>
        <li>
          Each room card shows the name, shape count, and last modified date
        </li>
        <li>You can quickly access any room by clicking on its card</li>
        <li>
          The room actions menu provides quick access to create/join operations
        </li>
      </ul>
    </div>
  );
}
