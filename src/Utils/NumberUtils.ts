export const GetRandomNumberInBetween = (min:number, max:number):number => {
  return Math.random() * (max - min) + min;
};
