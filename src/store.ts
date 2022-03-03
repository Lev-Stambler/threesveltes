import { Writable, writable } from "svelte/store";
import type { Scene } from "svelthree-three";
import type { Object3D } from "svelthree-three";

export const parameters = writable({
  yaw: {
    n: 13,
    d: 27,
    b: 10,
  },
  pitch: {
    n: 7,
    d: 9,
    b: 10,
  },
  distance: {
    n: 8,
    d: 9,
    b: 10,
  },
  sleepTimeMs: 10
});

export const lines = writable([] as Object3D[]);
export const scene: Writable<null | Scene> = writable(null);
