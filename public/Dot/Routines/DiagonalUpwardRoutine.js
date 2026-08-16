let lastPhaseAngle = 0;
export const DiagonalUpwardRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen + (-dot.range * Math.sin(newPhaseAngle));
        dot.Y = dot.halfScreen + (dot.range * Math.sin(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'Diagonal Upward',
    duration: 15,
};
