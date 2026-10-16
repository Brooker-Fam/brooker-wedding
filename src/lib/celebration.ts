import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";

export interface Print {
  id: number;
  src: string;
  landscape: boolean;
}

export interface CelebrationMemories {
  prints: Print[];
  photoCount: number;
  songCount: number;
}

const NO_MEMORIES: CelebrationMemories = { prints: [], photoCount: 0, songCount: 0 };

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function getCelebrationMemories(printCount: number): Promise<CelebrationMemories> {
  try {
    const [photos, counts] = await Promise.all([
      query(
        `SELECT id, thumb_url, width, height FROM photos
         WHERE approved = TRUE AND media_type = 'image' AND thumb_url IS NOT NULL`
      ),
      query(
        `SELECT (SELECT COUNT(*) FROM photos WHERE approved = TRUE) AS photos,
                (SELECT COUNT(*) FROM song_requests) AS songs`
      ),
    ]);
    if (!photos || !counts) return NO_MEMORIES;

    return {
      prints: shuffle(photos)
        .slice(0, printCount)
        .map((p) => ({
          id: Number(p.id),
          src: String(p.thumb_url),
          landscape: Number(p.width) > Number(p.height),
        })),
      photoCount: Number(counts[0].photos),
      songCount: Number(counts[0].songs),
    };
  } catch (error) {
    await captureServerException(error, { page: "/" });
    return NO_MEMORIES;
  }
}
