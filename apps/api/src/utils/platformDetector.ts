import type { Platform } from "@mentalidade/shared";

// Detecta a plataforma do vídeo a partir da URL informada.
export function detectPlatform(url: string): Platform {
  const normalized = url.toLowerCase();

  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) {
    return "YOUTUBE";
  }
  if (normalized.includes("facebook.com") || normalized.includes("fb.watch")) {
    return "FACEBOOK";
  }
  if (normalized.includes("instagram.com")) {
    return "INSTAGRAM";
  }
  if (normalized.includes("tiktok.com")) {
    return "TIKTOK";
  }

  return "OUTRO";
}
