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

function cameraFrame(thumbUrl: string): { roll: string; frame: number } | null {
  const name = thumbUrl.split("/").pop()?.replace(/-thumb.*$/, "") ?? "";
  const match = name.match(/^(.*?)(\d+)$/);
  return match ? { roll: match[1], frame: Number(match[2]) } : null;
}

// Burst shots (IMG_3877, IMG_3879) side by side on the table read as a glitch.
// Starred photos were picked by hand, so only the random fill skips near frames.
function pickPrints(photos: Record<string, unknown>[], count: number): Print[] {
  const starred = shuffle(photos.filter((p) => p.featured));
  const rest = shuffle(photos.filter((p) => !p.featured));
  const prints: Print[] = [];
  const taken: { roll: string; frame: number }[] = [];
  for (const p of [...starred, ...rest]) {
    const src = String(p.thumb_url);
    const frame = cameraFrame(src);
    if (frame && !p.featured && taken.some((t) => t.roll === frame.roll && Math.abs(t.frame - frame.frame) <= 3)) continue;
    if (frame) taken.push(frame);
    prints.push({ id: Number(p.id), src, landscape: Number(p.width) > Number(p.height) });
    if (prints.length === count) break;
  }
  return prints;
}

export async function getCelebrationMemories(printCount: number): Promise<CelebrationMemories> {
  try {
    const [photos, counts] = await Promise.all([
      query(
        `SELECT id, thumb_url, width, height, featured FROM photos
         WHERE approved = TRUE AND NOT reported AND media_type = 'image' AND thumb_url IS NOT NULL`
      ),
      query(
        `SELECT (SELECT COUNT(*) FROM photos WHERE approved = TRUE) AS photos,
                (SELECT COUNT(*) FROM song_requests) AS songs`
      ),
    ]);
    if (!photos || !counts) return NO_MEMORIES;

    return {
      prints: pickPrints(photos, printCount),
      photoCount: Number(counts[0].photos),
      songCount: Number(counts[0].songs),
    };
  } catch (error) {
    await captureServerException(error, { page: "/" });
    return NO_MEMORIES;
  }
}
