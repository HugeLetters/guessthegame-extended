import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";

type ExtensionStorage = ToggleStorageOptions;

export function useOptions<K extends keyof ExtensionStorage>(
  key: K,
  initialValue?: Parameters<typeof useStorage<ExtensionStorage[K]>>[1]
) {
  return useStorage(key, initialValue);
}

export const toggleStorageOptions = [
  "Top Navigation",
  "Controls",
  "ARIA fixes",
  "Search Bar tips",
  "Hotkeys info menu",
] as const;
export type ToggleStorageOptions = {
  [key in (typeof toggleStorageOptions)[number]]: boolean;
};

const optionsStorage = new Storage();
export function getOption<K extends keyof ExtensionStorage>(key: K) {
  return optionsStorage.get<ExtensionStorage[K] | undefined>(key);
}
