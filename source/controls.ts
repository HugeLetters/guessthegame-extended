import { getOption, setOption, watchOption } from "./helpers/options";

export function setControls() {
  watchOption("controls", ({ newValue = true }) => {
    newValue ? enable() : disable();
  });
  getOption("controls").then((value) => {
    if (value) return enable();
    value ?? setOption("controls", true);
  });
}

function enable() {
  document.addEventListener("keydown", controlEventListener);
}
function disable() {
  document.removeEventListener("keydown", controlEventListener);
}

function controlEventListener(event: KeyboardEvent) {
  if (event.ctrlKey) {
    if (event.key === "ArrowLeft") return moveClue(-1);
    if (event.key === "ArrowRight") return moveClue(1);
    return;
  }
  if (event.altKey) {
    if (event.code === "KeyS") return skip();
    return;
  }
  if (!document.activeElement?.className.includes("game-input")) {
    const index = parseInt(event.key) - 1;
    if (!isNaN(index)) goToClue(index);
  }
}

let clueButtons = document.querySelectorAll<HTMLButtonElement>(
  "div.current-game div.image-selector button:not(.skipButton)"
);
function getclueButtons() {
  if (clueButtons.length) return clueButtons;
  clueButtons = document.querySelectorAll<HTMLButtonElement>(
    "div.current-game div.image-selector button:not(.skipButton)"
  );
  return clueButtons;
}
function moveClue(direction: 1 | -1) {
  const clueButtons = getclueButtons();
  if (!clueButtons.length) return;

  const activeClueIndex = Array.from(clueButtons).findIndex((button) =>
    button.className.includes("active")
  );
  clueButtons[activeClueIndex + direction]?.click();
}
function goToClue(index: number) {
  const clueButtons = getclueButtons();
  if (!clueButtons.length) return;

  clueButtons[index]?.click();
}

let skipButton = document.querySelector<HTMLButtonElement>(
  "div.current-game div.image-selector button.skipButton"
);
function getSkipButton() {
  if (skipButton) return skipButton;
  skipButton = document.querySelector<HTMLButtonElement>(
    "div.current-game div.image-selector button.skipButton"
  );
  return skipButton;
}
function skip() {
  const skipButton = getSkipButton();
  if (!skipButton) return;
  skipButton.click();
}
