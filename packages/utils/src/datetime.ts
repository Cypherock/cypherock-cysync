export const formatDateToUTCString = (date: number) => {
  const isoDate = new Date(date).toISOString();

  return `${isoDate.substring(0, 10)} ${isoDate.substring(11, 19)}`;
};
