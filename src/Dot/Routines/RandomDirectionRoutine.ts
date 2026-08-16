import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";

let directionAngle:number = Math.random() * Math.PI * 2;
let timeUntilDirectionChange:number = 0;
let timePassed:number = 0;

const minimumDirectionTime:number = 0.4;
const maximumDirectionTime:number = 1.5;

const chooseNewDirection = () => {
  directionAngle = Math.random() * Math.PI * 2;
  timeUntilDirectionChange =
    minimumDirectionTime +
    Math.random() * (maximumDirectionTime - minimumDirectionTime);
  timePassed = 0;
};

chooseNewDirection();

export const RandomDirectionRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    timePassed += dot.dTime;

    if(timePassed >= timeUntilDirectionChange) {
      chooseNewDirection();
    }

    const movementSpeed = dot.velocity * 10;
    let velocityX = Math.cos(directionAngle) * movementSpeed;
    let velocityY = Math.sin(directionAngle) * movementSpeed;

    dot.X += velocityX * dot.dTime;
    dot.Y += velocityY * dot.dTime;

    const minBoundary = dot.halfScreen - dot.range;
    const maxBoundary = dot.halfScreen + dot.range;

    if(dot.X <= minBoundary) {
      dot.X = minBoundary;
      velocityX = Math.abs(velocityX);
      directionAngle = Math.atan2(velocityY, velocityX);
    } else if(dot.X >= maxBoundary) {
      dot.X = maxBoundary;
      velocityX = -Math.abs(velocityX);
      directionAngle = Math.atan2(velocityY, velocityX);
    }

    if(dot.Y <= minBoundary) {
      dot.Y = minBoundary;
      velocityY = Math.abs(velocityY);
      directionAngle = Math.atan2(velocityY, velocityX);
    } else if(dot.Y >= maxBoundary) {
      dot.Y = maxBoundary;
      velocityY = -Math.abs(velocityY);
      directionAngle = Math.atan2(velocityY, velocityX);
    }
  },
  title: 'Random Directions',
  duration: 30,
};
