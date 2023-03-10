export const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, i) => i + start);

export const circle =
  (x: number, y: number, radius: number, color = "") =>
  (ctx: CanvasRenderingContext2D) => {
    if (color != "") ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

export const pipe =
  (...fns: ((ctx: CanvasRenderingContext2D) => void)[]) =>
  (ctx: CanvasRenderingContext2D) =>
    fns.forEach((fn) => fn(ctx));

export const background =
  (color: string) => (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

export const scale =
  (x: number, y: number, fx: Drawer) => (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.scale(x, y);
    fx(ctx);
    ctx.restore();
  };

export const translate =
  (x: number, y: number, fx: Drawer) => (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(x, y);
    fx(ctx);
    ctx.restore();
  };

type Drawer = (ctx: CanvasRenderingContext2D) => void;

export type Sketch = (time: number) => Drawer;

export function run(draw: (time: number) => Drawer, container = "sketch") {
  const containerElement = document.getElementById(container);
  if (!containerElement)
    throw new Error(`Container element with id ${container} not found`);
  const canvas = document.createElement("canvas");
  containerElement.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function loop() {
    if (!containerElement) throw new Error("Container element not found");
    const minSize = Math.min(
      containerElement.getBoundingClientRect().height,
      containerElement.getBoundingClientRect().width
    );
    canvas.style.width = `${minSize}px`;
    canvas.style.height = `${minSize}px`;
    canvas.width = minSize * window.devicePixelRatio;
    canvas.height = minSize * window.devicePixelRatio;
    if (!ctx) throw new Error("Could not get canvas context");
    const time = new Date().getTime();
    ctx.resetTransform();
    ctx.scale(canvas.width / 100, canvas.height / 100);
    draw(time)(ctx);
    requestAnimationFrame(loop);
  }
  loop();
}
