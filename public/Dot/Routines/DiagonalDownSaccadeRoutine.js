let timeSinceLastJump = 0;
let isOnBottomRight = false;
export const DiagonalDownSaccadeRoutine = {
    Execute: function (dot) {
        timeSinceLastJump += dot.dTime;
        const jumpInterval = 1 / Math.max(dot.velocity, 0.01);
        if (timeSinceLastJump >= jumpInterval) {
            isOnBottomRight = !isOnBottomRight;
            timeSinceLastJump = 0;
        }
        if (isOnBottomRight) {
            dot.X = dot.halfScreen + dot.range;
            dot.Y = dot.halfScreen + dot.range;
        }
        else {
            dot.X = dot.halfScreen - dot.range;
            dot.Y = dot.halfScreen - dot.range;
        }
    },
    title: 'Diagonal Saccades ↘',
    duration: 30,
};
