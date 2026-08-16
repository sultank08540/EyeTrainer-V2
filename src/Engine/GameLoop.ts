import { GameElement } from "./GameElement.js";

let lastTimestamp:number | null = null;

const loop = (timestamp:number) => {
  if(lastTimestamp === null) lastTimestamp = timestamp;
  const dTime = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
  lastTimestamp = timestamp;

  for(const element of GameElement.instances) {
    element.Update(dTime);
  }

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
