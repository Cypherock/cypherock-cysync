export const getFractionPercentage = (item: string) => {
  const numberArray = item.split('/');
  const firstNumber = parseInt(numberArray[0], 10);
  const secondNumber = parseInt(numberArray[1], 10);
  return `${(firstNumber / secondNumber) * 100}%`;
};
