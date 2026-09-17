import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

let lastPhaseAngle:number = 0;
let horizontalHeight:number = 50;

window.addEventListener('Game:VerticalPositionChanged', (event: Event) => {
  horizontalHeight = parseFloat((event as CustomEvent).detail.height);
});

export const LeftRightRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    const newPhaseAngle:number = dot.dTime * dot.velocity + lastPhaseAngle;
    dot.X = dot.halfScreen + (dot.range * Math.cos(newPhaseAngle));
    dot.Y = 100 - horizontalHeight;
    lastPhaseAngle = newPhaseAngle;
  },
  title: 'Left Right Left',
  duration: 15,
};
