import type { PlasmoCSConfig } from "plasmo";

import { setARIA } from "~source/ARIA";
import { setControls } from "~source/controls";
import { getOption, setOption } from "~source/helpers/options";
import { setHotkeysModal } from "~source/hotkeysModal";
import { setSearchBar } from "~source/searchBarResults";
import { setTopNavigation } from "~source/topNavigation";

export const config: PlasmoCSConfig = {
  matches: ["https://guessthe.game/", "https://guessthe.game/?fpg=*"],
  run_at: "document_end",
  all_frames: true,
  css: ["../source/index.pcss"],
};

(function () {
  setControls();
  setTopNavigation();
  setHotkeysModal();

  getOption("aria").then((toggle) => {
    if (toggle) return setARIA();
    if (toggle === undefined) return setOption("aria", true), setARIA();
  });
  getOption("searchBar").then((toggle = true) => {
    if (toggle) return setSearchBar();
    if (toggle === undefined) return setOption("searchBar", true), setSearchBar();
  });

  /*
    Client-side routing to previous-games page breaks the extensions.
    This is the simplest fix for that, sorry.
  */
  document
    .querySelector<HTMLButtonElement>("button.replay-previous-days")
    ?.addEventListener("click", () => location.assign("/previous-games"));
})();
