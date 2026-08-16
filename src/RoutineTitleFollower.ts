import RoutineManager from "./Dot/DotRoutineManager.js";

export const SubscribeToRoutineChangedEvent = () => {
  const title = document.querySelector(".routinename") as HTMLDivElement;

  const update = () => {
    title.textContent = RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].title;
  };

  window.addEventListener('DotRoutineManager:RoutineChanged', update);
  update();
};
