import {
  run,
  pipe,
  background,
  circle,
  scale,
  range,
  translate,
  Sketch,
} from "./framework";

const sketch1 = (time: number) => {
  const x = 50 + 25 * Math.cos(time / 300);
  const y = 50 + 25 * Math.sin(time / 300);
  return pipe(background("black"), circle(x, y, 10, "white"));
};

const tile = (tiles: number, sketch: Sketch) => (time: number) => {
  const shrunk = (x: number, y: number) =>
    translate(x, y, scale(1 / tiles, 1 / tiles, sketch(time + x * y)));
  return pipe(
    ...range(0, tiles ** 2).map((i) => {
      const xPos = ((i % tiles) * 100) / tiles;
      const yPos = (Math.floor(i / tiles) * 100) / tiles;
      return shrunk(xPos, yPos);
    })
  );
};

run(tile(10, sketch1));
