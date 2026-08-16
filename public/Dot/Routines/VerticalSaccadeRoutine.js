let timeSinceLastJump = 0;
let isOnBottom = false;
export const VerticalSaccadeRoutine = {
    Execute: function (dot) {
        timeSinceLastJump += dot.dTime;
        const jumpInterval = 1 / Math.max(dot.velocity, 0.01);
        if (timeSinceLastJump >= jumpInterval) {
            isOnBottom = !isOnBottom;
            timeSinceLastJump = 0;
        }
        dot.X = dot.halfScreen;
        dot.Y = isOnBottom ? dot.halfScreen + dot.range : dot.halfScreen - dot.range;
    },
    title: 'Vertical Saccades',
    duration: 30,
};
