import { GetRandomNumberInBetween } from "../../Utils/NumberUtils.js";
const relativeSpawnTime = 1.7;
let relativeTimeLeft = relativeSpawnTime;
export const PeekabooRoutine = {
    Execute: function (dot) {
        relativeTimeLeft -= dot.dTime * dot.velocity;
        if (relativeTimeLeft < 0) {
            relativeTimeLeft = relativeSpawnTime;
            dot.X = GetRandomNumberInBetween(-dot.range, dot.range) + dot.halfScreen;
            dot.Y = GetRandomNumberInBetween(-dot.range, dot.range) + dot.halfScreen;
        }
    },
    title: 'Peeka-boo!',
    duration: 30,
};
