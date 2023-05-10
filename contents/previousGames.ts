import type { PlasmoCSConfig } from "plasmo";

import { getGameGuess } from "~source/helpers/utils";

export const config: PlasmoCSConfig = {
  matches: ["https://guessthe.game/previous-games"],
  run_at: "document_end",
  all_frames: true,
  css: ["../source/index.pcss"],
};

(function () {
  replaceMarquee();
  guessTooltips();
})();

function replaceMarquee() {
  document.querySelectorAll("marquee").forEach((node) => {
    const parent = node.parentElement;
    if (!parent) return;
    const replacer = document.createElement("span");
    replacer.innerText = node.innerText;
    replacer.className =
      "inline-block whitespace-nowrap group-hover:animate-scroll basis-24 shrink-0";
    parent.innerHTML = "";
    parent.className += " overflow-hidden inline-flex gap-4 w-24 group";
    parent.appendChild(replacer);
    parent.appendChild(replacer.cloneNode(true));
  });
}

function guessTooltips() {
  document.querySelectorAll("div.prev-game-result-row").forEach((row, i) => {
    const gameIndex = i + 1;
    let earlyReturn = false;
    row.querySelectorAll("div.guess-cube").forEach((node, i) => {
      if (earlyReturn) return;
      const guessIndex = i + 1;
      const gameGuess = getGameGuess(gameIndex, guessIndex);
      if (!gameGuess) return (earlyReturn = true);
      node.setAttribute("data-game-guess", gameGuess);
      node.className +=
        " hover:after:content-[attr(data-game-guess)] after:absolute after:top-[-3rem] after:bg-main after:border after:border-slate-200 after:border-solid after:whitespace-nowrap after:rounded-md after:p-2 after:z-10 after:pointer-events-none relative";
    });
  });
}
