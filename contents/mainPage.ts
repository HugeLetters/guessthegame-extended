import type { PlasmoCSConfig } from "plasmo";

import "../source/index.pcss";

import { setARIA } from "~source/ARIA";
import { setControls } from "~source/controls";
import { getOption } from "~source/helpers/options";
import { setHotkeysModal } from "~source/hotkeysModal";
import { setSearchBar } from "~source/searchBarResults";
import { setTopNavigation } from "~source/topNavigation";

export const config: PlasmoCSConfig = {
  matches: ["https://guessthe.game/", "https://guessthe.game/?fpg=*"],
  run_at: "document_end",
  all_frames: true,
};

(function () {
  getOption("ARIA fixes").then((toggle = true) => toggle && setARIA());
  getOption("Controls").then((toggle = true) => toggle && setControls());
  getOption("Search Bar tips").then((toggle = true) => toggle && setSearchBar());
  getOption("Top Navigation").then((toggle = true) => toggle && setTopNavigation());
  getOption("Hotkeys info menu").then((toggle = true) => toggle && setHotkeysModal());
})();
