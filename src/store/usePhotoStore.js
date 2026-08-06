import { useSyncExternalStore } from "react";
import { getState, subscribe } from "./photoStore";

export function usePhotoStore() {
  return useSyncExternalStore(subscribe, getState, getState);
}