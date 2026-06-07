"use client";

import { useEffect, useRef } from "react";

interface MfeMountProps {
  url: string;
  className?: string;
}

type Lifecycles = {
  bootstrap: () => Promise<void>;
  mount: (props: { domElement: Element }) => Promise<void>;
  unmount: (props: { domElement: Element }) => Promise<void>;
};

async function setupVitePreamble(mfeBaseUrl: string): Promise<void> {
  if ((window as any).__vite_plugin_react_preamble_installed__) return;
  try {
    const RefreshRuntime = await import(/* webpackIgnore: true */ `${mfeBaseUrl}/@react-refresh`);
    RefreshRuntime.default.injectIntoGlobalHook(window);
  } catch {
    // silencia se não conseguir carregar — fallback abaixo garante que o MFE rode
  } finally {
    (window as any).$RefreshReg$ = (window as any).$RefreshReg$ ?? (() => {});
    (window as any).$RefreshSig$ = (window as any).$RefreshSig$ ?? (() => () => {});
    (window as any).__vite_plugin_react_preamble_installed__ = true;
  }
}

export function MfeMount({ url, className }: MfeMountProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lifecycles: Lifecycles | null = null;
    let mounted = false;
    let cancelled = false;

    (async () => {
      try {
        const baseUrl = new URL(url).origin;
        await setupVitePreamble(baseUrl);
        if (cancelled) return;
        const mod = await import(/* webpackIgnore: true */ url);
        if (cancelled) return;
        lifecycles = mod as Lifecycles;
        if (lifecycles && ref.current) {
          await lifecycles.bootstrap();
          if (cancelled) return;
          await lifecycles.mount({ domElement: ref.current });
          mounted = true;
        }
      } catch (err) {
        console.error(`[MfeMount] failed to load ${url}`, err);
      }
    })();

    return () => {
      cancelled = true;
      if (lifecycles && ref.current && mounted) {
        mounted = false;
        lifecycles.unmount({ domElement: ref.current }).catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return <div ref={ref} className={className} />;
}
