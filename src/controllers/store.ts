import { writable } from "svelte/store";
import type { MapInfo } from "../models/map-loader";

export const mainScene = writable()
export const highlighter = writable()
export const map_data = writable<MapInfo>()
export const selected_point = writable();
export const selected_shop = writable();
export const isInEditMode = writable(false);
export const editablePoint = writable();
export const removedRelNodesList = writable([])
