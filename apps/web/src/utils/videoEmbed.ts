import type { Platform } from "@mentalidade/shared";

// Informações necessárias para incorporar um vídeo na aplicação.
// A capa pode ser nula quando a plataforma não expõe uma imagem pública previsível.
export interface EmbedInfo {
  embedUrl: string;
  thumbnailUrl: string | null;
}

// Extrai o identificador do vídeo a partir dos diferentes formatos de URL do YouTube.
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?[^#]*[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Extrai o shortcode de posts, reels e IGTV do Instagram.
function extractInstagramShortcode(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

// Extrai o identificador numérico do vídeo a partir da URL do TikTok.
function extractTikTokId(url: string): string | null {
  const match = url.match(/tiktok\.com\/(?:@[^/]+\/)?(?:video|photo|v)\/(\d+)/);
  return match ? match[1] : null;
}

// Retorna os dados de incorporação quando o vídeo pode ser reproduzido dentro do sistema.
// Todas as plataformas usam o player oficial (iframe); quando não é possível extrair o
// identificador, o item permanece apenas como link externo.
export function getEmbedInfo(url: string, platform: Platform): EmbedInfo | null {
  switch (platform) {
    case "YOUTUBE": {
      const videoId = extractYouTubeId(url);
      if (!videoId) {
        return null;
      }
      return {
        // Modo de privacidade avançada (youtube-nocookie) com reprodução automática ao clicar.
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
        // Capa oficial hospedada pelo próprio YouTube.
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      };
    }

    case "INSTAGRAM": {
      const shortcode = extractInstagramShortcode(url);
      if (!shortcode) {
        return null;
      }
      return {
        // Endpoint oficial de incorporação do Instagram.
        embedUrl: `https://www.instagram.com/p/${shortcode}/embed`,
        thumbnailUrl: null,
      };
    }

    case "TIKTOK": {
      const videoId = extractTikTokId(url);
      if (!videoId) {
        return null;
      }
      return {
        // Player oficial do TikTok (v1).
        embedUrl: `https://www.tiktok.com/player/v1/${videoId}`,
        thumbnailUrl: null,
      };
    }

    case "FACEBOOK": {
      return {
        // Plugin oficial de vídeo do Facebook; recebe a própria URL codificada.
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
        thumbnailUrl: null,
      };
    }

    default:
      return null;
  }
}
