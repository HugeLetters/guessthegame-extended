import guessesData from "./guessesData";
import { normalizeGameName, prefixLogMessage } from "./utils";

const noInputNodeLog = prefixLogMessage("Couldn' find input element to attach to");
const noSearchResultsLog = prefixLogMessage("Couldn't find element with search results");
const guessedGameClass = " bg-emerald-500";
const triedGameClass =
  " after:content-[attr(data-tries)_'_tries'] after:text-neutral-900 after:text-xs after:font-extrabold after:bg-neutral-400 after:rounded-md after:py-1 after:px-2 after:ml-1 after:border after:border-solid after:border-neutral-900 after:whitespace-nowrap";

export default function setSearchResults() {
  const inputNode = document.querySelector("div.input-area");
  if (!inputNode) return console.error(noInputNodeLog);

  let searchResultListObserver = new MutationObserver(() => null);
  new MutationObserver(mutations => {
    if (!mutations.some(({ addedNodes: { length } }) => !!length)) return;

    const searchResults = inputNode.querySelector("ul.suggestions");
    if (!searchResults) return console.warn(noSearchResultsLog);
    searchResults.querySelectorAll("li").forEach(updateSearchResult);

    searchResultListObserver.disconnect();
    searchResultListObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        switch (mutation.type) {
          case "attributes":
            return updateSearchHandler(mutation);
          case "childList":
            return newSearchHandler(mutation.addedNodes);
        }
      });
    });
    searchResultListObserver.observe(searchResults, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
    });
  }).observe(inputNode, { childList: true });
}

function newSearchHandler(addedNodes: NodeList) {
  addedNodes.forEach(node => {
    if (!(node instanceof HTMLLIElement)) return;
    updateSearchResult(node);
  });
}
function updateSearchHandler(mutation: MutationRecord) {
  if (
    !(mutation.target instanceof HTMLLIElement) ||
    !mutation.oldValue ||
    mutation.target.className.includes(mutation.oldValue)
  )
    return;

  if (mutation.target.dataset.tries) mutation.target.className += triedGameClass;
  if (mutation.target.dataset.guessed === "true") mutation.target.className += guessedGameClass;
}

function updateSearchResult(node: HTMLLIElement) {
  const gameData = guessesData.get(normalizeGameName(node.innerText));
  if (!gameData) return;

  const { guessed, tries } = gameData;
  node.setAttribute("data-tries", tries.toString());
  node.className += triedGameClass;

  if (!guessed) return;

  node.setAttribute("data-guessed", "true");
  node.className += guessedGameClass;
}
