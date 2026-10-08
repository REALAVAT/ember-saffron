"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
let snapshot: Date | null = null;

function getSnapshot() {
  snapshot ??= new Date();
  return snapshot;
}

/**
 * The current time on the client, `null` during prerender so time-dependent UI
 * renders after hydration without mismatches.
 */
export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
