"use client";

import { useEffect, useState } from "react";
import { shortAddress } from "@/lib/format";

type Status = "idle" | "copied" | "failed";

export default function CopyAddress({ address }: { address: string }) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = setTimeout(() => setStatus("idle"), 1500);
    return () => clearTimeout(timeout);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={copy}
        title={`Copy ${address}`}
        aria-label={`Copy address ${address}`}
        className="cursor-pointer rounded-full bg-background px-2 py-0.5 font-mono text-xs whitespace-nowrap text-muted hover:text-foreground"
      >
        {shortAddress(address)}
      </button>
      {/* Positioned out of the flow so showing it never shifts the layout. */}
      <span
        aria-live="polite"
        className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-foreground text-xs whitespace-nowrap text-background empty:bg-transparent"
      >
        {status === "copied" && "Copied!"}
        {status === "failed" && "Copy failed"}
      </span>
    </span>
  );
}
