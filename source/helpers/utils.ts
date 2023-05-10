export function getGameStatus(index: number): "win" | "lose" | null;
export function getGameStatus(index: number) {
  return localStorage.getItem(`${index}_gamestate`);
}

export function getGameGuess(gameIndex: number, guessIndex: number) {
  return localStorage.getItem(`${gameIndex}_guess${guessIndex}`);
}

export function redirectToGameByIndex(index: number) {
  const destination = new URL(location.origin);
  destination.searchParams.append("fpg", index.toString());
  location.assign(destination);
}

export function getLatestGameIndex() {
  return Math.ceil(
    Math.abs((new Date().valueOf() - new Date("5/15/2022").valueOf()) / (24 * 60 * 60 * 1000))
  );
}
