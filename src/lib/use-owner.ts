"use client";

import { useState, useEffect } from "react";

let cached: string | null = null;

export function useOwnerId(): string {
  const [id, setId] = useState<string>(cached ?? "");

  useEffect(() => {
    if (cached) { setId(cached); return; }
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => { cached = d.userId ?? ""; setId(cached!); })
      .catch(() => {});
  }, []);

  return id;
}
