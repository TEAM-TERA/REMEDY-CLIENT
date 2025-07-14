import { musicData } from "../datas/musicData";

function findMusic(query: string) {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return musicData.filter(
    (item) =>
      item.musicTitle.toLowerCase().includes(lowerQuery) ||
      item.singer.toLowerCase().includes(lowerQuery)
  );
}

export default findMusic;