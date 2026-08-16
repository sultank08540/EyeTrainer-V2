import { IGameElement } from "./IGameElement.js";

export class GameElement implements IGameElement {
  static instances: GameElement[] = [];

  protected element: HTMLElement;

  constructor(element: HTMLElement, gameElementInstance: GameElement | null = null) {
    this.element = element;
    GameElement.instances.push(this);
  }

  get X(): number {
    return parseFloat(getComputedStyle(this.element).getPropertyValue("--x")) || 50;
  }

  set X(value:number) {
    this.element.style.setProperty("--x", value.toString());
  }

  get Y(): number {
    return parseFloat(getComputedStyle(this.element).getPropertyValue("--y")) || 50;
  }

  set Y(value:number) {
    this.element.style.setProperty("--y", value.toString());
  }

  Update(_dTime:number): void {}
}
