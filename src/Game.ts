import { Dot } from "./Dot/Dot.js";
import RoutineManager from "./Dot/DotRoutineManager.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { SubscribeToNotificationsButtonClick } from "./PushNotifications.js";

type RoutineSettingName =
    "speed" |
    "size" |
    "range" |
    "height" |
    "target-color" |
    "background-color";

const DEFAULT_SETTINGS: Record<RoutineSettingName, string> = {
    "speed": "3",
    "size": "2",
    "range": "25",
    "height": "50",
    "target-color": "#e2b714",
    "background-color": "#1e1e1e"
};

const LEGACY_STORAGE_KEYS: Partial<Record<RoutineSettingName, string>> = {
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

const GetActiveRoutineTitle = (): string =>
    RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].title;

const GetRoutineStorageKey = (setting: RoutineSettingName): string =>
    `blinkcamp-routine-${encodeURIComponent(GetActiveRoutineTitle())}-${setting}`;

const SaveRoutineSetting = (
    setting: RoutineSettingName,
    value: string
): void =>
{
    localStorage.setItem(GetRoutineStorageKey(setting), value);
};

const GetSavedRoutineSetting = (setting: RoutineSettingName): string =>
{
    const routineValue = localStorage.getItem(GetRoutineStorageKey(setting));
    if(routineValue !== null)
    {
        return routineValue;
    }

    const legacyKey = LEGACY_STORAGE_KEYS[setting];
    if(legacyKey !== undefined)
    {
        const legacyValue = localStorage.getItem(legacyKey);
        if(legacyValue !== null)
        {
            return legacyValue;
        }
    }

    return DEFAULT_SETTINGS[setting];
};

const InitializeScene = (): void =>
{
    new Dot(document.getElementById("dot")!);

    SetLeftArrowEvent();
    SetRightArrowEvent();

    SetupSliderControl(
        "velocityslider",
        "velocityvalue",
        "speed",
        "Game:VelocityValueChanged",
        "velocity"
    );

    SetupSliderControl(
        "sizeslider",
        "sizevalue",
        "size",
        "Game:RadiusValueChanged",
        "radius"
    );

    SetupSliderControl(
        "rangeslider",
        "rangevalue",
        "range",
        "Game:RangeValueChanged",
        "range"
    );

    SetupSliderControl(
        "heightslider",
        "heightvalue",
        "height",
        "Game:VerticalPositionChanged",
        "height"
    );

    SetNumberInputEvents();
    SetSliderStepButtons();

    SetColorEvent(
        "targetcolor",
        "target-color",
        "--dot-color"
    );

    SetColorEvent(
        "backgroundcolor",
        "background-color",
        "--background-color"
    );

    SetControlsPanelToggleEvent();

    SubscribeToRoutineChangedEvent();
    SubscribeToNotificationsButtonClick();

    window.addEventListener(
        "DotRoutineManager:RoutineChanged",
        LoadSavedSettings
    );

    LoadSavedSettings();
};

/* ROUTINE ARROWS */

const SetLeftArrowEvent = (): void =>
{
    const leftArrowClickEvent = new CustomEvent("Game:LeftArrowClick");
    const leftArrow = document.querySelector(".arrow.left") as HTMLDivElement;

    leftArrow.addEventListener(
        "click",
        () => window.dispatchEvent(leftArrowClickEvent)
    );
};

const SetRightArrowEvent = (): void =>
{
    const rightArrowClickEvent = new CustomEvent("Game:RightArrowClick");
    const rightArrow = document.querySelector(".arrow.right") as HTMLDivElement;

    rightArrow.addEventListener(
        "click",
        () => window.dispatchEvent(rightArrowClickEvent)
    );
};

/* SLIDERS */

const SetupSliderControl = (
    sliderId: string,
    valueInputId: string,
    setting: RoutineSettingName,
    eventName: string,
    detailName: string
): void =>
{
    const slider = document.getElementById(sliderId) as HTMLInputElement;
    const valueInput = document.getElementById(valueInputId) as HTMLInputElement;

    slider.addEventListener("input", () =>
    {
        valueInput.value = formatSliderValue(slider.value);

        window.dispatchEvent(
            new CustomEvent(
                eventName,
                {
                    detail: {
                        [detailName]: slider.value
                    }
                }
            )
        );

        SaveRoutineSetting(setting, slider.value);
    });
};

/* EDITABLE NUMBER BOXES */

const SetNumberInputEvents = (): void =>
{
    SetupNumberInput("velocityvalue", "velocityslider");
    SetupNumberInput("sizevalue", "sizeslider");
    SetupNumberInput("rangevalue", "rangeslider");
    SetupNumberInput("heightvalue", "heightslider");
};

const SetupNumberInput = (
    inputId: string,
    sliderId: string
): void =>
{
    const input = document.getElementById(inputId) as HTMLInputElement;
    const slider = document.getElementById(sliderId) as HTMLInputElement;

    input.addEventListener("keydown", (event: KeyboardEvent) =>
    {
        if(event.key === "Enter")
        {
            CommitNumberInput(input, slider);
            input.blur();
        }
    });

    input.addEventListener("change", () =>
    {
        CommitNumberInput(input, slider);
    });

    input.addEventListener("focus", () =>
    {
        input.select();
    });
};

const CommitNumberInput = (
    input: HTMLInputElement,
    slider: HTMLInputElement
): void =>
{
    let newValue = parseFloat(input.value);

    if(Number.isNaN(newValue))
    {
        input.value = formatSliderValue(slider.value);
        return;
    }

    const minimum = parseFloat(slider.min);
    const maximum = parseFloat(slider.max);

    newValue = Math.max(minimum, Math.min(maximum, newValue));

    const step = parseFloat(slider.step);
    if(!Number.isNaN(step) && step > 0)
    {
        const stepCount = Math.round((newValue - minimum) / step);
        newValue = minimum + (stepCount * step);
    }

    newValue = Math.round(newValue * 1000) / 1000;

    slider.value = newValue.toString();
    slider.dispatchEvent(new Event("input"));
};

/* PLUS / MINUS BUTTONS */

const SetSliderStepButtons = (): void =>
{
    SetupSliderStepButtons(
        "velocityslider",
        "velocityminus",
        "velocityplus",
        0.05
    );

    SetupSliderStepButtons(
        "sizeslider",
        "sizeminus",
        "sizeplus",
        0.05
    );

    SetupSliderStepButtons(
        "rangeslider",
        "rangeminus",
        "rangeplus",
        1
    );

    SetupSliderStepButtons(
        "heightslider",
        "heightminus",
        "heightplus",
        1
    );
};

const SetupSliderStepButtons = (
    sliderId: string,
    minusId: string,
    plusId: string,
    increment: number
): void =>
{
    const slider = document.getElementById(sliderId) as HTMLInputElement;
    const minus = document.getElementById(minusId) as HTMLButtonElement;
    const plus = document.getElementById(plusId) as HTMLButtonElement;

    minus.addEventListener("click", () =>
    {
        ChangeSliderValue(slider, -increment);
    });

    plus.addEventListener("click", () =>
    {
        ChangeSliderValue(slider, increment);
    });
};

const ChangeSliderValue = (
    slider: HTMLInputElement,
    amount: number
): void =>
{
    const minimum = parseFloat(slider.min);
    const maximum = parseFloat(slider.max);

    let next = parseFloat(slider.value) + amount;
    next = Math.max(minimum, Math.min(maximum, next));
    next = Math.round(next * 1000) / 1000;

    slider.value = next.toString();
    slider.dispatchEvent(new Event("input"));
};

/* COLORS */

const SetColorEvent = (
    pickerId: string,
    setting: RoutineSettingName,
    cssVariable: string
): void =>
{
    const picker = document.getElementById(pickerId) as HTMLInputElement;

    picker.addEventListener("input", () =>
    {
        document.documentElement.style.setProperty(cssVariable, picker.value);
        SaveRoutineSetting(setting, picker.value);
    });
};

/* HEIGHT CONTROL VISIBILITY */

const UpdateHeightControlVisibility = (): void =>
{
    const heightRow = document.getElementById("heightrow") as HTMLDivElement;
    heightRow.style.display = HEIGHT_ENABLED_ROUTINES.has(GetActiveRoutineTitle())
        ? "grid"
        : "none";
};

/* CONTROL PANEL HIDE / REVEAL */

const SetControlsPanelToggleEvent = (): void =>
{
    const controlArea = document.querySelector(".ui") as HTMLDivElement;
    let hiddenByClick = false;

    controlArea.addEventListener("click", (event: MouseEvent) =>
    {
        const target = event.target as HTMLElement;
        const isControl = target.closest("input, button, .arrow, label");

        if(isControl)
        {
            return;
        }

        if(hiddenByClick)
        {
            hiddenByClick = false;
            controlArea.classList.remove("controls-click-hidden");
            controlArea.classList.remove("controls-hidden");
            return;
        }

        hiddenByClick = true;
        controlArea.classList.remove("controls-hidden");
        controlArea.classList.add("controls-click-hidden");
    });

    controlArea.addEventListener("mouseleave", () =>
    {
        if(!hiddenByClick)
        {
            return;
        }

        controlArea.classList.remove("controls-click-hidden");
        controlArea.classList.add("controls-hidden");
    });

    controlArea.addEventListener("mouseenter", () =>
    {
        if(hiddenByClick && controlArea.classList.contains("controls-hidden"))
        {
            hiddenByClick = false;
            controlArea.classList.remove("controls-hidden");
            controlArea.classList.remove("controls-click-hidden");
        }
    });
};

/* LOAD SETTINGS FOR THE ACTIVE ROUTINE */

const LoadSavedSettings = (): void =>
{
    const velocity = document.getElementById("velocityslider") as HTMLInputElement;
    const radius = document.getElementById("sizeslider") as HTMLInputElement;
    const range = document.getElementById("rangeslider") as HTMLInputElement;
    const height = document.getElementById("heightslider") as HTMLInputElement;
    const target = document.getElementById("targetcolor") as HTMLInputElement;
    const background = document.getElementById("backgroundcolor") as HTMLInputElement;

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

const formatSliderValue = (value: string): string =>
{
    const numberValue = parseFloat(value);

    if(Number.isInteger(numberValue))
    {
        return numberValue.toString();
    }

    return parseFloat(numberValue.toFixed(3)).toString();
};

InitializeScene();
