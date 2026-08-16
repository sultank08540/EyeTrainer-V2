import { GameElement } from "../Engine/GameElement.js";
import RoutineManager from "./DotRoutineManager.js";
export class Dot extends GameElement {
    constructor(dotElement) {
        let gameElementInstance = null;
        super(dotElement, gameElementInstance);
        this.velocity = 3;
        this.range = 25;
        this.dTime = 0;
        this.halfScreen = 50;
        gameElementInstance = this;
        this.dotElement = dotElement;
        window.addEventListener('Game:VelocityValueChanged', (event) => {
            this.velocity = parseFloat(event.detail.velocity);
        });
        window.addEventListener('Game:RadiusValueChanged', (event) => {
            this.Radius = parseFloat(event.detail.radius);
        });
        window.addEventListener('Game:RangeValueChanged', (event) => {
            this.range = parseFloat(event.detail.range);
        });
    }
    get Radius() {
        return parseFloat(getComputedStyle(this.dotElement).getPropertyValue("--radius")) || 2;
    }
    set Radius(value) {
        this.dotElement.style.setProperty("--radius", value.toString());
    }
    Update(dTime) {
        this.dTime = dTime;
        RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].Execute(this);
    }
}
