let timeSinceLastJump = 0;
let isOnRightSide = false;
let horizontalHeight = 50;
window.addEventListener('Game:VerticalPositionChanged', (event) => {
    horizontalHeight = parseFloat(event.detail.height);
});
export const HorizontalSaccadeRoutine = {
    Execute: function (dot) {
        timeSinceLastJump += dot.dTime;
        const jumpInterval = 1 / Math.max(dot.velocity, 0.01);
        if (timeSinceLastJump >= jumpInterval) {
            isOnRightSide = !isOnRightSide;
            timeSinceLastJump = 0;
        }
        dot.X = isOnRightSide ? dot.halfScreen + dot.range : dot.halfScreen - dot.range;
        dot.Y = 100 - horizontalHeight;
    },
    title: 'Horizontal Saccades',
    duration: 30,
};
