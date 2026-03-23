"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const item = localStorage.getItem(key);
    if (item) {
      try {
        setValue(JSON.parse(item));
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
      }
    }
  }, [key]);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, mounted]);

  return [value, setValue] as const;
}
