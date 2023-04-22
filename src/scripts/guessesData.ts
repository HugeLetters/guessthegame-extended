import { getGameGuess, getGameStatus, normalizeGameName } from "./utils";

type GameGuess = {
  tries: number;
  guessed?: true;
};

const guessesData = getGuessesData();
export default guessesData;

function getGuessesData() {
  const parsedGamesIndices = new Set<number>();
  const guessedGames = new Map<string, GameGuess>();
  function addGuessedGame(index: number) {
    let guess: GameGuess | undefined;
    for (
      let i = 1, gameName = getGameGuess(index, i);
      gameName !== null && i < 50;
      gameName = getGameGuess(index, ++i)
    ) {
      guess = getGameData(normalizeGameName(gameName));
      guess.tries++;
    }
    if (!guess || getGameStatus(index) !== "win") return;

    guess.guessed = true;
  }
  function getGameData(game: string): GameGuess {
    if (game === "undefined" || game === "skipped") return { tries: 0 };
    const data = guessedGames.get(game);
    const returnValue = data ?? { tries: 0 };
    if (!data) guessedGames.set(game, returnValue);
    return returnValue;
  }

  Object.keys(localStorage).forEach(key => {
    const index = extractGameIndex(key);
    if (!index) return;
    if (parsedGamesIndices.has(index)) return;

    addGuessedGame(index);
    parsedGamesIndices.add(index);
  });
  return guessedGames;
}

function extractGameIndex(key: string) {
  const index = key.match(/^\d+/);
  if (!index) return;
  return parseInt(index[0]);
}
