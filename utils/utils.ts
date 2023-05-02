export function getGameStatus(index: number): "win" | "lose" | null;
export function getGameStatus(index: number) {
  return localStorage.getItem(`${index}_gamestate`);
}
