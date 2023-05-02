import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://guessthe.game/", "https://guessthe.game/?fpg=*"],
  run_at: "document_end",
  all_frames: true,
};

export default function PlasmoTestDiv() {
  return <div></div>;
}
