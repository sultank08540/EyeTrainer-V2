let timeSinceLastJump = 0;
let isOnRightSide = false;
export const HorizontalSaccadeRoutine = {
    Execute: function (dot) {
        timeSinceLastJump += dot.dTime;
        const jumpInterval = 1 / Math.max(dot.velocity, 0.01);
        if (timeSinceLastJump >= jumpInterval) {
            isOnRightSide = !isOnRightSide;
            timeSinceLastJump = 0;
        }
        dot.X = isOnRightSide ? dot.halfScreen + dot.range : dot.halfScreen - dot.range;
        dot.Y = dot.halfScreen;
    },
    title: 'Horizontal Saccades',
    duration: 30,
};
