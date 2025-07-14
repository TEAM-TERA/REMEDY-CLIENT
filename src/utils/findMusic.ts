import { musicData } from "../modules/drop/datas/musicData";

export function findMusic(query: string) {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return musicData.filter(
    (item) =>
      item.musicTitle.toLowerCase().includes(lowerQuery) ||
      item.singer.toLowerCase().includes(lowerQuery)
  );
} 