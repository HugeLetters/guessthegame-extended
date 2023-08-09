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
    switch (toggle) {
      case true:
        setARIA();
        break;
      case undefined:
        setOption("aria", true);
        setARIA();
        break;
    }
  });
  getOption("searchBar").then((toggle) => {
    switch (toggle) {
      case true:
        setSearchBar();
        break;
      case undefined:
        setOption("searchBar", true);
        setSearchBar();
        break;
    }
  });

  /*
    Client-side routing to previous-games page breaks the extensions.
    This is the simplest fix for that, sorry.
  */
  document
    .querySelector<HTMLButtonElement>("button.replay-previous-days")
    ?.addEventListener("click", () => location.assign("/previous-games"));
})();
