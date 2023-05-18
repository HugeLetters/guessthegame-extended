import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HiArrowDown, HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { IconContext } from "react-icons/lib";

import { getOption, setOption, watchOption } from "./helpers/options";
import { getGameStatus, getLatestGameIndex, redirectToGameByIndex } from "./helpers/utils";

export function setTopNavigation() {
  let disable: () => void = () => void 0;
  watchOption("topNav", ({ newValue = true }) => {
    newValue ? (disable = enable()) : disable();
  });
  getOption("topNav").then((value) => {
    if (value) disable = enable();
    value ?? setOption("topNav", true);
  });
}

function enable() {
  const anchor = document.querySelector<HTMLDivElement>("div.current-game>div.current-game-number");
  if (!anchor) throw new Error("No anchor found for top navbar");
  const style = anchor.getAttribute("style") ?? "";
  setTimeout(() => anchor.removeAttribute("style"));

  const latestIndex = getLatestGameIndex();
  const index = parseInt(anchor.innerText.match(/\d+/)?.[0] ?? "") || latestIndex;

  const root = createRoot(anchor);
  root.render(<NavigationMenu index={index} latestIndex={latestIndex} />);

  return function disable() {
    root.unmount();
    anchor.innerText = `Game #${index}`;
    anchor.setAttribute("style", style);
  };
}

type NavigationMenuProps = { index: number; latestIndex: number };
function NavigationMenu({ index, latestIndex }: NavigationMenuProps) {
  const winClass = " bg-win";
  const loseClass = " bg-fail";
  const prevGameStatus = getGameStatus(index - 1);
  const nextGameStatus = getGameStatus(index + 1);
  const lastGameStatus = getGameStatus(latestIndex);

  useEffect(() => {
    function handleArrowKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "ArrowDown") return redirectToGameByIndex(latestIndex);
      if (e.shiftKey || e.ctrlKey || e.altKey) return;
      if (index + 1 > latestIndex && e.key === "ArrowRight")
        return redirectToGameByIndex(index + 1);
    }
    document.addEventListener("keydown", handleArrowKey);
    return () => document.removeEventListener("keydown", handleArrowKey);
  }, []);

  return (
    <nav className="mb-2 flex items-center justify-center gap-1 text-neutral-400 ">
      <IconContext.Provider value={{ size: "1.9rem" }}>
        <button
          onClick={() => redirectToGameByIndex(index - 1)}
          disabled={!(index - 1)}
          className={`rounded-md ${
            prevGameStatus === "win"
              ? winClass
              : prevGameStatus === "lose"
              ? loseClass
              : "bg-transparent text-current"
          } ${!(index - 1) ? "brightness-50" : ""}`}
          aria-label="previous game"
        >
          <HiArrowLeft />
        </button>
        <label className=" rounded-md border border-solid p-1 text-lg">
          <span className="text-lg">Game #</span>
          <select
            onChange={({ target: { value } }) => redirectToGameByIndex(parseInt(value))}
            defaultValue={index}
            className="border-none bg-transparent font-[inherit] text-lg text-current"
          >
            {Array(Math.max(latestIndex, index))
              .fill(1)
              .map((_, i) => {
                const index = i + 1;
                const status = getGameStatus(index);
                return (
                  <option
                    key={i}
                    value={index}
                    className={` ${
                      status === "win"
                        ? winClass + " text-white"
                        : status === "lose"
                        ? loseClass + " text-white"
                        : "text-neutral-800"
                    }`}
                  >
                    {index}
                  </option>
                );
              })}
          </select>
        </label>
        <button
          onClick={() => redirectToGameByIndex(index + 1)}
          className={`rounded-md ${
            nextGameStatus === "win"
              ? winClass
              : nextGameStatus === "lose"
              ? loseClass
              : "bg-transparent text-current"
          } ${index + 1 > latestIndex ? "border-2 border-dashed border-amber-400" : ""}`}
          aria-label="next game"
        >
          <HiArrowRight />
        </button>
        <button
          onClick={() => redirectToGameByIndex(latestIndex)}
          className={`rounded-md ${
            lastGameStatus === "win"
              ? winClass
              : lastGameStatus === "lose"
              ? loseClass
              : "bg-transparent text-current"
          }`}
          aria-label="today's game"
        >
          <HiArrowDown />
        </button>
      </IconContext.Provider>
    </nav>
  );
}
