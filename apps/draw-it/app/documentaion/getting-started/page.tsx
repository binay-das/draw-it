export default function GettingStartedPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
        Getting Started
      </h1>
      <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
        This guide will walk you through everything you need to know to start
        creating on Draw It. The process is straightforward — create an account,
        set up a room, and begin drawing.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Prerequisites
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Draw It is a web-based application. You&apos;ll need:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
        <li>A stable internet connection (for collaboration features)</li>
        <li>An account (free to create)</li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Creating an Account
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        If you don&apos;t have an account yet, follow these steps:
      </p>
      <ol className="space-y-4 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>
          <strong className="text-black dark:text-white">
            Visit the signup page
          </strong>{" "}
          — Click the sign up link on the landing page or navigate directly to
          the signup route.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Fill in your details
          </strong>{" "}
          — Enter your name, email address, and choose a secure password.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Verify and confirm
          </strong>{" "}
          — Submit the form to create your account.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Automatic login
          </strong>{" "}
          — You&apos;ll be automatically signed in and redirected to your
          dashboard.
        </li>
      </ol>

      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6">
        <h3 className="font-semibold mb-2 text-black dark:text-white">
          Already have an account?
        </h3>
        <p className="text-sm text-black/60 dark:text-white/60">
          If you already have an account, simply sign in with your email and
          password. You&apos;ll be redirected to your dashboard where all your
          rooms are stored.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Creating Your First Room
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        A <strong className="text-black dark:text-white">room</strong> is your
        workspace — a dedicated canvas where you can draw, organize ideas, and
        collaborate with others. Here&apos;s how to create one:
      </p>
      <ol className="space-y-4 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>
          <strong className="text-black dark:text-white">
            Navigate to your dashboard
          </strong>{" "}
          — After signing in, you&apos;ll see your dashboard with an option to
          create a new room.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Click &quot;Create New Room&quot;
          </strong>{" "}
          — This opens a modal where you can name your room.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Choose a room name
          </strong>{" "}
          — Enter a unique name (slug) for your room. This will be part of the
          room&apos;s URL.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Confirm creation
          </strong>{" "}
          — Click create, and you&apos;ll be taken directly to your new canvas.
        </li>
      </ol>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Joining an Existing Room
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        If someone has shared a room with you, joining is simple:
      </p>
      <ol className="space-y-4 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>
          <strong className="text-black dark:text-white">
            Click the shared link
          </strong>{" "}
          — This will take you directly to the room&apos;s canvas.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Authenticate if needed
          </strong>{" "}
          — If the room requires authentication, you&apos;ll be prompted to sign
          in.
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Start collaborating
          </strong>{" "}
          — Once in, you can view and contribute to the canvas in real-time.
        </li>
      </ol>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Your Dashboard
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The dashboard is your control center. From here you can:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>View all your rooms organized by last updated</li>
        <li>Create new rooms with custom names</li>
        <li>Join existing rooms via room ID or URL</li>
        <li>Delete rooms you no longer need</li>
        <li>See room metadata (shape count, last modified date)</li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Next Steps
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Now that you understand the basics, explore these guides to make the
        most of Draw It:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>
          <a
            href="/documentaion/drawing-tools"
            className="underline underline-offset-4 hover:text-black dark:hover:text-white"
          >
            Drawing Tools
          </a>{" "}
          — Learn about all available drawing tools and how to use them.
        </li>
        <li>
          <a
            href="/documentaion/collaboration"
            className="underline underline-offset-4 hover:text-black dark:hover:text-white"
          >
            Collaboration
          </a>{" "}
          — Enable real-time collaboration and invite others to your canvas.
        </li>
        <li>
          <a
            href="/documentaion/keyboard-shortcuts"
            className="underline underline-offset-4 hover:text-black dark:hover:text-white"
          >
            Keyboard Shortcuts
          </a>{" "}
          — Speed up your workflow with keyboard shortcuts.
        </li>
      </ul>
    </div>
  );
}
