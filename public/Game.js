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
    SetNumberInputEvents();
    SetSliderStepButtons();
    SetTargetColorEvent();
    SetBackgroundColorEvent();
    SetControlsPanelToggleEvent();
    SubscribeToRoutineChangedEvent();
    SubscribeToNotificationsButtonClick();
    LoadSavedSettings();
};
/*
    ROUTINE ARROWS
*/
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
/*
    SPEED
*/
const SetVelocityChangeEvent = () => {
    const slider = document.getElementById("velocityslider");
    const valueInput = document.getElementById("velocityvalue");
    slider.addEventListener("input", () => {
        valueInput.value =
            formatSliderValue(slider.value);
        window.dispatchEvent(new CustomEvent('Game:VelocityValueChanged', {
            detail: {
                velocity: slider.value
            }
        }));
        localStorage.setItem("blinkcamp-speed", slider.value);
    });
};
/*
    SIZE
*/
const SetRadiusChangeEvent = () => {
    const slider = document.getElementById("sizeslider");
    const valueInput = document.getElementById("sizevalue");
    slider.addEventListener("input", () => {
        valueInput.value =
            formatSliderValue(slider.value);
        window.dispatchEvent(new CustomEvent('Game:RadiusValueChanged', {
            detail: {
                radius: slider.value
            }
        }));
        localStorage.setItem("blinkcamp-size", slider.value);
    });
};
/*
    RANGE
*/
const SetRangeChangeEvent = () => {
    const slider = document.getElementById("rangeslider");
    const valueInput = document.getElementById("rangevalue");
    slider.addEventListener("input", () => {
        valueInput.value =
            formatSliderValue(slider.value);
        window.dispatchEvent(new CustomEvent('Game:RangeValueChanged', {
            detail: {
                range: slider.value
            }
        }));
        localStorage.setItem("blinkcamp-range", slider.value);
    });
};
/*
    EDITABLE NUMBER BOXES
*/
const SetNumberInputEvents = () => {
    SetupNumberInput("velocityvalue", "velocityslider");
    SetupNumberInput("sizevalue", "sizeslider");
    SetupNumberInput("rangevalue", "rangeslider");
};
const SetupNumberInput = (inputId, sliderId) => {
    const input = document.getElementById(inputId);
    const slider = document.getElementById(sliderId);
    /*
        Press Enter to apply the typed value.
    */
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            CommitNumberInput(input, slider);
            input.blur();
        }
    });
    /*
        Clicking somewhere else after typing
        also applies the value.
    */
    input.addEventListener("change", () => {
        CommitNumberInput(input, slider);
    });
    /*
        Select the current number when
        clicking into the box.
    */
    input.addEventListener("focus", () => {
        input.select();
    });
};
const CommitNumberInput = (input, slider) => {
    let newValue = parseFloat(input.value);
    /*
        If the typed value is invalid,
        restore the current slider value.
    */
    if (Number.isNaN(newValue)) {
        input.value =
            formatSliderValue(slider.value);
        return;
    }
    const minimum = parseFloat(slider.min);
    const maximum = parseFloat(slider.max);
    /*
        Keep values inside the allowed range.
    */
    newValue =
        Math.max(minimum, Math.min(maximum, newValue));
    /*
        Respect the slider step.
    */
    const step = parseFloat(slider.step);
    if (!Number.isNaN(step) &&
        step > 0) {
        const stepCount = Math.round((newValue - minimum) /
            step);
        newValue =
            minimum +
                (stepCount * step);
    }
    /*
        Prevent floating-point artifacts.
    */
    newValue =
        Math.round(newValue * 1000) / 1000;
    slider.value =
        newValue.toString();
    /*
        Trigger normal slider behavior.
    */
    slider.dispatchEvent(new Event("input"));
};
/*
    PLUS / MINUS BUTTONS
*/
const SetSliderStepButtons = () => {
    SetupSliderStepButtons("velocityslider", "velocityminus", "velocityplus", 0.25);
    SetupSliderStepButtons("sizeslider", "sizeminus", "sizeplus", 0.25);
    SetupSliderStepButtons("rangeslider", "rangeminus", "rangeplus", 1);
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
    let next = parseFloat(slider.value) +
        amount;
    next =
        Math.max(minimum, Math.min(maximum, next));
    next =
        Math.round(next * 1000) / 1000;
    slider.value =
        next.toString();
    slider.dispatchEvent(new Event("input"));
};
/*
    TARGET COLOR
*/
const SetTargetColorEvent = () => {
    const picker = document.getElementById("targetcolor");
    picker.addEventListener("input", () => {
        document.documentElement.style.setProperty("--dot-color", picker.value);
        localStorage.setItem("blinkcamp-target-color", picker.value);
    });
};
/*
    BACKGROUND COLOR
*/
const SetBackgroundColorEvent = () => {
    const picker = document.getElementById("backgroundcolor");
    picker.addEventListener("input", () => {
        document.documentElement.style.setProperty("--background-color", picker.value);
        localStorage.setItem("blinkcamp-background-color", picker.value);
    });
};
/*
    CONTROL PANEL HIDE / REVEAL
*/
const SetControlsPanelToggleEvent = () => {
    const controlArea = document.querySelector(".ui");
    let hiddenByClick = false;
    /*
        CLICKING THE CONTROL AREA

        Clicking sliders, number boxes,
        +/- buttons, color pickers or arrows
        continues to operate those controls normally.

        Clicking an empty/text portion of the
        controller toggles complete invisibility.
    */
    controlArea.addEventListener("click", (event) => {
        const target = event.target;
        const isControl = target.closest("input, button, .arrow, label");
        if (isControl) {
            return;
        }
        /*
            If it is currently hidden,
            clicking the invisible area
            brings it back immediately.
        */
        if (hiddenByClick) {
            hiddenByClick = false;
            controlArea.classList.remove("controls-click-hidden");
            controlArea.classList.remove("controls-hidden");
            return;
        }
        /*
            Otherwise hide it completely.
        */
        hiddenByClick = true;
        controlArea.classList.remove("controls-hidden");
        controlArea.classList.add("controls-click-hidden");
    });
    /*
        After hiding it, moving the mouse OUT
        keeps the controls completely invisible
        but prepares the invisible area so that
        hovering back into it reveals the controls.
    */
    controlArea.addEventListener("mouseleave", () => {
        if (!hiddenByClick) {
            return;
        }
        controlArea.classList.remove("controls-click-hidden");
        controlArea.classList.add("controls-hidden");
    });
    /*
        If the panel was hidden and the pointer
        comes back into the bottom-left activation
        area, restore the controls.
    */
    controlArea.addEventListener("mouseenter", () => {
        if (hiddenByClick &&
            controlArea.classList.contains("controls-hidden")) {
            hiddenByClick = false;
            controlArea.classList.remove("controls-hidden");
            controlArea.classList.remove("controls-click-hidden");
        }
    });
};
/*
    LOAD SAVED SETTINGS
*/
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
    if (savedSpeed !== null) {
        velocity.value =
            savedSpeed;
    }
    if (savedSize !== null) {
        radius.value =
            savedSize;
    }
    if (savedRange !== null) {
        range.value =
            savedRange;
    }
    if (savedTargetColor !== null) {
        target.value =
            savedTargetColor;
        document.documentElement.style.setProperty("--dot-color", savedTargetColor);
    }
    if (savedBackgroundColor !== null) {
        background.value =
            savedBackgroundColor;
        document.documentElement.style.setProperty("--background-color", savedBackgroundColor);
    }
    velocity.dispatchEvent(new Event("input"));
    radius.dispatchEvent(new Event("input"));
    range.dispatchEvent(new Event("input"));
};
/*
    DISPLAY FORMATTING
*/
const formatSliderValue = (value) => {
    const numberValue = parseFloat(value);
    if (Number.isInteger(numberValue)) {
        return numberValue.toString();
    }
    return parseFloat(numberValue.toFixed(3)).toString();
};
InitializeScene();
