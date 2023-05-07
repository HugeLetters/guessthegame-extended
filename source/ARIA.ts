import fastdom from "fastdom";

export function setARIA() {
  setHeaderARIA();
  setClueButtonsARIA();
  setClueImagesARIA();
  setBottomNavARIA();
}

function setBottomNavARIA() {
  const bottomNav = document.querySelector("div.countdownControls");
  if (!bottomNav) return;

  fastdom.mutate(() => {
    bottomNav
      .querySelector("button:has(span[class*='backward'])")
      ?.setAttribute("aria-label", "previous game");
    bottomNav
      .querySelector("button:has(span[class*='forward'])")
      ?.setAttribute("aria-label", "next game");
  });
}

function setClueImagesARIA() {
  const imageDiv = document.querySelector("div.image-area");
  if (!imageDiv) return;

  imageDiv.querySelectorAll("img").forEach((image) =>
    fastdom.mutate(() => {
      image.setAttribute("alt", "videogame screenshot clue");
    })
  );
}

function setHeaderARIA() {
  const header = document.querySelector("header.Header");
  if (!header) return;

  fastdom.mutate(() => {
    header.querySelector("button.love-btn")?.setAttribute("aria-label", "support me");
    header.querySelector("button.stats-btn")?.setAttribute("aria-label", "personal statistics");
    header.querySelector("button.about-btn")?.setAttribute("aria-label", "about");
    header.querySelector("button.how-to-play-btn")?.setAttribute("aria-label", "how to play");
  });
}

function setClueButtonsARIA() {
  const buttons = document.querySelector("div.current-game div.image-selector");
  if (!buttons) return;

  fastdom.measure(() => {
    buttons.querySelectorAll("button")?.forEach((button) => {
      const text = button.innerText;
      const className = button.className;
      fastdom.mutate(() => {
        button.setAttribute("aria-label", text + " clue");
        button.removeAttribute("tabindex");
        if (className.includes("locked")) button.setAttribute("disabled", "");
      });
    });
  });

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      fastdom.mutate(() => {
        const button = mutation.target;
        if (!(button instanceof HTMLButtonElement) || button.className.includes("locked")) return;
        button.removeAttribute("disabled");
      });
    });
  }).observe(buttons, {
    attributes: true,
    attributeFilter: ["class"],
    subtree: true,
  });
}
