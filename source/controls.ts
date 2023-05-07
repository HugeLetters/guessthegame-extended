export function setControls() {
  document.addEventListener("keydown", (event) => {
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
  });
}

const clueButtons = document.querySelectorAll<HTMLButtonElement>(
  "div.current-game div.image-selector button:not(.skipButton)"
);
function moveClue(direction: 1 | -1) {
  if (!clueButtons) return;
  const activeClueIndex = Array.from(clueButtons).findIndex((button) =>
    button.className.includes("active")
  );
  clueButtons[activeClueIndex + direction]?.click();
}
function goToClue(index: number) {
  if (!clueButtons) return;
  clueButtons[index]?.click();
}

const skipButton = document.querySelector<HTMLButtonElement>(
  "div.current-game div.image-selector button.skipButton"
);
function skip() {
  if (!skipButton) return;
  skipButton.click();
}
