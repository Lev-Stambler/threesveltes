import { Writable, writable } from "svelte/store";
import type { Scene } from "svelthree-three";
import type { Object3D } from "svelthree-three";
import type { Angle } from "./interfaces";
import {
  getRationalAngleIterator,
  getRationalDistanceIterator,
} from "./math/rationals";

type Parameters = {
  angles: Angle[];
  distance: IterableIterator<number>;
  sleepTimeMs: number;
};

export const parameters: Writable<Parameters> = writable({
  angles: [
    {
      iterator: getRationalAngleIterator({
        n: 13,
        d: 27,
        b: 10,
      }),
      base: 10,
      usage: [
        {
          dimension: "X",
          angleFn: "sin",
        },
        {
          dimension: "Y",
          angleFn: "cos",
        },
      ],
    },
    {
      iterator: getRationalAngleIterator({
        n: 7,
        d: 9,
        b: 10,
      }),
      base: 10,
      usage: [
        {
          dimension: "X",
          angleFn: "cos",
        },
        {
          dimension: "Y",
          angleFn: "sin",
        },
        {
          dimension: "Z",
          angleFn: "sin",
        },
      ],
    },
  ] as Angle[],
  distance: getRationalDistanceIterator({
    n: 8,
    d: 9,
    b: 10,
  }),
  sleepTimeMs: 10,
});

export const lines = writable([] as Object3D[]);
export const scene: Writable<null | Scene> = writable(null);
