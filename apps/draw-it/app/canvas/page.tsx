"use client";

import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Canvas() {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  const openCanvas = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!slug.trim()) return;

    router.push(`/canvas/${slug}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={openCanvas}
        className="w-full max-w-sm space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-medium text-zinc-900 text-center">
          Join canvas
        </h1>

        <Input
          autoFocus
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="room-slug"
          className="text-center"
        />

        <Button
          type="submit"
          disabled={!slug.trim()}
          className="
            w-full
            bg-zinc-900 text-white
            hover:bg-zinc-800
            active:bg-zinc-900
            disabled:bg-zinc-200 disabled:text-zinc-400
            transition-colors
          "
        >
          Enter
        </Button>
      </form>
    </div>
  );
}
