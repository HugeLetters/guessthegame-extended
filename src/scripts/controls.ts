import { clueSelectionDiv, prefixLogMessage } from "./utils";

export default function addControls() {
  document.addEventListener("keydown", event => {
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
      if (isNaN(index)) return;
      goToClue(index);
    }
  });
}

const noActiveButtonLog = prefixLogMessage("Couldn't find clue selection buttons");

function moveClue(direction: 1 | -1) {
  if (!clueSelectionDiv) return;
  const clueButtons =
    clueSelectionDiv.querySelectorAll<HTMLButtonElement>("button:not(.skipButton)");
  if (!clueButtons) return console.error(noActiveButtonLog);
  const activeClueIndex = Array.from(clueButtons).findIndex(button =>
    button.className.includes("active")
  );
  clueButtons[activeClueIndex + direction]?.click();
}
function goToClue(index: number) {
  if (!clueSelectionDiv) return;
  const clueButtons =
    clueSelectionDiv.querySelectorAll<HTMLButtonElement>("button:not(.skipButton)");
  if (!clueButtons) return console.error(noActiveButtonLog);
  clueButtons[index]?.click();
}

const skipButton = clueSelectionDiv?.querySelector<HTMLButtonElement>("button.skipButton");
const noSkipButtonLog = prefixLogMessage("Couldn't find skip button");
function skip() {
  if (!skipButton) return console.error(noSkipButtonLog);
  skipButton.click();
}
