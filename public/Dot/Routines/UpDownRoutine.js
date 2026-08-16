let lastPhaseAngle = 0;
export const UpDownRoutine = {
    Execute: function (dot) {
        const newPhaseAngle = dot.dTime * dot.velocity + lastPhaseAngle;
        dot.X = dot.halfScreen;
        dot.Y = dot.halfScreen + (dot.range * Math.cos(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle;
    },
    title: 'Yo-yo',
    duration: 15,
};
