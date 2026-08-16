let lastPhaseAngle = 0;
export const ClockwiseRotationRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (dot.range * Math.cos(newPhaseAngle));
        dot.Y = dot.halfScreen + (dot.range * Math.sin(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle % (2 * Math.PI);
    },
    title: 'Clockwise Rotation',
    duration: 15,
};
