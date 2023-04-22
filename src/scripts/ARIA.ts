import { prefixLogMessage } from "./utils";

const noHeaderLog = prefixLogMessage("Couldn't find header with info buttons");

export default function setARIA() {
  setHeaderARIA();
  setClueButtonsARIA();
  //   todo - clue buttons
  //   todo - clue images alt names
  //   todo - back/next button
}

function setHeaderARIA() {
  const header = document.querySelector("header.Header");
  if (!header) return console.warn(noHeaderLog);

  header.querySelector("button.love-btn")?.setAttribute("aria-label", "support me");
  header.querySelector("button.stats-btn")?.setAttribute("aria-label", "personal statistics");
  header.querySelector("button.about-btn")?.setAttribute("aria-label", "about");
  header.querySelector("button.how-to-play-btn")?.setAttribute("aria-label", "how to play");
}

function setClueButtonsARIA() {
  const buttons = document.querySelector("div.current-game div.image-selector");
  if (!buttons) return console.warn(noHeaderLog);

  buttons.querySelectorAll("button")?.forEach(button => {
    button.setAttribute("aria-label", button.innerText + " clue");
    button.setAttribute("tabindex", "0");
    if (button.className.includes("locked")) button.setAttribute("disabled", "");
  });

  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const button = mutation.target;
      if (!(button instanceof HTMLButtonElement)) return;
      if (!button.className.includes("locked")) button.removeAttribute("disabled");
    });
  }).observe(buttons, {
    attributes: true,
    attributeFilter: ["class"],
    subtree: true,
  });
}
