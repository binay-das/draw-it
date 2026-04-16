export default function DrawingToolsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
        Drawing Tools
      </h1>
      <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
        Draw It provides a comprehensive set of drawing tools designed for
        clarity and control. This guide covers each tool in detail and explains
        how to use them effectively.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-4">
        Tool Overview
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The toolbar is located on the left side of the canvas. Each tool serves
        a specific purpose, from creating basic shapes to adding freehand
        drawings.
      </p>

      <div className="rounded-xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 p-6">
        <div className="space-y-4">
          <ToolItem
            name="Rectangle"
            description="Creates rectangular shapes by click-and-drag. Hold Shift to constrain proportions."
          />
          <ToolItem
            name="Square"
            description="Creates equal-sided quadrilaterals. Automatically constrains to the minimum dimension."
          />
          <ToolItem
            name="Circle"
            description="Creates elliptical shapes based on the bounding box you draw."
          />
          <ToolItem
            name="Line"
            description="Draws straight lines between two points. Click to set start and end positions."
          />
          <ToolItem
            name="Arrow"
            description="Similar to line but includes an arrowhead at the end point."
          />
          <ToolItem
            name="Text"
            description="Adds text annotations anywhere on the canvas. Click to place, then type."
          />
          <ToolItem
            name="Pencil"
            description="Freehand drawing tool. Click and drag to draw natural-looking strokes."
          />
          <ToolItem
            name="Eraser"
            description="Click on shape edges to delete them. Selects shapes for deletion."
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Shape Tools in Detail
      </h2>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        Rectangle and Square
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The rectangle tool is one of the most frequently used tools for creating
        wireframes, diagrams, and layout mockups. To use it:
      </p>
      <ol className="space-y-2 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>Select the rectangle tool from the toolbar</li>
        <li>Click and hold on the canvas where you want the top-left corner</li>
        <li>Drag to the bottom-right corner</li>
        <li>Release to create the shape</li>
      </ol>
      <p className="text-black/60 dark:text-white/60 leading-relaxed pt-2">
        The square tool works identically but constrains the shape to equal
        width and height, useful for creating icons, badges, or perfectly square
        elements.
      </p>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        Circle
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The circle tool creates elliptical shapes based on the bounding box you
        define. This is useful for creating diagrams, avatars, or highlighting
        areas:
      </p>
      <ol className="space-y-2 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>Select the circle tool from the toolbar</li>
        <li>Click and hold where you want the bounding box to start</li>
        <li>Drag to define the bounding area</li>
        <li>Release to create the circle</li>
      </ol>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        Line and Arrow
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Lines and arrows are essential for creating connectors, flowcharts, and
        indicating relationships between elements:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>
          <strong className="text-black dark:text-white">Line</strong> — Creates
          a straight line between two points. Great for borders, dividers, and
          simple connectors.
        </li>
        <li>
          <strong className="text-black dark:text-white">Arrow</strong> — Same
          as line but includes an arrowhead, perfect for flowcharts and process
          diagrams.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        Text Annotations
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The text tool allows you to add labels, notes, and annotations anywhere
        on the canvas. Unlike traditional text boxes, text in Draw It can be
        freely positioned and resized:
      </p>
      <ol className="space-y-2 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>Select the text tool from the toolbar</li>
        <li>Click on the canvas where you want to place the text</li>
        <li>An input field will appear</li>
        <li>Type your text and press Enter or click outside to confirm</li>
      </ol>

      <h3 className="text-xl font-semibold text-black dark:text-white pt-4">
        Pencil (Freehand Drawing)
      </h3>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The pencil tool captures natural, freehand strokes. It&apos;s perfect
        for sketching, hand-drawn diagrams, or adding a personal touch:
      </p>
      <ol className="space-y-2 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>Select the pencil tool from the toolbar</li>
        <li>Click and hold to start drawing</li>
        <li>Move your mouse to create the stroke path</li>
        <li>Release to complete the stroke</li>
      </ol>
      <p className="text-black/60 dark:text-white/60 leading-relaxed pt-2">
        In real-time collaboration mode, pencil strokes are streamed live to
        other participants, showing your drawing progress as it happens.
      </p>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Eraser Tool
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        The eraser tool allows you to remove shapes from the canvas:
      </p>
      <ol className="space-y-2 text-black/60 dark:text-white/60 list-decimal pl-6">
        <li>Select the eraser tool from the toolbar</li>
        <li>Click on the edge of any shape you want to delete</li>
        <li>The shape will be immediately removed</li>
      </ol>
      <div className="rounded-lg border border-black/5 dark:border-white/10 bg-yellow-50 dark:bg-yellow-900/20 p-4 mt-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> The eraser selects shapes by clicking on their
          edges. Make sure to click precisely on the shape border for accurate
          selection.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Canvas Navigation
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Draw It features an infinite canvas with smooth pan and zoom
        capabilities:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>
          <strong className="text-black dark:text-white">Pan</strong> — Click
          and drag with the pan tool (hand icon) or hold Space and drag
        </li>
        <li>
          <strong className="text-black dark:text-white">Zoom</strong> — Use
          your mouse wheel to zoom in and out
        </li>
        <li>
          <strong className="text-black dark:text-white">
            Viewport Memory
          </strong>{" "}
          — Your zoom level and position are saved automatically
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-black dark:text-white pt-8">
        Undo and Redo
      </h2>
      <p className="text-black/60 dark:text-white/60 leading-relaxed">
        Every action on the canvas is tracked in a history stack. You can
        navigate back and forth through your changes:
      </p>
      <ul className="space-y-2 text-black/60 dark:text-white/60 list-disc pl-6">
        <li>
          <strong className="text-black dark:text-white">Undo</strong> — Reverts
          the last action (Ctrl+Z)
        </li>
        <li>
          <strong className="text-black dark:text-white">Redo</strong> —
          Restores a previously undone action (Ctrl+Y or Ctrl+Shift+Z)
        </li>
      </ul>
    </div>
  );
}

function ToolItem({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-black/5 dark:border-white/5 last:border-0">
      <div className="w-3 h-3 rounded-full bg-black dark:bg-white mt-1.5 shrink-0" />
      <div>
        <span className="font-medium text-black dark:text-white">{name}</span>
        <p className="text-sm text-black/60 dark:text-white/60 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}
