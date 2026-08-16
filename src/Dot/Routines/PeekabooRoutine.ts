import { Dot } from "../Dot.js";
import { IDotRoutine } from "../IDotRoutine.js";
import { GetRandomNumberInBetween } from "../../Utils/NumberUtils.js";

const relativeSpawnTime:number = 1.7;
let relativeTimeLeft = relativeSpawnTime;

export const PeekabooRoutine : IDotRoutine = {
  Execute: function(dot: Dot) {
    relativeTimeLeft -= dot.dTime * dot.velocity;
    if(relativeTimeLeft < 0) {
      relativeTimeLeft = relativeSpawnTime;
      dot.X = GetRandomNumberInBetween(-dot.range, dot.range) + dot.halfScreen;
      dot.Y = GetRandomNumberInBetween(-dot.range, dot.range) + dot.halfScreen;
    }
  },
  title: 'Peeka-boo!',
  duration: 30,
};
