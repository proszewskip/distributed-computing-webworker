import { differenceInSeconds } from 'date-fns';

export type getRerenderTimeoutFnType = (eventDate: Date) => number;

export const getRerenderTimeout: getRerenderTimeoutFnType = (
  eventDate: Date,
) => {
  const currentDate = new Date();

  const datesDifferenceInSeconds = differenceInSeconds(currentDate, eventDate);

  let rerenderDelay = 0;

  if (datesDifferenceInSeconds < 60) {
    rerenderDelay = 10;
  } else if (datesDifferenceInSeconds < 120) {
    rerenderDelay = 30;
  } else if (datesDifferenceInSeconds < 10 * 60) {
    rerenderDelay = 60;
  } else {
    rerenderDelay = 5 * 60;
  }

  return rerenderDelay * 1000;
};
