let lastPhaseAngle = 0;
let horizontalHeight = 50;
window.addEventListener('Game:VerticalPositionChanged', (event) => {
    horizontalHeight = parseFloat(event.detail.height);
});
export const LeftRightRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (dot.range * Math.cos(newPhaseAngle));
        dot.Y = 100 - horizontalHeight;
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'Left Right Left',
    duration: 15,
};
