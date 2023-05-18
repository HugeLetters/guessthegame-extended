import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { MdOutlineKeyboardAlt } from "react-icons/md";

import { getOption, setOption, useOptions, watchOption } from "./helpers/options";

export function setHotkeysModal() {
  let disable: () => void = () => void 0;
  watchOption("hotkeyModal", ({ newValue = true }) => {
    newValue ? (disable = enable()) : disable();
  });
  getOption("hotkeyModal").then((value) => {
    if (value) disable = enable();
    value ?? setOption("hotkeyModal", true);
  });
}

function enable() {
  const anchor = document.querySelector("header.Header") ?? document.body;
  const root = document.createElement("div");
  anchor.appendChild(root);
  createRoot(root).render(<HotkeysModal />);

  return function disable() {
    anchor.removeChild(root);
  };
}

function HotkeysModal() {
  const modal = useRef<HTMLDialogElement>(null);
  const [topNavOption] = useOptions("topNav", (v) => v ?? true);
  const [controlsOption] = useOptions("controls", (v) => v ?? true);

  function openModal() {
    modal.current?.showModal();
  }
  function closeModal() {
    modal.current?.close();
  }

  return (
    <>
      <button onClick={openModal} aria-label="hotkeys">
        <MdOutlineKeyboardAlt size="100%" />
      </button>
      <dialog className="modal backdrop:backdrop-brightness-[.25]" ref={modal} onClick={closeModal}>
        <div
          className="absolute left-0 top-0 -z-10 h-full w-full"
          onClick={(e) => e.stopPropagation()}
        ></div>
        <div onClick={(e) => e.stopPropagation()}>
          <h3>Hotkeys</h3>
          <button onClick={closeModal} aria-label="close">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="flex flex-col gap-2">
            <Hotkey keybind="←/→" description="previous/next game" />
            <Hotkey keybind="ctrl+↓" description="latest game" />
            {topNavOption && <Hotkey keybind="ctrl+↓" description="latest game" />}
            {controlsOption && (
              <>
                <Hotkey keybind="ctrl+←/→" description="previous/next clue" />
                <Hotkey keybind="1..6" description="go to clue by index" />
                <Hotkey keybind="alt+s" description="skip guess" />
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

type HotkeyProps = {
  keybind: string;
  description: string;
};
function Hotkey({ keybind, description }: HotkeyProps) {
  return (
    <p className="m-0">
      <code className="text-lg">{keybind}</code> - {description}
    </p>
  );
}
