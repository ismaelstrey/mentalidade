import type { LinkPreview } from "@mentalidade/shared";
import { detectPlatform } from "../utils/platformDetector";

// Resposta do oEmbed do YouTube.
interface YouTubeOEmbed {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
}

// Serviço responsável por extrair metadados de um link de vídeo.
export const linkPreviewService = {
  // Detecta a plataforma e, quando possível, busca título e autor via oEmbed.
  async preview(url: string): Promise<LinkPreview> {
    const platform = detectPlatform(url);
    const preview: LinkPreview = {
      url,
      platform,
      title: null,
      authorName: null,
      thumbnailUrl: null,
    };

    if (platform !== "YOUTUBE") {
      return preview;
    }

    try {
      const endpoint = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });

      if (!response.ok) {
        return preview;
      }

      const data = (await response.json()) as YouTubeOEmbed;

      return {
        ...preview,
        title: data.title ?? null,
        authorName: data.author_name ?? null,
        thumbnailUrl: data.thumbnail_url ?? null,
      };
    } catch {
      // Falhas de rede não impedem o cadastro do link: retornamos apenas a plataforma.
      return preview;
    }
  },
};
