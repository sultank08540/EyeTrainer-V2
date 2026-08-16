let timeSinceLastJump = 0;
let isOnBottomLeft = false;
export const DiagonalUpSaccadeRoutine = {
    Execute: function (dot) {
        timeSinceLastJump += dot.dTime;
        const jumpInterval = 1 / Math.max(dot.velocity, 0.01);
        if (timeSinceLastJump >= jumpInterval) {
            isOnBottomLeft = !isOnBottomLeft;
            timeSinceLastJump = 0;
        }
        if (isOnBottomLeft) {
            dot.X = dot.halfScreen - dot.range;
            dot.Y = dot.halfScreen + dot.range;
        }
        else {
            dot.X = dot.halfScreen + dot.range;
            dot.Y = dot.halfScreen - dot.range;
        }
    },
    title: 'Diagonal Saccades ↙',
    duration: 30,
};
