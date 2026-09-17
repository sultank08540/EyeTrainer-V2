import { Dot } from "./Dot/Dot.js";
import RoutineManager from "./Dot/DotRoutineManager.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { SubscribeToNotificationsButtonClick } from "./PushNotifications.js";
const DEFAULT_SETTINGS = {
    "speed": "3",
    "size": "2",
    "range": "25",
    "height": "50",
    "target-color": "#e2b714",
    "background-color": "#1e1e1e"
};
const LEGACY_STORAGE_KEYS = {
    "speed": "blinkcamp-speed",
    "size": "blinkcamp-size",
    "range": "blinkcamp-range",
    "target-color": "blinkcamp-target-color",
    "background-color": "blinkcamp-background-color"
};
const HEIGHT_ENABLED_ROUTINES = new Set([
    "Left Right Left",
    "Horizontal Saccades"
]);
const GetActiveRoutineTitle = () => RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].title;
const GetRoutineStorageKey = (setting) => `blinkcamp-routine-${encodeURIComponent(GetActiveRoutineTitle())}-${setting}`;
const SaveRoutineSetting = (setting, value) => {
    localStorage.setItem(GetRoutineStorageKey(setting), value);
};
const GetSavedRoutineSetting = (setting) => {
    const routineValue = localStorage.getItem(GetRoutineStorageKey(setting));
    if (routineValue !== null) {
        return routineValue;
    }
    const legacyKey = LEGACY_STORAGE_KEYS[setting];
    if (legacyKey !== undefined) {
        const legacyValue = localStorage.getItem(legacyKey);
        if (legacyValue !== null) {
            return legacyValue;
        }
    }
    return DEFAULT_SETTINGS[setting];
};
const InitializeScene = () => {
    new Dot(document.getElementById("dot"));
    SetLeftArrowEvent();
    SetRightArrowEvent();
    SetupSliderControl("velocityslider", "velocityvalue", "speed", "Game:VelocityValueChanged", "velocity");
    SetupSliderControl("sizeslider", "sizevalue", "size", "Game:RadiusValueChanged", "radius");
    SetupSliderControl("rangeslider", "rangevalue", "range", "Game:RangeValueChanged", "range");
    SetupSliderControl("heightslider", "heightvalue", "height", "Game:VerticalPositionChanged", "height");
    SetNumberInputEvents();
    SetSliderStepButtons();
    SetColorEvent("targetcolor", "target-color", "--dot-color");
    SetColorEvent("backgroundcolor", "background-color", "--background-color");
    SetControlsPanelToggleEvent();
    SubscribeToRoutineChangedEvent();
    SubscribeToNotificationsButtonClick();
    window.addEventListener("DotRoutineManager:RoutineChanged", LoadSavedSettings);
    LoadSavedSettings();
};
/* ROUTINE ARROWS */
const SetLeftArrowEvent = () => {
    const leftArrowClickEvent = new CustomEvent("Game:LeftArrowClick");
    const leftArrow = document.querySelector(".arrow.left");
    leftArrow.addEventListener("click", () => window.dispatchEvent(leftArrowClickEvent));
};
const SetRightArrowEvent = () => {
    const rightArrowClickEvent = new CustomEvent("Game:RightArrowClick");
    const rightArrow = document.querySelector(".arrow.right");
    rightArrow.addEventListener("click", () => window.dispatchEvent(rightArrowClickEvent));
};
/* SLIDERS */
const SetupSliderControl = (sliderId, valueInputId, setting, eventName, detailName) => {
    const slider = document.getElementById(sliderId);
    const valueInput = document.getElementById(valueInputId);
    slider.addEventListener("input", () => {
        valueInput.value = formatSliderValue(slider.value);
        window.dispatchEvent(new CustomEvent(eventName, {
            detail: {
                [detailName]: slider.value
            }
        }));
        SaveRoutineSetting(setting, slider.value);
    });
};
/* EDITABLE NUMBER BOXES */
const SetNumberInputEvents = () => {
    SetupNumberInput("velocityvalue", "velocityslider");
    SetupNumberInput("sizevalue", "sizeslider");
    SetupNumberInput("rangevalue", "rangeslider");
    SetupNumberInput("heightvalue", "heightslider");
};
const SetupNumberInput = (inputId, sliderId) => {
    const input = document.getElementById(inputId);
    const slider = document.getElementById(sliderId);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            CommitNumberInput(input, slider);
            input.blur();
        }
    });
    input.addEventListener("change", () => {
        CommitNumberInput(input, slider);
    });
    input.addEventListener("focus", () => {
        input.select();
    });
};
const CommitNumberInput = (input, slider) => {
    let newValue = parseFloat(input.value);
    if (Number.isNaN(newValue)) {
        input.value = formatSliderValue(slider.value);
        return;
    }
    const minimum = parseFloat(slider.min);
    const maximum = parseFloat(slider.max);
    newValue = Math.max(minimum, Math.min(maximum, newValue));
    const step = parseFloat(slider.step);
    if (!Number.isNaN(step) && step > 0) {
        const stepCount = Math.round((newValue - minimum) / step);
        newValue = minimum + (stepCount * step);
    }
    newValue = Math.round(newValue * 1000) / 1000;
    slider.value = newValue.toString();
    slider.dispatchEvent(new Event("input"));
};
/* PLUS / MINUS BUTTONS */
const SetSliderStepButtons = () => {
    SetupSliderStepButtons("velocityslider", "velocityminus", "velocityplus", 0.05);
    SetupSliderStepButtons("sizeslider", "sizeminus", "sizeplus", 0.05);
    SetupSliderStepButtons("rangeslider", "rangeminus", "rangeplus", 1);
    SetupSliderStepButtons("heightslider", "heightminus", "heightplus", 1);
};
const SetupSliderStepButtons = (sliderId, minusId, plusId, increment) => {
    const slider = document.getElementById(sliderId);
    const minus = document.getElementById(minusId);
    const plus = document.getElementById(plusId);
    minus.addEventListener("click", () => {
        ChangeSliderValue(slider, -increment);
    });
    plus.addEventListener("click", () => {
        ChangeSliderValue(slider, increment);
    });
};
const ChangeSliderValue = (slider, amount) => {
    const minimum = parseFloat(slider.min);
    const maximum = parseFloat(slider.max);
    let next = parseFloat(slider.value) + amount;
    next = Math.max(minimum, Math.min(maximum, next));
    next = Math.round(next * 1000) / 1000;
    slider.value = next.toString();
    slider.dispatchEvent(new Event("input"));
};
/* COLORS */
const SetColorEvent = (pickerId, setting, cssVariable) => {
    const picker = document.getElementById(pickerId);
    picker.addEventListener("input", () => {
        document.documentElement.style.setProperty(cssVariable, picker.value);
        SaveRoutineSetting(setting, picker.value);
    });
};
/* HEIGHT CONTROL VISIBILITY */
const UpdateHeightControlVisibility = () => {
    const heightRow = document.getElementById("heightrow");
    heightRow.style.display = HEIGHT_ENABLED_ROUTINES.has(GetActiveRoutineTitle())
        ? "grid"
        : "none";
};
/* CONTROL PANEL HIDE / REVEAL */
const SetControlsPanelToggleEvent = () => {
    const controlArea = document.querySelector(".ui");
    let hiddenByClick = false;
    controlArea.addEventListener("click", (event) => {
        const target = event.target;
        const isControl = target.closest("input, button, .arrow, label");
        if (isControl) {
            return;
        }
        if (hiddenByClick) {
            hiddenByClick = false;
            controlArea.classList.remove("controls-click-hidden");
            controlArea.classList.remove("controls-hidden");
            return;
        }
        hiddenByClick = true;
        controlArea.classList.remove("controls-hidden");
        controlArea.classList.add("controls-click-hidden");
    });
    controlArea.addEventListener("mouseleave", () => {
        if (!hiddenByClick) {
            return;
        }
        controlArea.classList.remove("controls-click-hidden");
        controlArea.classList.add("controls-hidden");
    });
    controlArea.addEventListener("mouseenter", () => {
        if (hiddenByClick && controlArea.classList.contains("controls-hidden")) {
            hiddenByClick = false;
            controlArea.classList.remove("controls-hidden");
            controlArea.classList.remove("controls-click-hidden");
        }
    });
};
/* LOAD SETTINGS FOR THE ACTIVE ROUTINE */
const LoadSavedSettings = () => {
    const velocity = document.getElementById("velocityslider");
    const radius = document.getElementById("sizeslider");
    const range = document.getElementById("rangeslider");
    const height = document.getElementById("heightslider");
    const target = document.getElementById("targetcolor");
    const background = document.getElementById("backgroundcolor");
    velocity.value = GetSavedRoutineSetting("speed");
    radius.value = GetSavedRoutineSetting("size");
    range.value = GetSavedRoutineSetting("range");
    height.value = GetSavedRoutineSetting("height");
    target.value = GetSavedRoutineSetting("target-color");
    background.value = GetSavedRoutineSetting("background-color");
    document.documentElement.style.setProperty("--dot-color", target.value);
    document.documentElement.style.setProperty("--background-color", background.value);
    velocity.dispatchEvent(new Event("input"));
    radius.dispatchEvent(new Event("input"));
    range.dispatchEvent(new Event("input"));
    height.dispatchEvent(new Event("input"));
    SaveRoutineSetting("target-color", target.value);
    SaveRoutineSetting("background-color", background.value);
    UpdateHeightControlVisibility();
};
/* DISPLAY FORMATTING */
const formatSliderValue = (value) => {
    const numberValue = parseFloat(value);
    if (Number.isInteger(numberValue)) {
        return numberValue.toString();
    }
    return parseFloat(numberValue.toFixed(3)).toString();
};
InitializeScene();
