import type { ListItemDto, Platform } from "@mentalidade/shared";
import { useState } from "react";
import { getEmbedInfo } from "../utils/videoEmbed";

// Rótulo exibido na capa quando a plataforma não fornece uma imagem pública.
const platformLabels: Record<Platform, string> = {
  YOUTUBE: "YouTube",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  FACEBOOK: "Facebook",
  OUTRO: "Vídeo",
};

// Player sob demanda: exibe a capa do vídeo e só carrega o player oficial ao clicar em reproduzir.
export function VideoPlayer({ item }: { item: ListItemDto }) {
  const [playing, setPlaying] = useState(false);
  const embed = getEmbedInfo(item.url, item.platform);

  // Quando a plataforma não permite incorporação, o item permanece apenas como link externo.
  if (!embed) {
    return null;
  }

  if (playing) {
    return (
      <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black">
        <iframe
          className="h-full w-full"
          src={embed.embedUrl}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="group relative mt-3 block aspect-video w-40 overflow-hidden rounded-xl border border-slate-800"
      onClick={() => setPlaying(true)}
      aria-label={`Reproduzir: ${item.title}`}
    >
      {embed.thumbnailUrl ? (
        <img className="h-full w-full object-cover" src={embed.thumbnailUrl} alt="" loading="lazy" />
      ) : (
        // Sem capa pública: exibe o nome da plataforma sobre um fundo neutro.
        <span className="flex h-full w-full items-center justify-center bg-slate-900 text-xs font-medium tracking-wide text-slate-400">
          {platformLabels[item.platform]}
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-slate-950/40 transition group-hover:bg-slate-950/10">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/90">
          <svg className="ml-0.5 h-5 w-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
