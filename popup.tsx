import {
  type ToggledOptions,
  optionsMeta,
  toggledOptions,
  useOptions,
} from "~source/helpers/options";

import "./source/index.pcss";

export default function Popup() {
  return (
    <div className="bg-neutral-700 text-slate-200 font-semibold p-2">
      <style>{`body{margin:0;}`}</style>
      <div className="flex flex-col gap-2 ">
        {toggledOptions.map((option) => (
          <ToggleOption key={option} optionKey={option} />
        ))}
      </div>
      <p className="m-0 mt-2 text-center text-[90%]">
        Options with a red border require a page reload for the change to take effect
      </p>
    </div>
  );
}

type ToggleOptionProps = {
  optionKey: keyof ToggledOptions;
};
function ToggleOption({ optionKey }: ToggleOptionProps) {
  const [option, setOption] = useOptions(optionKey, (v) => v ?? true);

  return (
    <label
      className={` flex gap-1 border border-solid border-current rounded-md p-2 ${
        optionsMeta[optionKey].needsRestart && "border-red-500"
      }`}
    >
      <input
        className="accent-neutral-800 m-0"
        type="checkbox"
        checked={option}
        onChange={({ target: { checked } }) => setOption(checked)}
      />
      <span className="whitespace-nowrap">{optionsMeta[optionKey].label}</span>
    </label>
  );
}
