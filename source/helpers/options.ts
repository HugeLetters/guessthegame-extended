import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";

type OptionMeta = {
  readonly label: string;
  readonly needsRestart?: boolean;
};
type OptionsMeta = {
  readonly topNav: OptionMeta;
  readonly controls: OptionMeta;
  readonly aria: OptionMeta;
  readonly searchBar: OptionMeta;
  readonly hotkeyModal: OptionMeta;
};
export const optionsMeta: OptionsMeta = {
  controls: { label: "Controls" },
  topNav: { label: "Top navigation" },
  hotkeyModal: { label: "Hotkeys info menu" },
  aria: { label: "ARIA fixes", needsRestart: true },
  searchBar: { label: "Search Bar tips", needsRestart: true },
};

export const toggledOptions = [
  "topNav",
  "controls",
  "aria",
  "searchBar",
  "hotkeyModal",
] as const satisfies readonly (keyof typeof optionsMeta)[];

export type ToggledOptions = {
  [key in (typeof toggledOptions)[number]]: boolean;
};

type OptionsUnion = ToggledOptions;
type ExtensionOptions = keyof OptionsMeta extends keyof OptionsUnion ? OptionsUnion : never;

export function useOptions<K extends keyof ExtensionOptions>(
  key: K,
  initialValue?: Parameters<typeof useStorage<ExtensionOptions[K]>>[1]
) {
  return useStorage(key, initialValue);
}

const optionsStorage = new Storage();
export function getOption<K extends keyof ExtensionOptions>(key: K) {
  return optionsStorage.get<ExtensionOptions[K] | undefined>(key);
}
export function setOption<K extends keyof ExtensionOptions>(key: K, value: ExtensionOptions[K]) {
  optionsStorage.set(key, value);
}
export function watchOption<K extends keyof ExtensionOptions>(
  key: K,
  callback: (payload: { newValue?: ExtensionOptions[K]; oldValue?: ExtensionOptions[K] }) => void
) {
  return optionsStorage.watch({ [key]: callback });
}
