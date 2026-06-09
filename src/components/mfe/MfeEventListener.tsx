"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function MfeEventListener() {
  const router = useRouter();

  useEffect(() => {
    function handleNavigate(event: Event) {
      const { path } = (event as CustomEvent<{ path: string }>).detail;
      if (path) router.push(path);
    }

    function handleAuthLogin() {
      router.push("/dashboard");
    }

    window.addEventListener("mfe:navigate", handleNavigate);
    window.addEventListener("mfe:auth:login", handleAuthLogin);

    return () => {
      window.removeEventListener("mfe:navigate", handleNavigate);
      window.removeEventListener("mfe:auth:login", handleAuthLogin);
    };
  }, [router]);

  return null;
}
