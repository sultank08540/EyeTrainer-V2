export class GameElement {
    constructor(element, gameElementInstance = null) {
        this.element = element;
        GameElement.instances.push(this);
    }
    get X() {
        return parseFloat(getComputedStyle(this.element).getPropertyValue("--x")) || 50;
    }
    set X(value) {
        this.element.style.setProperty("--x", value.toString());
    }
    get Y() {
        return parseFloat(getComputedStyle(this.element).getPropertyValue("--y")) || 50;
    }
    set Y(value) {
        this.element.style.setProperty("--y", value.toString());
    }
    Update(_dTime) { }
}
GameElement.instances = [];
