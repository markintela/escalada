'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { pluck, strum } from './audio';

export type Step = { keys: string[]; midis: number[]; chord?: boolean; onStep?: () => void };

/** Toca uma sequência de notas/acordes e informa quais posições estão acesas. */
export function useSequencer() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState<Set<string>>(new Set());

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (flashTimer.current) {
      clearTimeout(flashTimer.current);
      flashTimer.current = null;
    }
  };

  const stop = useCallback(() => {
    clear();
    setPlaying(false);
    setActive(new Set());
  }, []);

  const play = useCallback((steps: Step[], stepMs: number) => {
    clear();
    if (!steps.length) return;
    steps.forEach((st, i) => {
      timers.current.push(
        setTimeout(() => {
          if (st.chord) strum(st.midis);
          else st.midis.forEach((m) => pluck(m));
          setActive(new Set(st.keys));
          st.onStep?.();
        }, i * stepMs),
      );
    });
    timers.current.push(
      setTimeout(() => {
        setPlaying(false);
        setActive(new Set());
      }, steps.length * stepMs + 300),
    );
    setPlaying(true);
  }, []);

  const flash = useCallback(
    (key: string, midi: number) => {
      pluck(midi);
      if (playing) return;
      setActive(new Set([key]));
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setActive(new Set()), 450);
    },
    [playing],
  );

  useEffect(() => () => {
    clear();
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  return { playing, active, play, stop, flash };
}
