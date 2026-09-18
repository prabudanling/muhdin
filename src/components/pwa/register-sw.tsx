"use client";

/**
 * RegisterSW — mendaftarkan service worker untuk PWA offline (Task 15-b).
 * Render null; dipasang sekali di pohon aplikasi (muhdin-app.tsx).
 * Registrasi menunggu event load agar tidak berebut bandwidth hydration.
 */
import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Saat ada SW baru menunggu, aktifkan segera agar update cepat.
          reg.addEventListener("updatefound", () => {
            const next = reg.installing;
            next?.addEventListener("statechange", () => {
              if (next.state === "installed" && navigator.serviceWorker.controller) {
                next.postMessage("SKIP_WAITING");
              }
            });
          });
        })
        .catch(() => {
          /* offline/PWA adalah progressive enhancement — abaikan kegagalan */
        });
    };
    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
