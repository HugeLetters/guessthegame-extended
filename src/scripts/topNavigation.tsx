import { getGameStatus, getLatestGameIndex, prefixLogMessage } from "./utils";
import { HiArrowDown, HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { createRoot } from "react-dom/client";
import { IconContext } from "react-icons/lib";

const noGameIndexDivLog = prefixLogMessage("Couldn't find an element with current game index");
const gameIndexDivQuerySelector = "div.current-game>div.current-game-number";

const incorrectGameIndexLog = prefixLogMessage("Game index is in incorrect format");
const winClass = " bg-win";
const loseClass = " bg-fail";

export default function setTopNavigation() {
  const gameIndexDiv = document.querySelector<HTMLDivElement>(gameIndexDivQuerySelector);
  if (!gameIndexDiv) return console.error(noGameIndexDivLog);

  gameIndexDiv.setAttribute("style", "");
  const gameIndex = parseInt(gameIndexDiv.innerText.match(/\d+/)?.[0] ?? "");
  if (isNaN(gameIndex)) console.error(incorrectGameIndexLog);
  const latestGameIndex = getLatestGameIndex();
  createRoot(gameIndexDiv).render(
    <NavigationMenu
      index={gameIndex || latestGameIndex}
      latestIndex={latestGameIndex}
    />
  );
}

type NavigationMenuProps = { index: number; latestIndex: number };
function NavigationMenu({ index, latestIndex }: NavigationMenuProps) {
  const prevGameStatus = getGameStatus(index - 1);
  const nextGameStatus = getGameStatus(index + 1);
  const lastGameStatus = getGameStatus(latestIndex);

  return (
    <nav className="flex items-center justify-center gap-1 text-neutral-400 mb-2">
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
