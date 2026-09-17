import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

let timeSinceLastJump:number = 0;
let isOnRightSide:boolean = false;
let horizontalHeight:number = 50;

window.addEventListener('Game:VerticalPositionChanged', (event: Event) => {
  horizontalHeight = parseFloat((event as CustomEvent).detail.height);
});

export const HorizontalSaccadeRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    timeSinceLastJump += dot.dTime;
    const jumpInterval = 1 / Math.max(dot.velocity, 0.01);
    if(timeSinceLastJump >= jumpInterval) {
      isOnRightSide = !isOnRightSide;
      timeSinceLastJump = 0;
    }
    dot.X = isOnRightSide ? dot.halfScreen + dot.range : dot.halfScreen - dot.range;
    dot.Y = 100 - horizontalHeight;
  },
  title: 'Horizontal Saccades',
  duration: 30,
};
