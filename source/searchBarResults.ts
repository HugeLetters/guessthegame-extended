import fastdom from "fastdom";

import { getGameGuess, getGameStatus } from "./helpers/utils";

const guessedGameClass = " !bg-emerald-500";
const triedGameClass =
  " after:content-[attr(data-tries)_'_tries'] after:text-neutral-900 after:text-xs after:font-extrabold after:bg-neutral-400 after:rounded-md after:py-1 after:px-2 after:ml-1 after:border after:border-solid after:border-neutral-900 after:whitespace-nowrap";

let retried = false;
export function setSearchBar() {
  if (document.querySelector<HTMLDivElement>("div.result")?.innerText.includes("The answer was"))
    return;

  const inputNode = document.querySelector("div.input-area");
  if (!inputNode) {
    if (retried) return;
    retried = true;
    setTimeout(setSearchBar, 2000);
    return;
  }

  const guessesData = getGuessesData();

  const searchResultListObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      switch (mutation.type) {
        case "attributes":
          return updateSearchHandler(mutation);
        case "childList":
          return newSearchHandler(mutation.addedNodes);
      }
    });
  });
  new MutationObserver((mutations) => {
    if (!mutations.some(({ addedNodes: { length } }) => !!length)) return;

    const searchResults = inputNode.querySelector("ul.suggestions");
    if (!searchResults) return;
    searchResults.querySelectorAll("li").forEach(updateSearchResult);

    searchResultListObserver.disconnect();
    searchResultListObserver.observe(searchResults, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
    });
  }).observe(inputNode, { childList: true });

  function newSearchHandler(addedNodes: NodeList) {
    addedNodes.forEach((node) => {
      if (!(node instanceof HTMLLIElement)) return;
      updateSearchResult(node);
    });
  }

  function updateSearchHandler(mutation: MutationRecord) {
    fastdom.measure(() => {
      const { target } = mutation;
      if (
        !(target instanceof HTMLLIElement) ||
        !mutation.oldValue ||
        target.className.includes(mutation.oldValue)
      )
        return;
      fastdom.mutate(() => {
        if (target.dataset.tries) target.className += triedGameClass;
        if (target.dataset.guessed === "true") target.className += guessedGameClass;
      });
    });
  }

  function updateSearchResult(node: HTMLLIElement) {
    fastdom.measure(() => {
      const gameData = guessesData.get(normalizeGameName(node.innerText));
      if (!gameData) return;

      const { guessed, tries } = gameData;
      fastdom.mutate(() => {
        node.setAttribute("data-tries", tries.toString());
        node.className += triedGameClass;

        if (!guessed) return;

        node.setAttribute("data-guessed", "true");
        node.className += guessedGameClass;
      });
    });
  }
}

type GameGuess = {
  tries: number;
  guessed?: true;
};

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

  Object.keys(localStorage).forEach((key) => {
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

function normalizeGameName(name: string) {
  return name.replace(/[-():!]/g, "").toLowerCase();
}
