export type Format = "feed" | "story";

export type ShareSpec = {
  w: number;
  h: number;
  label: string;
  ratio: string;
  /** Where the crop sits on the source photo for this aspect. */
  focus: string;
};

export const FORMATS: Record<Format, ShareSpec> = {
  feed: { w: 1080, h: 1350, label: "Feed post", ratio: "4:5", focus: "50% 40%" },
  story: { w: 1080, h: 1920, label: "Story / Reel", ratio: "9:16", focus: "52% 50%" },
};

export const CAPTION = `Six Adirondack High Peaks in two days. 36.5 miles, 9,840 feet of climbing, camp down at Lake Colden.

Saturday: Marcy, Skylight, Gray. Sunday: Algonquin, Wright, Iroquois.

The plan had been a tidy, classical sort of thing. What we actually did ran long, went in for excess, and finished both days in the dark.`;
