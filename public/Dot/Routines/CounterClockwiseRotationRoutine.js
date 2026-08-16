let lastPhaseAngle = 0;
export const CounterClockwiseRotationRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (dot.range * Math.sin(newPhaseAngle));
        dot.Y = dot.halfScreen + (dot.range * Math.cos(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle % (2 * Math.PI);
    },
    title: 'Counter Clockwise Rotation',
    duration: 15,
};
