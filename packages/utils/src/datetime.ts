export const formatDateToUTCString = (date: number) => {
  const isoDate = new Date(date).toISOString();

  return `${isoDate.substring(0, 10)} ${isoDate.substring(11, 19)}`;
};

export const formatSecondsToMinutes = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};
