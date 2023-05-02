import cssText from "data-text:./searchBar.pcss";
import type { PlasmoCSConfig, PlasmoMountShadowHost } from "plasmo";
import type { PlasmoGetShadowHostId } from "plasmo";
import type { PlasmoGetInlineAnchor } from "plasmo";
import { HiArrowDown, HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { IconContext } from "react-icons/lib";

import { getGameStatus } from "../utils/utils";

export const config: PlasmoCSConfig = {
  matches: ["https://guessthe.game/", "https://guessthe.game/?fpg=*"],
  run_at: "document_end",
  all_frames: true,
};

export const getStyle = () => {
  console.log("Getting style");
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const mountShadowHost: PlasmoMountShadowHost = ({ anchor, shadowHost }) => {
  console.log("Mounting shadow host");
  if (!anchor) return;
  anchor.element.innerHTML = "";
  anchor.element.appendChild(shadowHost);
};

const gameAnchor = document.querySelector<HTMLDivElement>(
  "div.current-game>div.current-game-number"
);

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  console.log("Getting inline anchor");
  if (!gameAnchor) throw new Error("No element with current game index found");
  return gameAnchor;
};
export const getShadowHostId: PlasmoGetShadowHostId = () => "custom-top-navbar";

const winClass = " bg-win";
const loseClass = " bg-fail";
export default function NavigationMenu() {
  console.log("Setting top navbar");

  if (!gameAnchor) return <></>;
  const latestIndex = getLatestGameIndex();
  const index = parseInt(gameAnchor.innerText.match(/\d+/)?.[0] ?? "") || latestIndex;

  const prevGameStatus = getGameStatus(index - 1);
  const nextGameStatus = getGameStatus(index + 1);
  const lastGameStatus = getGameStatus(latestIndex);

  return (
    <nav className="flex items-center justify-center gap-1 text-neutral-400 mb-2 ">
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
        <label className=" p-1 border border-solid rounded-md text-lg">
          <span className="text-lg">Game #</span>
          <select
            onChange={({ target: { value } }) => redirectToGameByIndex(parseInt(value))}
            defaultValue={index}
            className="bg-transparent text-current border-none text-lg font-[inherit]"
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
          } ${index + 1 > latestIndex ? "border-dashed border-2 border-amber-400" : ""}`}
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

function redirectToGameByIndex(index: number) {
  const destination = new URL("", location.href);
  destination.searchParams.append("fpg", index.toString());
  location.assign(destination);
}

function getLatestGameIndex() {
  return Math.ceil(
    Math.abs((new Date().valueOf() - new Date("5/15/2022").valueOf()) / (24 * 60 * 60 * 1000))
  );
}
