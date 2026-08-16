import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

let timeSinceLastJump:number = 0;
let isOnBottom:boolean = false;

export const VerticalSaccadeRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    timeSinceLastJump += dot.dTime;
    const jumpInterval = 1 / Math.max(dot.velocity, 0.01);
    if(timeSinceLastJump >= jumpInterval) {
      isOnBottom = !isOnBottom;
      timeSinceLastJump = 0;
    }
    dot.X = dot.halfScreen;
    dot.Y = isOnBottom ? dot.halfScreen + dot.range : dot.halfScreen - dot.range;
  },
  title: 'Vertical Saccades',
  duration: 30,
};
