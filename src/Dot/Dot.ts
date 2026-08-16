import { GameElement } from "../Engine/GameElement.js";
import RoutineManager from "./DotRoutineManager.js";

export class Dot extends GameElement
{
  dotElement: HTMLElement;
  velocity:number = 3;
  range:number = 25;
  dTime:number = 0;
  halfScreen:number = 50;

  constructor(dotElement:HTMLElement)
  {
    let gameElementInstance: GameElement | null = null;
    super(dotElement, gameElementInstance);
    gameElementInstance = this;
    this.dotElement = dotElement;

    window.addEventListener('Game:VelocityValueChanged', (event: Event) => {
      this.velocity = parseFloat((event as CustomEvent).detail.velocity);
    });

    window.addEventListener('Game:RadiusValueChanged', (event: Event) => {
      this.Radius = parseFloat((event as CustomEvent).detail.radius);
    });

    window.addEventListener('Game:RangeValueChanged', (event: Event) => {
      this.range = parseFloat((event as CustomEvent).detail.range);
    });
  }

  get Radius():number
  {
    return parseFloat(getComputedStyle(this.dotElement).getPropertyValue("--radius")) || 2;
  }

  set Radius(value:number)
  {
    this.dotElement.style.setProperty("--radius", value.toString());
  }

  Update(dTime:number):void
  {
    this.dTime = dTime;
    RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].Execute(this);
  }
}
