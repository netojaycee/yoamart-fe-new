export function shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}



export function getLastShuffleDate(): string | null {
  return localStorage.getItem("lastShuffleDate");
}

export function setLastShuffleDate(date: string) {
  localStorage.setItem("lastShuffleDate", date);
}



