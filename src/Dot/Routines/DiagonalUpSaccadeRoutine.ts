import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

let timeSinceLastJump:number = 0;
let isOnBottomLeft:boolean = false;

export const DiagonalUpSaccadeRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    timeSinceLastJump += dot.dTime;
    const jumpInterval = 1 / Math.max(dot.velocity, 0.01);
    if(timeSinceLastJump >= jumpInterval) {
      isOnBottomLeft = !isOnBottomLeft;
      timeSinceLastJump = 0;
    }
    if(isOnBottomLeft) {
      dot.X = dot.halfScreen - dot.range;
      dot.Y = dot.halfScreen + dot.range;
    } else {
      dot.X = dot.halfScreen + dot.range;
      dot.Y = dot.halfScreen - dot.range;
    }
  },
  title: 'Diagonal Saccades ↙',
  duration: 30,
};
