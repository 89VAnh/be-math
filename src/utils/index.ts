export const convertNumber = (value: any, defaultNumber: number): number => {
  if (value === null || value === undefined) return defaultNumber;

  const num = Number(value);
  if (isNaN(num)) return defaultNumber;
  else return num;
};
