export default function KeyboardShortcutsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
        Keyboard Shortcuts
      </h1>
      <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
        Master these keyboard shortcuts to speed up your workflow and navigate
        the canvas more efficiently.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Canvas Navigation
      </h2>
      <div className="rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-black dark:text-white">
                Action
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-black dark:text-white">
                Shortcut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            <ShortcutRow action="Pan canvas" shortcut="Space + Drag" />
            <ShortcutRow action="Zoom in" shortcut="Mouse wheel up" />
            <ShortcutRow action="Zoom out" shortcut="Mouse wheel down" />
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        History
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Navigate through your drawing history to undo mistakes or restore
        changes:
      </p>
      <div className="rounded-xl border border-black/5 dark:border-white/10 overflow-hidden mt-4">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-black dark:text-white">
                Action
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-black dark:text-white">
                Shortcut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            <ShortcutRow action="Undo last action" shortcut="Ctrl + Z" />
            <ShortcutRow action="Redo previously undone" shortcut="Ctrl + Y" />
            <ShortcutRow
              action="Redo previously undone (alt)"
              shortcut="Ctrl + Shift + Z"
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        General
      </h2>
      <div className="rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-black dark:text-white">
                Action
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-black dark:text-white">
                Shortcut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            <ShortcutRow
              action="Toggle dark mode"
              shortcut="Ctrl + Shift + D"
            />
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Drawing Tools
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        While most tool selection is done via the toolbar, keyboard shortcuts
        for tools are planned for future releases.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Tips
      </h2>
      <div className="space-y-4">
        <div className="rounded-lg border border-black/5 dark:border-white/10 p-4">
          <h4 className="font-medium text-black dark:text-white mb-2">
            Pan without toolbar
          </h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            Hold Space anywhere on the canvas to temporarily activate pan mode.
            This is useful when you&apos;re in the middle of a drawing and need
            to quickly look around.
          </p>
        </div>

        <div className="rounded-lg border border-black/5 dark:border-white/10 p-4">
          <h4 className="font-medium text-black dark:text-white mb-2">
            Precise zooming
          </h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            Use the mouse wheel for smooth zooming. The canvas will remember
            your zoom level and position when you return to the room.
          </p>
        </div>

        <div className="rounded-lg border border-black/5 dark:border-white/10 p-4">
          <h4 className="font-medium text-black dark:text-white mb-2">
            Multi-level undo
          </h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            The undo system maintains a full history of your actions. Keep
            pressing Ctrl+Z to step back through all your changes.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Customization
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Currently, keyboard shortcuts are fixed. Future versions may include
        customization options for power users who prefer different key bindings.
      </p>
    </div>
  );
}

function ShortcutRow({
  action,
  shortcut,
}: {
  action: string;
  shortcut: string;
}) {
  return (
    <tr>
      <td className="px-4 py-3 text-sm text-black/70 dark:text-white/70">
        {action}
      </td>
      <td className="px-4 py-3">
        <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-mono text-black dark:text-white border border-black/10 dark:border-white/10">
          {shortcut.split(" + ").map((key, i) => (
            <span key={i}>
              {i > 0 && (
                <span className="text-black/40 dark:text-white/40 mx-0.5">
                  +
                </span>
              )}
              {key}
            </span>
          ))}
        </kbd>
      </td>
    </tr>
  );
}
