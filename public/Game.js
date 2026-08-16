import { Dot } from "./Dot/Dot.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { SubscribeToNotificationsButtonClick } from "./PushNotifications.js";
const InitializeScene = () => {
    new Dot(document.getElementById("dot"));
    SetLeftArrowEvent();
    SetRightArrowEvent();
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    SetRangeChangeEvent();
    SetSliderStepButtons();
    SetTargetColorEvent();
    SetBackgroundColorEvent();
    SubscribeToRoutineChangedEvent();
    SubscribeToNotificationsButtonClick();
    LoadSavedSettings();
};
const SetLeftArrowEvent = () => {
    const leftArrowClickEvent = new CustomEvent('Game:LeftArrowClick');
    const leftArrow = document.querySelector(".arrow.left");
    leftArrow.addEventListener("click", () => window.dispatchEvent(leftArrowClickEvent));
};
const SetRightArrowEvent = () => {
    const rightArrowClickEvent = new CustomEvent('Game:RightArrowClick');
    const rightArrow = document.querySelector(".arrow.right");
    rightArrow.addEventListener("click", () => window.dispatchEvent(rightArrowClickEvent));
};
const SetVelocityChangeEvent = () => {
    const slider = document.getElementById("velocityslider");
    const value = document.getElementById("velocityvalue");
    const event = new CustomEvent('Game:VelocityValueChanged', { detail: { velocity: slider.value } });
    slider.addEventListener("input", () => {
        value.textContent = formatSliderValue(slider.value);
        event.detail.velocity = slider.value;
        window.dispatchEvent(event);
        localStorage.setItem("blinkcamp-speed", slider.value);
    });
};
const SetRadiusChangeEvent = () => {
    const slider = document.getElementById("sizeslider");
    const value = document.getElementById("sizevalue");
    const event = new CustomEvent('Game:RadiusValueChanged', { detail: { radius: slider.value } });
    slider.addEventListener("input", () => {
        value.textContent = formatSliderValue(slider.value);
        event.detail.radius = slider.value;
        window.dispatchEvent(event);
        localStorage.setItem("blinkcamp-size", slider.value);
    });
};
const SetRangeChangeEvent = () => {
    const slider = document.getElementById("rangeslider");
    const value = document.getElementById("rangevalue");
    const event = new CustomEvent('Game:RangeValueChanged', { detail: { range: slider.value } });
    slider.addEventListener("input", () => {
        value.textContent = slider.value;
        event.detail.range = slider.value;
        window.dispatchEvent(event);
        localStorage.setItem("blinkcamp-range", slider.value);
    });
};
const SetSliderStepButtons = () => {
    SetupSliderStepButtons("velocityslider", "velocityminus", "velocityplus", 0.25);
    SetupSliderStepButtons("sizeslider", "sizeminus", "sizeplus", 0.25);
    SetupSliderStepButtons("rangeslider", "rangeminus", "rangeplus", 1);
};
const SetupSliderStepButtons = (sliderId, minusId, plusId, increment) => {
    const slider = document.getElementById(sliderId);
    const minus = document.getElementById(minusId);
    const plus = document.getElementById(plusId);
    minus.addEventListener("click", () => ChangeSliderValue(slider, -increment));
    plus.addEventListener("click", () => ChangeSliderValue(slider, increment));
};
const ChangeSliderValue = (slider, amount) => {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    let next = parseFloat(slider.value) + amount;
    next = Math.max(min, Math.min(max, next));
    next = Math.round(next * 1000) / 1000;
    slider.value = next.toString();
    slider.dispatchEvent(new Event("input"));
};
const SetTargetColorEvent = () => {
    const picker = document.getElementById("targetcolor");
    picker.addEventListener("input", () => {
        document.documentElement.style.setProperty("--dot-color", picker.value);
        localStorage.setItem("blinkcamp-target-color", picker.value);
    });
};
const SetBackgroundColorEvent = () => {
    const picker = document.getElementById("backgroundcolor");
    picker.addEventListener("input", () => {
        document.documentElement.style.setProperty("--background-color", picker.value);
        localStorage.setItem("blinkcamp-background-color", picker.value);
    });
};
const LoadSavedSettings = () => {
    const velocity = document.getElementById("velocityslider");
    const radius = document.getElementById("sizeslider");
    const range = document.getElementById("rangeslider");
    const target = document.getElementById("targetcolor");
    const background = document.getElementById("backgroundcolor");
    const savedSpeed = localStorage.getItem("blinkcamp-speed");
    const savedSize = localStorage.getItem("blinkcamp-size");
    const savedRange = localStorage.getItem("blinkcamp-range");
    const savedTargetColor = localStorage.getItem("blinkcamp-target-color");
    const savedBackgroundColor = localStorage.getItem("blinkcamp-background-color");
    if (savedSpeed !== null)
        velocity.value = savedSpeed;
    if (savedSize !== null)
        radius.value = savedSize;
    if (savedRange !== null)
        range.value = savedRange;
    if (savedTargetColor !== null) {
        target.value = savedTargetColor;
        document.documentElement.style.setProperty("--dot-color", savedTargetColor);
    }
    if (savedBackgroundColor !== null) {
        background.value = savedBackgroundColor;
        document.documentElement.style.setProperty("--background-color", savedBackgroundColor);
    }
    velocity.dispatchEvent(new Event("input"));
    radius.dispatchEvent(new Event("input"));
    range.dispatchEvent(new Event("input"));
};
const formatSliderValue = (value) => {
    const numberValue = parseFloat(value);
    if (Number.isInteger(numberValue))
        return numberValue.toString();
    return numberValue.toFixed(2);
};
InitializeScene();
