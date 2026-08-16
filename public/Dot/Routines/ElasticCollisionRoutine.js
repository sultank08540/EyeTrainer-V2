const randomPhaseAngleInRadians = Math.random() * 2 * Math.PI;
const elasticCollisionMultiplier = 10;
let velocityX = Math.cos(randomPhaseAngleInRadians) * elasticCollisionMultiplier;
let velocityY = Math.sin(randomPhaseAngleInRadians) * elasticCollisionMultiplier;
export const ElasticCollisionRoutine = {
    Execute: function (dot) {
        const minBoundary = dot.halfScreen - dot.range;
        const maxBoundary = dot.halfScreen + dot.range;
        dot.X += velocityX * dot.velocity * dot.dTime;
        dot.Y += velocityY * dot.velocity * dot.dTime;
        if (dot.Y + dot.Radius >= maxBoundary || dot.Y - dot.Radius <= minBoundary) {
            velocityY = -velocityY;
            dot.Y = Math.min(maxBoundary - dot.Radius, Math.max(minBoundary + dot.Radius, dot.Y));
        }
        if (dot.X + dot.Radius >= maxBoundary || dot.X - dot.Radius <= minBoundary) {
            velocityX = -velocityX;
            dot.X = Math.min(maxBoundary - dot.Radius, Math.max(minBoundary + dot.Radius, dot.X));
        }
    },
    title: 'DVD',
    duration: 30,
};
